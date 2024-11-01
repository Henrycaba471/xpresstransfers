
let linkToAvalible = 'https://backend-transfers.onrender.com'
//let linkToAvalible = 'http://localhost:5000'

document.addEventListener('DOMContentLoaded', async (e) => {

    const btnUserOptions = document.getElementById('profile-options');
    const optionsUser = document.querySelector('.opciones-user');

    btnUserOptions.addEventListener('click', () => {
        optionsUser.classList.toggle('optiones-user-active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('#profile-options')) {
            optionsUser.classList.remove('optiones-user-active');
        }
    });

    const token = localStorage.getItem('authToken');

    //console.log(token);

    if (!token) {
        window.location.href = 'index.html'; // Redirigir si no hay token
    } else {
        try {

            //prod https://backend-transfers.onrender.com/api/users/dashboard
            //local http://localhost:5000/api/users/

            const response = await fetch(`${linkToAvalible}/api/users/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            //console.log(data);

            if (data.status === 200) {
                // Mostrar los datos del usuario en el dashboard
                document.getElementById('profile').src = `Assets/imgs/${data.user.gender}.png`
                document.getElementById('user').textContent = `${data.user.name} ${data.user.lastname.split(' ')[0]}`;
                (data.user.gender === 'mujer') ? document.getElementById('rol').textContent = 'Cajera' : document.getElementById('rol').textContent = 'Cajero';
                document.getElementById('date').textContent = new Date().toLocaleString();
                document.getElementById('sucursal').textContent = 'Sucursal: 0001';

                document.getElementById('send-transfer').addEventListener('click', async () => {
                    //prod https://backend-transfers.onrender.com/api/users/send-transf
                    const response = await fetch(`${linkToAvalible}/api/users/send-transf`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    //document.querySelector('.send-info').innerHTML = '';
                    document.querySelector('.operations').innerHTML = data.form;
                });

                document.getElementById('search-trasfer').addEventListener('click', async () => {
                    //prod https://backend-transfers.onrender.com/api/users/send-transf
                    const response = await fetch(`${linkToAvalible}/api/users/search-transfers`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    //document.querySelector('.send-info').innerHTML = '';
                    document.querySelector('.operations').innerHTML = data.form;
                });

                document.getElementById('update-transfer').addEventListener('click', async () => {
                    //prod https://backend-transfers.onrender.com/api/users/send-transf
                    const response = await fetch(`${linkToAvalible}/api/transfers/update-transfer`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    //document.querySelector('.send-info').innerHTML = '';
                    document.querySelector('.operations').innerHTML = data.form;
                });

                document.addEventListener('click', async (e) => {

                    if (e.target.matches('#btn-send')) {
                        e.preventDefault();

                        const formSend = document.querySelector('.form-send-transf');
                        const dataTransfer = {
                            bankEntity: formSend.elements.bankEntity.value,
                            accountType: formSend.elements.accountType.value,
                            account: formSend.elements.account.value,
                            nameClient: formSend.elements.nameClient.value,
                            documentClient: formSend.elements.documentClient.value,
                            cashBs: formSend.elements.cashBs.value,
                            created_at: new Date().toLocaleString()
                        }

                        if (!dataTransfer.bankEntity || !dataTransfer.account || !dataTransfer.documentClient || !dataTransfer.cashBs) {
                            return alert('Los campos con * son obligatorios');
                        }

                        const confirmData = confirm(`DATOS DE LA TRANSACCIÓN\n_______________________________________________________\nBANCO: ${dataTransfer.bankEntity.toUpperCase()} - ${dataTransfer.accountType.toUpperCase()}\nN° CUENTA: ${dataTransfer.account}\nDESTINATARIO: ${dataTransfer.nameClient.toUpperCase()}\nDNI: ${dataTransfer.documentClient}\nVALOR: Bs ${dataTransfer.cashBs}\n_______________________________________________________
                        `);
                        if (confirmData) {
                            //prod https://backend-transfers.onrender.com/api/transfers/send-transfer
                            try {
                                const response = await fetch(`${linkToAvalible}/api/transfers/send-transfer`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(dataTransfer)
                                });

                                const data = await response.json();

                                if (data.error) {
                                    console.log(data);
                                    return alert(data.msg)
                                }
                                //console.log(data.detailSend);

                                const contenido = `
                    <style>
                        *{
                            padding: 0;
                            margin: 0;
                            box-sizing: border-box;
                        }
                        @page{
                            margin: 1cm;
                        }
                        span{
                            font-size: 20px;
                        }
                    </style>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    TRANSFERENCIAS A VENEZUELA <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    <br>
                    FECHA: ${new Date().toLocaleString()}<br>
                    VENDEDOR: ${data.detailSend.user.documento}<br>
                    REF: ${data.detailSend.fact} <br>
                    BANCO: <br>
                    ${data.detailSend.bankEntity.toUpperCase()} - ${data.detailSend.accountType.toUpperCase()}<br>
                    CUENTA N°:<br>
                    <span>${dataTransfer.account}<br></span>
                    NOMBRE: ${dataTransfer.nameClient.toUpperCase()}<br>
                    <span>CV: ${dataTransfer.documentClient}</span><br>
                    <br>
                    SOBERANOS <span>B$: ${dataTransfer.cashBs}</span><br>
                    <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    RESP: JOSE TRINIDAD GARCIA <br>
                    WhatsApp: 3124824321 <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    <br>
                    <br>
                    FIRMA CAJERO:_______________________<br>
                    <br>
                    <br>
                    `

                                const windowPrint = window.open('', 'Impresion', 'width=600,height=600');
                                windowPrint.document.write(contenido);
                                windowPrint.document.close();
                                windowPrint.print();

                                //console.log(contenido);
                                dataTransfer.bankEntity = formSend.elements.bankEntity.value = '';
                                dataTransfer.accountType = formSend.elements.accountType.value = '';
                                dataTransfer.account = formSend.elements.account.value = '';
                                dataTransfer.nameClient = formSend.elements.nameClient.value = '';
                                dataTransfer.documentClient = formSend.elements.documentClient.value = '';
                                dataTransfer.cashBs = formSend.elements.cashBs.value = '';

                                location.reload();

                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            alert('Transacción cancelada')
                        }
                    }

                    if (e.target.matches('#btn-search')) {
                        e.preventDefault();
                        const formSearch = document.querySelector('.form-search');

                        const dataSearch = {
                            ref: formSearch.elements.consult.value,
                            search: formSearch.elements.searching.value,
                            date: formSearch.elements.date.value
                        }

                        if (!dataSearch.search && !dataSearch.date) {
                            return alert('Debes seleccionar una fecha o valor para buscar');
                        }

                        if (new Date(dataSearch.date) < new Date() || !dataSearch.date) {
                            try {
                                const response = await fetch(`${linkToAvalible}/api/transfers/ver-transfers`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': 'Bearer ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(dataSearch)
                                });

                                if (!response.ok) {
                                    throw new Error('Network response was not ok ' + response.statusText);
                                }

                                const data = await response.json();
                                const searchData = document.querySelector('.data-transfers-get');

                                if (!data.data) {
                                    return searchData.innerHTML = `<h1>Resultados de la búsqueda</h1><table>
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Dni</th>
                                            <th>Banco</th>
                                            <th>Cuenta</th>
                                            <th>Valor Bs</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td colspan="5"> No se encontró ningún resultado</td></tr></tbody></table>`;
                                }

                                if (data.data.length > 0) {
                                    let html = `
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Cliente</th>
                                                <th>Dni</th>
                                                <th>Banco</th>
                                                <th>Cuenta</th>
                                                <th>Valor Bs</th>
                                                <th>Reimprimir</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;

                                    data.data.forEach((client) => {
                                        html += `
                                        <tr class="estado ${client.note}">
                                            <td>${client.nameClient}</td>
                                            <td>${client.documentClient}</td>
                                            <td>${client.bankEntity} - ${client.accountType}</td>
                                            <td>${client.account}</td>
                                            <td>Bs ${client.cashBs}</td>
                                            <td><img class="btn-print" src="Assets/imgs/imprimir.png" alt="Reimprimir" width="30" title="Reimprimir" /></td>
                                        </tr>`;
                                    });

                                    html += `
                                        </tbody>
                                    </table>`;

                                    searchData.innerHTML = `<div>
                                        <h1>Resultados de la búsqueda</h1>
                                        ${html}
                                    </div>`;
                                } else {
                                    searchData.innerHTML = `<h1>Resultados de la búsqueda</h1><table>
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Dni</th>
                                            <th>Banco</th>
                                            <th>Cuenta</th>
                                            <th>Valor Bs</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td colspan="5"> No se encontró ningún resultado</td></tr></tbody></table>`;
                                }

                            } catch (error) {
                                console.error('Error fetching data:', error);
                                alert('Ocurrió un error al buscar los datos. Por favor, inténtelo de nuevo más tarde.');
                            }
                        } else {
                            alert('La fecha debe ser menor a la actual');
                        }
                    }

                    if (e.target.matches('#btn-update')) {
                        e.preventDefault();
                        const formUpdate = document.querySelector('.form-update');

                        const transfToUpdate = { fact: formUpdate.elements.updReference.value };

                        if (!transfToUpdate.fact) {
                            return alert('Por favor ingrese la referencia de la transferencia');
                        }

                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/update`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(transfToUpdate)
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            const data = await response.json();
                            const searchData = document.querySelector('.data-transfers-get');

                            if (data.data === null) {
                                return searchData.innerHTML = `<p>No se ha encontrado ninguna transferencia con esa referencia</p>`
                            }

                            searchData.innerHTML = `
                                <form class="form-update-transf ${data.data.status}">
                        <fieldset>
                        <legend>Datos del banco</legend>
                        <div>
                            <label for="banco">Banco:</label>
                            <input type="hidden" name="ref" id="ref" value="${data.data._id}">
                            <input type="hidden" name="user" id="user" value="${data.data.user}">
                            <input type="text" name="bankEntity" id="banco" placeholder="Entidad Bancaria" oninput="soloLetrasYEspacios(this);" value="${data.data.bankEntity}">
                            <label for="tipo">Tipo Cuenta:</label>
                            <select name="accountType" id="tipo">
                                <option value="${data.data.accountType}">${data.data.accountType}</option>
                                <option value="Ahorro">Ahorro</option>
                                <option value="Corriente">Corriente</option>
                                <option value="Pago Movil">Pago Movil</option>
                            </select>
                        </div>
                        <div>
                            <label for="cuenta">N° Cuenta:</label>
                            <input type="text" name="account" id="cuenta" oninput="formatAccount(this);" value="${data.data.account}">
                        </div>
                        </fieldset>
                        <fieldset>
                        <legend>Datos del cliente</legend>
                        <div class="cliente-sending">
                            <div>
                                <div>
                                <label for="nombre">Nombre Completo:</label>
                                <input type="text" name="nameClient" id="nombre" value="${data.data.nameClient}" oninput="soloLetrasYEspacios(this);">
                            </div>
                            <div>
                                <label for="doqument">N° Documento:</label>
                                <input type="text" name="documentClient" id="doqument" value="${data.data.documentClient}" oninput="separardorMiles(this);">
                            </div>
                            </div>
                            <div class="textarea">
                                <label>Nota:</label>
                                <textarea name="note" id="note" placeholder="Agregar nota">${data.data.note}</textarea>
                            </div>
                        </div>
                        </fieldset>
                        <fieldset>
                            <legend>Valor</legend>
                            <div>
                                <label for="valor">Valor B$</label>
                                <input type="text" name="cashBs" id="valor" value="${data.data.cashBs}" oninput="separardorMiles(this);" readonly>
                            </div>
                        </fieldset>
                        <button type="submit" class="${data.data.status}" id="btn-update-send">Actualizar</button>
                    </form>
                            `
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (e.target.matches('#btn-update-send')) {
                        e.preventDefault();
                        const formToUpdate = document.querySelector('.form-update-transf');
                        const btnSendUpd = document.getElementById('btn-update-send');

                        if (btnSendUpd.classList.contains('anulada')) {
                            btnSendUpd.disabled = true;
                            alert('Esta transacción esta anulada no se puede modificar');
                            return location.reload();
                        }
                        const dataToUpdate = {
                            bankEntity: formToUpdate.elements.bankEntity.value,
                            accountType: formToUpdate.elements.accountType.value,
                            account: formToUpdate.elements.account.value,
                            nameClient: formToUpdate.elements.nameClient.value,
                            documentClient: formToUpdate.elements.documentClient.value,
                            note: formToUpdate.elements.note.value
                        }

                        const idUpdate = document.getElementById('ref').value;

                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/update-transf/${idUpdate}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataToUpdate)
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            const data = await response.json();

                            if (data.error === true) {
                                alert(data.message);
                                return location.reload();
                            }

                            const contenido = `
                <style>
                    * {
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                    }
                    @page {
                        margin: 1cm;
                    }
                    body, div {
                        font-size: 16px; /* Ajusta el tamaño de letra general */
                        font-family: Arial, sans-serif; /* Opcional: cambia la fuente */
                    }
                    .highlight {
                        font-size: 18px; /* Tamaño de letra específico para partes resaltadas */
                    }
                    span{
                        font-size: 18px;
                    }
                </style>
                <div>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    TRANSFERENCIAS A VENEZUELA <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    <br>
                    <span class="highlight">ACTUALIZACIÓN DE DATOS</span><br>
                    <br>
                    FECHA ACTUALIZACIÓN: ${new Date().toLocaleString()}<br>
                    FECHA: ${data.detailUpdate.created_at}<br>
                    VENDEDOR: ${data.detailUpdate.user.documento}<br>
                    REF: ${data.detailUpdate.fact} <br>
                    BANCO: <br>
                    ${data.detailUpdate.bankEntity.toUpperCase()} - ${data.detailUpdate.accountType.toUpperCase()}<br>
                    CUENTA N°:<br>
                    <span class="highlight">${data.detailUpdate.account.match(/.{1,4}/g).join('-')}<br></span>
                    NOMBRE: ${data.detailUpdate.nameClient.toUpperCase()}<br>
                    <span>CV: ${Number(data.detailUpdate.documentClient).toLocaleString("es-CO")}</span><br>
                    <br>
                    SOBERANOS <span>B$: ${data.detailUpdate.cashBs}</span><br>
                    <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    RESP: JOSE TRINIDAD GARCIA <br>
                    WhatsApp: 3124824321 <br>
                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
                    <br>
                    FIRMA CAJERO:_______________________<br>
                    <br>
                    <br>
                    <br>
                    <br>
                </div>
            `;
                            const windowPrint = window.open('', 'Impresion', 'width=600,height=600');
                            windowPrint.document.write(contenido);
                            windowPrint.document.close();
                            windowPrint.print();

                            location.reload();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (e.target.matches('.logout')) {
                        localStorage.removeItem('authToken');
                        window.location.href = 'index.html'; // Redirigir si no hay token
                        location.reload();
                    }

                    if (e.target.matches('#cancel-transfer')) {
                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/cancel-transfer`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                }
                            });
                            const data = await response.json();

                            //document.querySelector('.send-info').innerHTML = '';
                            document.querySelector('.operations').innerHTML = data.form;
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (e.target.matches('#btn-search-cancel')) {
                        e.preventDefault();
                        const dataSearch = {
                            ref: document.getElementById('cancel-reference').value
                        }

                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/anular-transfer`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataSearch)
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }

                            const data = await response.json();
                            let html = document.querySelector('.data-transfers-get');
                            //console.log(data);
                            if (data.error === true) {
                                return html.innerHTML = `<h1>Resultados de la búsqueda</h1><table>
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Dni</th>
                                            <th>Banco</th>
                                            <th>Cuenta</th>
                                            <th>Valor Bs</th>
                                        </tr>
                                    </thead>
                                    <tbody><tr><td colspan="5">${data.msg}</td></tr></tbody></table><button>Regresar</button>`;
                            }
                            return html.innerHTML = `<h1>Resultados de la búsqueda</h1><table>
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Dni</th>
                                            <th>Banco</th>
                                            <th>Cuenta</th>
                                            <th>Valor Bs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="${data.data.status}">
                                            <td>${data.data.nameClient}</td>
                                            <td>${data.data.documentClient}</td>
                                            <td>${data.data.bankEntity}</td>
                                            <td>${data.data.account}</td>
                                            <td>${data.data.cashBs}</td>
                                        </tr>
                                    </tbody>
                            </table>
                            <input type="hidden" name="id" id="id-transf" value="${data.data._id}">
                            <input type="hidden" name="note" id="note-transf" value="${data.data.note}">
                            <input type="hidden" name="status" id="status-transf" value="${data.data.status}">
                            <div class="btns-cancel-trans"><button type="submit" id="btn-cancel-send" class="${data.data.status}">Anular transferencia</button><button>Regresar</button></div>`;

                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (e.target.matches('#btn-cancel-send')) {
                        let btnAnular = document.getElementById('btn-cancel-send');

                        if (btnAnular.classList.contains('anulada')) {
                            alert('Esta transacción ya se encuentra anulada');
                            btnAnular.disabled = true;
                            return location.reload();
                        }

                        const dataToUpdate = {
                            note: document.getElementById('note-transf').value,
                            idToNull: document.getElementById('id-transf').value,
                            status: document.getElementById('status-transf').value
                        }

                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/abort-transf`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataToUpdate)
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok ' + response.statusText);
                            }
                            const data = await response.json();

                            if (data.error === true) {
                                return alert(data.message);
                            }

                            if (data.error === null) {
                                btnAnular.disabled = true;
                                alert(data.msg);
                                return location.reload();
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (e.target.matches('#reportes')) {

                        try {
                            const response = await fetch(`${linkToAvalible}/api/transfers/reportes`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                }
                            });
                            const data = await response.json();

                            let valorPesosTotal = 0
                            const operations = document.querySelector('.operations');
                            //console.log(data);

                            if (data.enviadas.length <= 0) {
                                return operations.innerHTML = `
                                <div class="general-report">
                                    <h1>Reporte diario</h1>
                                    <div class="reportes-diarios">
                                        <div class="detalles">
                                            <table class="reporte-diario">
                                                <thead>
                                                    <tr>
                                                        <th>H de transacción</th>
                                                        <th>Cliente</th>
                                                        <th>Valor en Bs</th>
                                                        <th>Valor en COP $</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="table-body">
                                                    <tr>
                                                        <td colspan="4">No se ha realizado ninguna transferencia hoy</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="total-reports">
                                            <h3>Ventas totales</h2>
                                            <h2>COP$ ${valorPesosTotal.toLocaleString('es-CO')}</h2>
                                        </div>
                                    </div>
                                </div>`;
                            }

                            data.valorPesosEnv.forEach((valor) => {
                                valorPesosTotal += parseInt(valor);
                            });

                            operations.innerHTML = `
                                <div class="general-report">
                                    <h1>Reporte diario</h1>
                                    <div class="reportes-diarios">
                                        <div class="detalles">
                                            <table class="reporte-diario">
                                                <thead>
                                                    <tr>
                                                        <th>H de transacción</th>
                                                        <th>Cliente</th>
                                                        <th>Valor en Bs</th>
                                                        <th>Valor en COP $</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="table-body">

                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="total-reports">
                                            <h2>Ventas totales</h2>
                                            <h2>COP $${valorPesosTotal.toLocaleString('es-CO')}</h2>
                                        </div>
                                    </div>
                                </div>`;

                            // Obtener el tbody donde se agregarán las filas
                            const tableBody = document.querySelector('.table-body');

                            // Recorrer el array `data.enviada` y agregar cada fila a la tabla
                            data.enviadas.forEach(item => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${item.created_at.split(',')[1]}</td>
                                    <td>${item.nameClient}</td>
                                    <td>${item.cashBs}</td>
                                    <td>$ ${Number((item.cashBs / 0.009).toFixed(0)).toLocaleString('es-CO')}</td>
                                `;
                                tableBody.appendChild(row);
                            });

                        } catch (error) {
                            console.log(error);
                        }
                    }
                    if (e.target.matches('#cambiar-pass')) {

                        const operations = document.querySelector('.operations');

                        operations.innerHTML = `<form class="form-change-password">
                    <div class="form-change-pass">
                        <img src="Assets/imgs/girar.png" alt="actualizar clave" width="50">
                        <h2>Cambio de contraseña</h2>
                        <div class="oldpass">
                            <label for="oldpassword">Contraseña actual:</label>
                            <input type="password" name="oldpassword" id="old-password" placeholder="contraseña actual" required>
                        </div>
                        <div>
                            <label for="newPassword">Nueva Contraseña:</label>
                            <input type="password" id="newPassword" name="newpassword" placeholder="Nueva contraseña"
                                required>
                            <label for="confirmNewPassword">Confirmar Contraseña:</label>
                            <input type="password" id="confirm-new-password" name="newpasswordconfirm"
                                placeholder="Confirmar Contraseña" required>
                        </div>
                        <div>
                            <input type="submit" id="send-change-pass" value="Cambiar contraseña">
                        </div>
                    </div>
                </form>`

                    }

                    if (e.target.matches('#send-change-pass')) {
                        e.preventDefault();
                        const formChangePass = document.querySelector('.form-change-password');
                        const changePassData = {
                            oldPass: formChangePass.elements.oldpassword.value,
                            newPass: formChangePass.elements.newpassword.value,
                            confirNewPass: formChangePass.elements.newpasswordconfirm.value
                        }
                        if (!changePassData.oldPass || !changePassData.newPass || !changePassData.confirNewPass) {
                            return alert('Por favor completa todos los campos');
                        }
                        if (changePassData.newPass !== changePassData.confirNewPass) {
                            return alert('Las claves no coinciden');
                        }
                        console.log(changePassData);

                        try {
                            const response = await fetch(`${linkToAvalible}/api/users/change-password`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(changePassData)
                            });
                            const data = await response.json();

                            if (data.error === true) {
                                return alert(data.msg);
                            }

                            if (data.error === null) {
                                alert(data.msg);
                                localStorage.removeItem('authToken');
                                return location.reload();
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    }

                });
                // Muestra otros datos como prefieras
            } else {
                //alert('La conexion se ha cerrado');
                window.location.href = 'index.html'; // Redirigir si no hay token
            }
        } catch (error) {
            console.log(error);
        }
    }
});


/*

        const contenido = `
        <style>
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            @page{
                margin: 1cm;
            }
            span{
                font-size: 20px;
            }
        </style>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
        TRANSFERENCIAS A VENEZUELA <br>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
        <br>
        FECHA: ${new Date().toLocaleString()}<br>
        REF: ${Math.round(Math.random() * 9999999)} <br>
        BANCO: <br>
        ${entidadBamcaria.value.toUpperCase()} - ${typeCuenta.value}<br>
        CUENTA N°:<br>
        <span>${numeroCuenta.value}<br></span>
        NOMBRE: ${nombre.value.toUpperCase()}<br>
        <span>CV: ${Number(cedula.value).toLocaleString('es-CO')}</span><br>
        <br>
        SOBERANOS <span>B$: ${valorSoberanos.value}</span><br>
        <br>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
        RESP: JOSE TRINIDAD GARCIA <br>
        WHATSAPP: 3124824321 <br>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - <br>
        <br>
        <br>
        FIRMA CAJERO:_______________________<br>
        <br>
        <br>
        `
        entidadBamcaria.value = '';
        numeroCuenta.value = '';
        nombre.value = '';
        cedula.value = '';
        valorSoberanos.value = '';

        const windowPrint = window.open('', 'Impresion', 'width=600,height=600');
        windowPrint.document.write(contenido);
        windowPrint.document.close();
        windowPrint.print();

 */
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    //console.log(token);

    if (!token) {
        window.location.href = 'index.html'; // Redirigir si no hay token
    } else {
        try {
            //prod https://backend-transfers.onrender.com/api/users/dashboard
            //local http://localhost:5000/api/users/
            const response = await fetch('https://backend-transfers.onrender.com/api/users/dashboard', {
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
                document.getElementById('profile').src = `Assets/imgs/${data.user.gender}-2.jpeg`
                document.getElementById('user').textContent = `${data.user.name} ${data.user.lastname.split(' ')[0]}`;
                (data.user.gender === 'mujer') ? document.getElementById('rol').textContent = 'Cajera' : document.getElementById('rol').textContent = 'Cajero';
                document.getElementById('date').textContent = new Date().toLocaleString();
                document.getElementById('sucursal').textContent = 'Sucursal: 0001';

                document.getElementById('send-transfer').addEventListener('click', async () => {
                    //prod https://backend-transfers.onrender.com/api/users/send-transf
                    const response = await fetch('https://backend-transfers.onrender.com/api/users/send-transf', {
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
                    const response = await fetch('https://backend-transfers.onrender.com/api/users/search-transfers', {
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
                    const response = await fetch('https://backend-transfers.onrender.com/api/transfers/update-transfer', {
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
                // Muestra otros datos como prefieras
            } else {
                //alert('La conexion se ha cerrado');
                window.location.href = 'index.html'; // Redirigir si no hay token
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                    const response = await fetch('https://backend-transfers.onrender.com/api/transfers/send-transfer', {
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
                    const response = await fetch('https://backend-transfers.onrender.com/api/transfers/ver-transfers', {
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
                            <tr>
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
            console.log('Updating....');
            const formUpdate = document.querySelector('.form-update');
            const transfToUpdate = { fact: formUpdate.elements.updReference.value };

            try {
                const response = await fetch('https://backend-transfers.onrender.com/api/transfers/update', {
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
                console.log(data);
                
                const searchData = document.querySelector('.data-transfers-get');

            } catch (error) {
                console.log(error);
            }
        }
    });


    document.getElementById('logout').addEventListener('click', (e) => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html'; // Redirigir si no hay token
        location.reload();
    });
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
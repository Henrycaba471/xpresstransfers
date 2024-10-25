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

            const confirmData = confirm(`DATOS DE LA TRANSACCIÓN\n____________________________________________________________________\nBANCO: ${dataTransfer.bankEntity.toUpperCase()} - ${dataTransfer.accountType.toUpperCase()}\nN° CUENTA: ${dataTransfer.account}\nDESTINATARIO: ${dataTransfer.nameClient.toUpperCase()}\nDNI: ${dataTransfer.documentClient}\nVALOR: Bs ${dataTransfer.cashBs}\n____________________________________________________________________
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


                } catch (error) {
                    console.log(error);
                }
            } else {
                alert('Transacción cancelada')
            }
        }

        //console.log('Btn send');
    });

    document.getElementById('logout').addEventListener('click', (e) => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html'; // Redirigir si no hay token
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
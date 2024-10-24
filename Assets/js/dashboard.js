document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    //console.log(token);

    if (!token) {
        window.location.href = 'index.html'; // Redirigir si no hay token
    } else {
        try {
            //prod https://backend-transfers.onrender.com/api/users/dashboard
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
                cashBs: formSend.elements.cashBs.value
            }

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
                console.log(data);
            } catch (error) {
                console.log(error);
            }

        }

        //console.log('Btn send');
    });

    document.getElementById('logout').addEventListener('click', (e) => {
        localStorage.removeItem('authToken');
        window.location.href = 'index.html'; // Redirigir si no hay token
    });
});

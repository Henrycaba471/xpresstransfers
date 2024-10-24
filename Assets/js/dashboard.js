document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    //console.log(token);

    if (!token) {
        window.location.href = 'index.html'; // Redirigir si no hay token
    } else {
        try {
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
                document.getElementById('profile').src = 'Assets/imgs/hombre-2.jpeg'
                document.getElementById('user').textContent = `${data.user.name} ${data.user.lastname.split(' ')[0]}`;
                document.getElementById('rol').textContent = 'Cajero';
                document.getElementById('date').textContent = new Date().toLocaleString();
                document.getElementById('sucursal').textContent = 'Sucursal: 0001';

                document.getElementById('send-transfer').addEventListener('click', async () =>{
                    const response = await fetch('https://backend-transfers.onrender.com/api/users/send-transf', {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    console.log(data);
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
});

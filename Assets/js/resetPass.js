let linkAvalible = 'https://backend-transfers.onrender.com'
//http://localhost:5000
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // El token se obtiene directamente porque está después del `?`.

    console.log(urlParams);
    console.log(token);

    if (!token) {
        console.log('Token no válido');
        return;
    }

    const resetForm = document.querySelector('#reset-password-form');
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        if (!newPassword || !confirmPassword && newPassword.length < 5 || confirmPassword.length < 5) {
            alert('Las contraseñas deben ser iguales y deben tener mas de  cinco caracteres');
            return
        }
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch(`${linkAvalible}/api/users/reset-password-user`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al procesar tu solicitud');
        }

    });
});

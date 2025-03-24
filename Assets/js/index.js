document.addEventListener('DOMContentLoaded', () => {
    //let linkAvalible = 'http://localhost:5000'
    let linkAvalible = 'https://backend-transfers.onrender.com'

    const valorPesos = document.getElementById('cop');
    const valorBolivares = document.getElementById('ves');
    const btnConvert = document.getElementById('convert');
    const valores = document.querySelectorAll('.valor');
    const formLogin = document.getElementById('login');
    const modal = document.getElementById('modal');
    const close = document.getElementById('close');

    btnConvert.addEventListener('click', (e) => {
        if (valorPesos.value === undefined || valorPesos.value === '') {
            return alert('Debes ingresar un monto')
        }

        valorBolivares.value = (valorPesos.value / 83.33).toFixed(0);
    });

    valores.forEach((el) => {
        el.addEventListener("click", () => {
            valorPesos.value = el.textContent.replace(/[^0-9]/g, ''),
                valorBolivares.value = (valorPesos.value / 83.33).toFixed(0);
                console.log(valorBolivares.value);
        });
    });

    formLogin.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.toggle('login-active');
    });

    close.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.remove('login-active');
    });


    // Variables para controlar el carrusel
    let currentIndex = 0;
    const carouselContainer = document.getElementById('carousel-container');
    const totalItems = document.querySelectorAll('.carousel-item').length;

    // Función para mover el carrusel
    function moveSlide(direction) {
        currentIndex += direction;

        // Si llega al final, vuelve al inicio
        if (currentIndex >= totalItems) {
            currentIndex = 0;
        }

        // Si llega al inicio, vuelve al final
        if (currentIndex < 0) {
            currentIndex = totalItems - 1;
        }

        // Mueve el carrusel
        const newTransformValue = `translateX(-${currentIndex * 100}%)`;
        carouselContainer.style.transform = newTransformValue;
    }
    setInterval(() => {
        moveSlide(1);
    }, 3000);  // Cambia cada 3 segundos


    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            // Alternar la clase "active" en el encabezado actual
            header.classList.toggle("active");

            // Mostrar u ocultar el contenido correspondiente
            const content = header.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });

    const btnWhatsapp = document.getElementById("btn-whatsapp");
    const btnEmail = document.getElementById("btn-email");
    const btnContact = document.getElementById("btn-contact");

    btnWhatsapp.addEventListener("click", sendMessage);

    function sendMessage() {
        const url = `https://api.whatsapp.com/send?phone=573103743563&text=Hola Henry, Estoy interesado en una pagina web para mi empresa`;
        window.open(url);
    }

    btnEmail.addEventListener("click", sendMailMessage);

    function sendMailMessage() {
        const url = `mailto:henrycaba471@gmail.com?subject=Pagina web personalizada&body=Estoy interesado en una pagina web para mi empresa`;
        window.open(url);
    }

    btnContact.addEventListener("click", (e) => {
        if (e.target.matches("#transfer-whatsapp")) {
            const url = `https://api.whatsapp.com/send?phone=573103743563&text=Hola XpressTransfers, quiero hacer una transferencia!`;
            window.open(url);
            return;
        }

        if (e.target.matches("#transfer-mail")) {
            const url = `mailto:xpresstransferss@gmail.com?subject=Realizar una transferencia&body=Hola XpressTransfers, quiero hacer una transferencia!`;
            window.open(url);
            return;
        }
    });

    document.getElementById('form-login').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const userData = {
            username: form.elements.username.value,
            password: form.elements.password.value
        }

        try {
            const response = await fetch(`${linkAvalible}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            //console.log(result);
            if (result.status === 200) {
                localStorage.setItem('authToken', result.token);
                window.location.href = 'dashboard.html';
            } else {
                alert('Usuario y/o contraseña incorrectos');
            }

        } catch (error) {
            alert('Error de conexión, si el problema persiste consulta al administrador')
            console.log(error);
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.matches('#close')) {
            location.reload();
        }

        if (e.target.matches('.forgot-password')) {
            e.preventDefault();
            const setFormGetPass = document.querySelector('.login-div');
            try {
                const response = await fetch(`${linkAvalible}/api/users/forgot-password`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                setFormGetPass.innerHTML = result.form;
            } catch (error) {
                console.log(error);
            }
        }

        if (e.target.matches('#btn-reset-pass')) {
            e.preventDefault();
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const dataEmail = document.getElementById('email').value;

            if (dataEmail === '', !regexEmail.test(dataEmail)) {
                return alert('El correo ingresado no es valido');
            }

            const dataSendEmail = {
                email: dataEmail
            }

            try {
                const response = await fetch(`${linkAvalible}/api/users/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataSendEmail)
                });
                const result = await response.json();
                alert(result.message);
                location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    });

    /*
        const btnLogin = document.getElementById('btn-login');
        btnLogin.addEventListener('click', (e) =>{
            e.preventDefault()
            const username = document.getElementById('username');
            console.log(username.value);
        });
        */
});
document.addEventListener('DOMContentLoaded', () => {

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

        valorBolivares.value = (valorPesos.value * 0.009).toFixed(0);
    });

    valores.forEach((el) => {
        el.addEventListener("click", () => {
            valorPesos.value = el.textContent.replace(/[^0-9]/g, ''),
                valorBolivares.value = (valorPesos.value * 0.009).toFixed(0);
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

});
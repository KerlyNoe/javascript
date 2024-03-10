// Kerly Gualpa     -     2º DAW      -      10-03-2024      -    3 
document.addEventListener("DOMContentLoaded", function() {
    const loginPage = document.getElementById("loginPage");
    const registroPage = document.getElementById("registroPage");
    const cochesPage = document.getElementById("cochesPage");
    const reservasPage = document.getElementById("reservasPage");
    const headerButtons = document.getElementById("headerButtons");
    const cerrarSesionButton = document.getElementById("cerrarSesion");
    const verReservasButton = document.getElementById("verReservas");
    const volverCochesButton = document.getElementById("volverCoches");

    document.getElementById("mostrarRegistro").addEventListener("click", function() {
        loginPage.style.display = "none";
        registroPage.style.display = "block";
        cochesPage.style.display = "none";
        reservasPage.style.display = "none";
    });

    document.getElementById("mostrarLogin").addEventListener("click", function() {
        loginPage.style.display = "block";
        registroPage.style.display = "none";
        cochesPage.style.display = "none";
        reservasPage.style.display = "none";
    });

    document.getElementById("cerrarSesion").addEventListener("click", function() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("reservas");
        mostrarLogin();
    });

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const correoLogin = document.getElementById("correoLogin").value;
        const contrasenaLogin = document.getElementById("contrasenaLogin").value;

        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioGuardado = listaUsuarios.find(user => user.correo === correoLogin && user.contrasena === contrasenaLogin);

        if (usuarioGuardado) {
            localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
            mostrarCoches();
        } else {
            alert("Correo electrónico o contraseña incorrectos.");
        }
    });

    document.getElementById("verReservas").addEventListener("click", function() {
        mostrarReservas();
    });
    document.getElementById("volverCoches").addEventListener("click", function() {
        mostrarCoches();
    });

    document.getElementById("eliminarReservas").addEventListener("click", function() {
        if (confirm("¿Estás seguro de que quieres eliminar todas las reservas?")) {
            localStorage.removeItem("reservas");
            cargarReservas();
            alert("¡Todas las reservas han sido eliminadas!");
        }
    });

    function mostrarLogin() {
        loginPage.style.display = "block";
        registroPage.style.display = "none";
        cochesPage.style.display = "none";
        reservasPage.style.display = "none";
        headerButtons.style.display = "flex";
        cerrarSesionButton.style.display = "none";
        verReservasButton.style.display = "none";
        volverCochesButton.style.display = "none";
    }

    function mostrarCoches() {
        loginPage.style.display = "none";
        registroPage.style.display = "none";
        cochesPage.style.display = "block";
        reservasPage.style.display = "none";
        headerButtons.style.display = "flex";
        cerrarSesionButton.style.display = "block";
        verReservasButton.style.display = "block";
        volverCochesButton.style.display = "none";
        cargarCoches();
    }

    function cargarCoches() {
        const coches = JSON.parse(localStorage.getItem("coches")) || [];
        console.log("Número total de coches disponibles:", coches.length); // Registro de coches disponibles.

        const tablaCoches = document.getElementById("tablaCoches");
        const tbody = tablaCoches.querySelector("tbody");
        tbody.innerHTML = ""; // Limpia el contenido previo de la tabla.

        let contador = 0;

        for (let i = 0; i < coches.length; i++) {
            const coche = coches[i];
            if (!coche.reservado && contador < 5) {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${coche.marca}</td>
                    <td>${coche.modelo}</td>
                    <td>${coche.año}</td>
                    <td>${coche.kilometraje}</td>
                    <td>${coche.precio}</td>
                    <td><button class="reservarBtn">Reservar</button></td>
                `;
                tbody.appendChild(fila);
                contador++;
            } else {
                break; 
            }
        }

        // Agregar evento de reserva a los botones
        const botonesReservar = document.querySelectorAll(".reservarBtn");
        botonesReservar.forEach(boton => {
            boton.addEventListener("click", reservarCoche);
        });
    }

    function reservarCoche() {
        const fila = this.closest("tr");
        const marca = fila.querySelector("td:nth-child(1)").textContent;
        const modelo = fila.querySelector("td:nth-child(2)").textContent;
        const año = fila.querySelector("td:nth-child(3)").textContent;
        const kilometraje = fila.querySelector("td:nth-child(4)").textContent;
        const precio = fila.querySelector("td:nth-child(5)").textContent;

        const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
        const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

        const nuevaReserva = {
            usuarioId: usuarioActual.id,
            marca: marca,
            modelo: modelo,
            año: año,
            kilometraje: kilometraje,
            precio: precio
        };

        reservas.push(nuevaReserva);
        localStorage.setItem("reservas", JSON.stringify(reservas));

        // Muestra un mensaje de alerta.
        alert(`Has reservado el coche: ${marca} ${modelo}`);

        // Actualiza la tabla de reservas.
        cargarReservas();
    }

    function mostrarReservas() {
        loginPage.style.display = "none";
        registroPage.style.display = "none";
        cochesPage.style.display = "none";
        reservasPage.style.display = "block";
        headerButtons.style.display = "flex";
        cerrarSesionButton.style.display = "block";
        verReservasButton.style.display = "none";
        volverCochesButton.style.display = "block";
        cargarReservas();
    }

    function cargarReservas() {
        const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
        const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
        const tablaReservas = document.getElementById("tablaReservas");
        const tbody = tablaReservas.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar el contenido previo de la tabla

        const reservasUsuario = reservas.filter(reserva => reserva.usuarioId === usuarioActual.id);

        reservasUsuario.forEach(reserva => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${reserva.marca}</td>
                <td>${reserva.modelo}</td>
                <td>${reserva.año}</td>
                <td>${reserva.kilometraje}</td>
                <td>${reserva.precio}</td>
            `;
            tbody.appendChild(fila);
        });
    }


    mostrarLogin();
});
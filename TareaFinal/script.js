// Kerly Gualpa     -     2º DAW      -      10-03-2024      -    5
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
        tbody.innerHTML = "";
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
                    <td><button class="reservarBtn" data-index="${i}">Reservar</button></td>
                `;
                tbody.appendChild(fila);
                contador++;
            }
        }
    
        const botonesReservar = document.querySelectorAll(".reservarBtn");
        botonesReservar.forEach(boton => {
            boton.addEventListener("click", reservarCoche);
        });
    }
    
    function reservarCoche(event) {
        const index = event.target.dataset.index;
        const coches = JSON.parse(localStorage.getItem("coches")) || [];
        const coche = coches[index];
    
        // Muestra el formulario de reserva al usuario.
        const formularioReserva = document.getElementById("formularioReserva");
        formularioReserva.style.display = "block";
    
        const confirmarReservaButton = document.getElementById("confirmarReserva");
        confirmarReservaButton.addEventListener("click", function() {
            const fechaReserva = document.getElementById("fechaReserva").value;
            alert(`Has reservado el coche: ${coche.marca} ${coche.modelo} para el ${fechaReserva}`);
            formularioReserva.style.display = "none";
        });
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
        tbody.innerHTML = ""; // Limpia el contenido previo de la tabla.
    
        // Filtrar las reservas del usuario actual.
        const reservasUsuario = reservas.filter(reserva => reserva.usuarioId === usuarioActual.id);
    
        // Verificar si hay reservas para este usuario.
        if (reservasUsuario.length === 0) {
            const filaVacia = document.createElement("tr");
            filaVacia.innerHTML = "<td colspan='5'>No hay coches reservados</td>";
            tbody.appendChild(filaVacia);
        } else {
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
    }
    
    mostrarLogin();
});

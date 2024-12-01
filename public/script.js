// Array para simular el estado de ocupación de los espacios
const espacios = Array(20).fill(true); // true = disponible, false = ocupado
let registroDeActividades = JSON.parse(localStorage.getItem('registroDeActividades')) || [];

// Función para guardar actividades en localStorage
function guardarActividades() {
    localStorage.setItem('registroDeActividades', JSON.stringify(registroDeActividades));
}

// Validar y procesar el formulario de registro
function validarRegistro() {
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const contrasena = document.getElementById('contrasena').value;

    // Validaciones básicas
    if (nombre === "" || correo === "" || telefono === "" || contrasena === "") {
        alert("Todos los campos son obligatorios.");
        return false;
    }

    // Guardar la acción de registro en el registro de actividades
    const actividad = {
        seccion: "Registro",
        accion: `Nuevo registro con el nombre: ${nombre} y correo: ${correo}`,
        fecha: new Date().toLocaleString()
    };
    registroDeActividades.push(actividad);
    guardarActividades();

    // Crear un objeto de usuario
    const usuario = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        contrasena: contrasena
    };

    // Obtener usuarios registrados desde localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si el correo ya está registrado
    const correoExistente = usuariosRegistrados.find(user => user.correo === correo);
    if (correoExistente) {
        alert("El correo ya está registrado. Por favor, usa otro.");
        return false;
    }

    // Agregar el nuevo usuario
    usuariosRegistrados.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));

    alert("Registro exitoso. Redirigiendo a la página de inicio de sesión...");
    window.location.href = "inicio.html"; // Redirigir a inicio.html después del registro
    return false; // Prevenir el envío real del formulario
}

// Validar el formulario de inicio de sesión
function validarInicioSesion(event) {
    event.preventDefault(); // Prevenir el envío real del formulario

    const correoInicio = document.getElementById('correoInicio').value;
    const contrasenaInicio = document.getElementById('contrasenaInicio').value;

    // Obtener usuarios registrados desde localStorage
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar las credenciales
    const usuarioValido = usuariosRegistrados.find(
        (usuario) => usuario.correo === correoInicio && usuario.contrasena === contrasenaInicio
    );

    if (usuarioValido) {
        alert("Inicio de sesión exitoso. Redirigiendo...");
        window.location.href = "index.html"; // Redirigir a index.html después de iniciar sesión
    } else {
        alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
}

// Validar y registrar la reserva de un espacio
function validarReserva() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const espacioNumero = parseInt(document.getElementById('espacio').value) - 1; // Convertir a índice (0-19)

    // Validaciones básicas
    if (fecha === "" || hora === "" || espacioNumero < 0 || espacioNumero >= 20) {
        alert("Todos los campos son obligatorios y el espacio debe ser un número entre 1 y 20.");
        return false;
    }

    if (!espacios[espacioNumero]) {
        alert("El espacio está ocupado. Por favor, elige otro.");
        return false; // Evitar el envío del formulario
    }

    // Marcar el espacio como ocupado
    espacios[espacioNumero] = false;

    // Guardar la acción de reserva en el registro de actividades
    const actividad = {
        seccion: "Reservas",
        accion: `Reserva realizada para el ${fecha} a las ${hora} en el espacio ${espacioNumero + 1}`,
        fecha: new Date().toLocaleString()
    };
    registroDeActividades.push(actividad);
    guardarActividades();

    alert("Reserva realizada correctamente.");
    window.location.href = "index.html"; // Redirigir a index.html después de la reserva
    return false; // Evitar el envío real del formulario
}

// Función para cancelar una reserva y registrar la acción
function validarCancelacion() {
    const codigo = document.getElementById('codigo').value;

    // Validaciones básicas
    if (codigo === "") {
        alert("El código de la reserva es obligatorio.");
        return false;
    }

    // Guardar la acción en el registro
    const actividad = {
        seccion: "Cancelación de Reservas",
        accion: `Canceló la reserva con el código: ${codigo}`,
        fecha: new Date().toLocaleString()
    };
    registroDeActividades.push(actividad);
    guardarActividades();

    alert("Reserva cancelada correctamente");
    return false; // Prevenir el envío real del formulario
}

// Función para generar un reporte y registrar la acción
function generarReporte() {
    const fechaReporte = document.getElementById('fecha-reporte').value;

    // Validaciones básicas
    if (fechaReporte === "") {
        alert("Debes seleccionar una fecha para generar el reporte.");
        return false;
    }

    // Guardar la acción en el registro
    const actividad = {
        seccion: "Reporte de Uso Diario",
        accion: `Generó un reporte para la fecha: ${fechaReporte}`,
        fecha: new Date().toLocaleString()
    };
    registroDeActividades.push(actividad);
    guardarActividades();

    alert("Reporte generado correctamente");
    return false; // Prevenir el envío real del formulario
}

// Función para actualizar el panel del administrador con los movimientos
function actualizarPanelAdmin() {
    const movimientosDiv = document.getElementById('movimientos-recientes');
    if (!movimientosDiv) return; // Si no se encuentra el elemento, no hacer nada

    movimientosDiv.innerHTML = ""; // Limpiar antes de actualizar

    if (registroDeActividades.length === 0) {
        movimientosDiv.innerHTML = "<p>No hay movimientos registrados.</p>";
        return;
    }

    // Mostrar cada actividad registrada
    registroDeActividades.forEach((actividad) => {
        const actividadElem = document.createElement('p');
        actividadElem.textContent = `${actividad.fecha} - [${actividad.seccion}] - ${actividad.accion}`;
        movimientosDiv.appendChild(actividadElem);
    });
}

// Inicializar la tabla de disponibilidad al cargar la página
function mostrarDisponibilidad() {
    const tabla = document.getElementById('tabla-disponibilidad');
    tabla.innerHTML = ''; // Limpiar la tabla

    espacios.forEach((disponible, index) => {
        const espacioDiv = document.createElement('div');
        espacioDiv.className = 'espacio ' + (disponible ? 'disponible' : 'ocupado');
        espacioDiv.textContent = index + 1; // Mostrar número del espacio
        tabla.appendChild(espacioDiv);
    });
}

// Inicializar el panel la primera vez (se ejecuta cuando se carga la página del panel)
window.onload = function() {
    mostrarDisponibilidad(); // Mostrar disponibilidad al cargar
    actualizarPanelAdmin(); // Actualizar panel de admin
};

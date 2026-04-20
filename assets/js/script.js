// ===== GESTOR DE TAREAS KANBAN =====
// Almacenamiento en localStorage para persistencia
// Estructura de tarea: { id, descripcion, prioridad, fecha, estado }

// Clave para localStorage
const STORAGE_KEY = 'tareas_kanban';

// Estado de la aplicación: array de tareas
let tareas = [];

// ===== FUNCIONES DE UTILIDAD =====

// Cargar tareas desde localStorage
function cargarTareas() {
    const tareasGuardadas = localStorage.getItem(STORAGE_KEY);
    if (tareasGuardadas) {
        try {
            tareas = JSON.parse(tareasGuardadas);
        } catch (e) {
            console.error('Error al leer tareas guardadas', e);
            tareas = [];
        }
    } else {
        // Tareas de ejemplo para empezar
        tareas = [
            { id: Date.now() + 1, descripcion: 'Diseñar wireframe', prioridad: 'alta', fecha: '2026-04-25', estado: 'pendiente' },
            { id: Date.now() + 2, descripcion: 'Implementar HTML/CSS', prioridad: 'media', fecha: '2026-04-22', estado: 'progreso' },
            { id: Date.now() + 3, descripcion: 'Probar funcionalidad', prioridad: 'baja', fecha: '2026-04-27', estado: 'completada' }
        ];
        guardarTareas();
    }
}

// Guardar tareas en localStorage
function guardarTareas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

// Renderizar todas las columnas y contadores
function renderizarTablero() {
    // Limpiar contenedores
    document.getElementById('pendientes-container').innerHTML = '';
    document.getElementById('progreso-container').innerHTML = '';
    document.getElementById('completadas-container').innerHTML = '';

    // Contadores
    let contadorPendientes = 0;
    let contadorProgreso = 0;
    let contadorCompletadas = 0;

    // Recorrer tareas y agregar tarjetas según estado
    tareas.forEach(tarea => {
        const tarjeta = crearElementoTarjeta(tarea);
        
        if (tarea.estado === 'pendiente') {
            document.getElementById('pendientes-container').appendChild(tarjeta);
            contadorPendientes++;
        } else if (tarea.estado === 'progreso') {
            document.getElementById('progreso-container').appendChild(tarjeta);
            contadorProgreso++;
        } else if (tarea.estado === 'completada') {
            document.getElementById('completadas-container').appendChild(tarjeta);
            contadorCompletadas++;
        }
    });

    // Actualizar contadores en el DOM
    document.getElementById('contador-pendientes').textContent = contadorPendientes;
    document.getElementById('contador-progreso').textContent = contadorProgreso;
    document.getElementById('contador-completadas').textContent = contadorCompletadas;
}

// Crear elemento HTML para una tarjeta de tarea
function crearElementoTarjeta(tarea) {
    const div = document.createElement('div');
    div.className = `tarjeta prioridad-${tarea.prioridad}`;
    div.setAttribute('data-id', tarea.id);
    div.setAttribute('draggable', 'true'); // Para posible arrastre futuro

    // Contenido de la tarjeta
    div.innerHTML = `
        <div class="descripcion">${tarea.descripcion}</div>
        <div class="prioridad">Prioridad: ${tarea.prioridad}</div>
        <div class="fecha">📅 ${formatearFecha(tarea.fecha)}</div>
        <div class="tarjeta-acciones">
            ${obtenerBotonesEstado(tarea.estado, tarea.id)}
            <button class="btn-eliminar" data-id="${tarea.id}">🗑️ Eliminar</button>
        </div>
    `;

    // Agregar event listeners a los botones dentro de la tarjeta
    // (usamos delegación de eventos desde el tablero, pero también podemos hacerlo aquí)
    // Para simplificar, usaremos delegación global en el contenedor principal.
    return div;
}

// Formatear fecha a formato legible (YYYY-MM-DD)
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Sin fecha';
    const partes = fechaISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Generar botones para mover según estado actual
function obtenerBotonesEstado(estado, id) {
    if (estado === 'pendiente') {
        return `<button class="btn-mover" data-id="${id}" data-nuevo-estado="progreso">▶️ Mover a Progreso</button>`;
    } else if (estado === 'progreso') {
        return `<button class="btn-mover" data-id="${id}" data-nuevo-estado="completada">✅ Completar</button>
                <button class="btn-mover" data-id="${id}" data-nuevo-estado="pendiente">◀️ Mover a Pendientes</button>`;
    } else { // completada
        return `<button class="btn-mover" data-id="${id}" data-nuevo-estado="progreso">↩️ Reabrir en Progreso</button>`;
    }
}

// ===== MANEJADORES DE EVENTOS =====

// Agregar nueva tarea desde formulario
function manejarAgregarTarea(evento) {
    evento.preventDefault();
    
    // Obtener valores del formulario
    const descripcionInput = document.getElementById('descripcion');
    const prioridadSelect = document.getElementById('prioridad');
    const fechaInput = document.getElementById('fecha');
    
    const descripcion = descripcionInput.value.trim();
    const prioridad = prioridadSelect.value;
    const fecha = fechaInput.value;
    
    // Validación simple
    if (!descripcion || !prioridad || !fecha) {
        alert('Por favor completa todos los campos.');
        return;
    }
    
    // Crear nueva tarea
    const nuevaTarea = {
        id: Date.now(), // ID único basado en timestamp
        descripcion: descripcion,
        prioridad: prioridad,
        fecha: fecha,
        estado: 'pendiente' // Siempre empieza en pendientes
    };
    
    // Agregar al array y guardar
    tareas.push(nuevaTarea);
    guardarTareas();
    
    // Limpiar formulario
    descripcionInput.value = '';
    prioridadSelect.value = '';
    fechaInput.value = '';
    
    // Actualizar tablero
    renderizarTablero();
}

// Manejar clics en botones dentro de las tarjetas (delegación)
function manejarClicsTablero(evento) {
    const target = evento.target;
    
    // Botón Eliminar
    if (target.classList.contains('btn-eliminar')) {
        const id = Number(target.getAttribute('data-id'));
        eliminarTarea(id);
    }
    
    // Botón Mover (cambiar estado)
    if (target.classList.contains('btn-mover')) {
        const id = Number(target.getAttribute('data-id'));
        const nuevoEstado = target.getAttribute('data-nuevo-estado');
        cambiarEstadoTarea(id, nuevoEstado);
    }
}

// Eliminar tarea por ID
function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarTareas();
    renderizarTablero();
}

// Cambiar estado de una tarea
function cambiarEstadoTarea(id, nuevoEstado) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.estado = nuevoEstado;
        guardarTareas();
        renderizarTablero();
    }
}

// ===== INICIALIZACIÓN =====
function inicializar() {
    cargarTareas();
    renderizarTablero();
    
    // Event listener para el formulario
    const form = document.getElementById('form-tarea');
    form.addEventListener('submit', manejarAgregarTarea);
    
    // Delegación de eventos para botones dentro del tablero (usamos el contenedor principal)
    const tablero = document.querySelector('.tablero-kanban');
    tablero.addEventListener('click', manejarClicsTablero);
    
    // Pequeña mejora: evitar que el formulario se envíe con Enter en textarea (no necesario)
}

// Arrancar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar);
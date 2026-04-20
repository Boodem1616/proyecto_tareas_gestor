# Evaluacion n°2
* Proyecto Práctico N°1: Desarrollo Web Inicial Desarrollo de una solución web básica aplicando estructura HTML, uso de etiquetas semánticas y estilos con CSS e interactividad aplicando manejo de eventos con Javascript. Instrumento: Rúbrica Modalidad: Práctica Tipo de evaluación: Heteroevaluación (docente)

# Gestor de Tareas

Proyecto Práctico N°2 - Evaluación N°2  
**Diseño, Estilización e Interactividad Web**

## Descripción
Aplicación web de tablero Kanban para gestionar tareas. Permite agregar tareas con descripción, prioridad y fecha límite. Las tareas pueden moverse entre columnas (Pendientes, En Progreso, Completadas) y eliminarse. Los contadores se actualizan automáticamente. Los datos persisten en el navegador mediante `localStorage`.

## Tecnologías utilizadas
- HTML5 semántico
- CSS3 (variables, Flexbox, diseño responsive)
- JavaScript (ES6+) sin frameworks

## Estructura del proyecto
proyecto_tareas_gestor/
├── index.html
├── README.md
├── assets/
│ ├── css/
│ │ ├── style.css
│ │ └── responsive.css
│ ├── js/
│ │ └── script.js
│ ├── img/
│ └── fonts/
└── docs/
└── uso_ia.md

## Funcionalidades
- Agregar tarea con validación de campos.
- Mover tareas entre estados (pendiente → progreso → completada, y viceversa).
- Eliminar tareas.
- Contadores dinámicos por columna.
- Persistencia local (recarga segura).
- Diseño adaptable a móviles y tablets.
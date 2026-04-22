// src/data/index.js

// Importamos todos los módulos de preguntas
import matematicas from './matematicas.json';
import fisica from './fisica.json';
import espanol from './espanol.json';
import geografia from './geografia.json'; // Nuevo
import historia from './historia.json';   // Nuevo
import biologia from './biologia.json';       // Nuevo (Formación Cívica)

// Función auxiliar para validar que cada importación sea un array
const validarArray = (data) => (Array.isArray(data) ? data : []);

const todasLasPreguntas = [
  ...validarArray(matematicas),
  ...validarArray(fisica),
  ...validarArray(espanol),
  ...validarArray(geografia),
  ...validarArray(historia),
  ...validarArray(biologia)
];

// Tip: Puedes imprimir en consola para ver cuántas preguntas llevas en total
console.log(`Cargadas ${todasLasPreguntas.length} preguntas en total.`);

export default todasLasPreguntas;
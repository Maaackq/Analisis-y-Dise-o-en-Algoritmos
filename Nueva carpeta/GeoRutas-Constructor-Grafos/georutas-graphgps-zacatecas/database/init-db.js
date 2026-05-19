require('dotenv').config();
const { initializeDatabase } = require('../config/db');

initializeDatabase();
console.log('Base de datos inicializada correctamente.');

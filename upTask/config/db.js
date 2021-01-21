const Sequelize = require('sequelize');
//Extraer valores de variables de entorno
require('dotenv').config({
    path: 'variables.env'
});

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect: 'mysql' ,
    port: process.env.BD_PORT
});

module.exports = db;

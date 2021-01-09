const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la DB
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');

db.sync()
    .then(() => console.log('Conectado al server'))
    .catch(error => console.log(error));

//Crear una aplicación de express 
const app = express();

//Cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

//Crear carpeta de vistas
app.set('views', path.join(__dirname, './views'));

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/index'));

app.listen(3000);
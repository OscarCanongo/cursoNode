const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//Importar variables
require('dotenv').config({
    path: 'variables.env'
});

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la DB
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al server'))
    .catch(error => console.log(error));

//Crear una aplicación de express 
const app = express();

//Cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Session nos permite navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

//Crear carpeta de vistas
app.set('views', path.join(__dirname, './views'));

app.use('/', require('./routes/index'));

// puerto de la app
const port = process.env.PORT || 4000;

// arrancar la app
app.listen(port,  () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});

require('./handlers/email');
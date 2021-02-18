const express = require('express');
require('dotenv').config({path: 'variables.env'});
const router = require('./routes');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/db');
const bodyParser = require('body-parser');
require('./models/Usuarios');

db.sync().then(() => console.log('DB conectada')).catch((error) => console.log(error));

const app = express();

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

//ubicacion de las vistas
app.set('views', path.join(__dirname, './views'));

//archivos estaticos
app.use(express.static('public'));

//Middleware
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

//Routing
app.use('/', router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
    console.log("Server funcionando");
});
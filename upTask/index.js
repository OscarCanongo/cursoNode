const express = require('express');
const routes = require('./routes');
const path = require('path');

//Crear una aplicación de express 
const app = express();

//Cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Crear carpeta de vistas
app.set('views', path.join(__dirname, './views'));

app.use('/', require('./routes/index'));

app.listen(3000);
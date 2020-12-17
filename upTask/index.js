const express = require('express');
const routes = require('./routes');

//Crear una aplicación de express 
const app = express();

app.use('/', require('./routes/index'));

app.listen(3000);
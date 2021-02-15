const express = require('express');
require('dotenv').config({path: 'variables.env'});
const router = require('./routes');

const app = express();

//Routing
app.use('/', router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
    console.log("Server funcionando");
});
const express = require('express');
const router = require('./routes');
const xphbs = require('express-handlebars');
const path = require('path');

const app = express();

//Hablitar handlebars como view
app.engine('handlebars', 
    xphbs({
        defaultLayout: 'layout'
    })
);

app.set('view engine', 'handlebars');

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(3000);
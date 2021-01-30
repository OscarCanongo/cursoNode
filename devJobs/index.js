const mongoose = require('mongoose');
require('./config/db');
const express = require('express');
const router = require('./routes');
const xphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
require('dotenv').config({ path: 'variables.env' });
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = express();

//Habilitar bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Hablitar handlebars como view
app.engine('handlebars', 
    xphbs({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine', 'handlebars');

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}));

//Alertas y flash messages
app.use(flash());

//Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router);

app.listen(3000);
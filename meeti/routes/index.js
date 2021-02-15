const express = require('express');
const router = express.Router(); 

router.get('/', (req, res) => {
    res.send('Inicio');
});

router.get('/crear-cuenta', (req, res) => {
    res.send('Crear cuenta');
});

module.exports = router;



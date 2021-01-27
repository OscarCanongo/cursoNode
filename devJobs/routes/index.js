const express = require('express');
const router = express.Router(); 
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');

router.get('/', homeController.mostrarTrabajos);

//Crear vacantes
router.get('/vacantes/nueva', vacanteController.formularioNuevaVacante);
router.post('/vacantes/nueva', vacanteController.agregarVacante);

module.exports = router;



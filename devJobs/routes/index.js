const express = require('express');
const router = express.Router(); 
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

router.get('/', homeController.mostrarTrabajos);

//Crear vacantes
router.get('/vacantes/nueva', vacanteController.formularioNuevaVacante);
router.post('/vacantes/nueva', vacanteController.agregarVacante);

//Mostar vacante
router.get('/vacantes/:url', vacanteController.mostrarVacante);

//Editar vacante
router.get('/vacantes/editar/:url', vacanteController.formEditarVacante);
router.post('/vacantes/editar/:url', vacanteController.editarVacante);

//Crear cuentas
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', 
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
);

//Autenticar usuarios
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);

module.exports = router;



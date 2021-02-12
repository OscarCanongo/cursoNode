const express = require('express');
const router = express.Router(); 
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

router.get('/', homeController.mostrarTrabajos);

//Crear vacantes
router.get('/vacantes/nueva', 
    authController.verificarUsuario,
    vacanteController.formularioNuevaVacante
);
router.post('/vacantes/nueva', 
    authController.verificarUsuario,
    vacanteController.validarVacante,
    vacanteController.agregarVacante
);

//Mostar vacante
router.get('/vacantes/:url', vacanteController.mostrarVacante);

//Editar vacante
router.get('/vacantes/editar/:url', 
    authController.verificarUsuario,
    vacanteController.formEditarVacante
);

router.post('/vacantes/editar/:url', 
    authController.verificarUsuario,
    vacanteController.validarVacante,
    vacanteController.editarVacante
);

//Eliminar vacantes
router.delete('/vacantes/eliminar/:id',
    vacanteController.eliminarVacante
);

//Crear cuentas
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', 
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
);

//Autenticar usuarios
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);

//Reset password
router.get('/restablecer-password', authController.formRestablecerPassword);
router.post('/restablecer-password', authController.enviarToken);

//Almacenar el la base de datos
router.get('/restablecer-password/:token', authController.restablecerPassword);
router.post('/restablecer-password/:token', authController.guardarPassword);

//cerrar sesion
router.get('/cerrar-sesion',
    authController.verificarUsuario,
    authController.cerrarSesion
);

//Panel de administracion
router.get('/administracion', 
    authController.verificarUsuario,
    authController.mostrarPanel
);

//Editar perfil
router.get('/editar-perfil',
    authController.verificarUsuario,
    usuariosController.formEditarPerfil
);

router.post('/editar-perfil', 
    //authController.verificarUsuario,
    //usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil
);

//Recibir mensajes de candidatos
router.post('/vacantes/:url',
    vacanteController.subirCV,
    vacanteController.contactar
);

//Muesra los candidatos por vacantes
router.get('/candidatos/:id', 
    authController.verificarUsuario,
    vacanteController.mostrarCandidatos
)

//Buscador de vacantes
router.post('/buscador', vacanteController.buscadorVacantes);

module.exports = router;



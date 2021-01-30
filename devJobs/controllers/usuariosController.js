const Usuario = require('../models/Usuarios');
const { body, sanitizeBody, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}
 
exports.validarRegistro = async (req, res, next) => {
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es Obligatorio').escape(),
        body('email').isEmail().withMessage('El email debe ser valido').escape(),
        body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password no puede ir vacío').escape(),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente').escape()
    ];
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
 
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes: req.flash()
    });
    return;
};

exports.crearUsuario = async(req, res, next) => {

    //crear usuario
    const usuario = new Usuario(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error); 
        res.redirect('/crear-cuenta');  
    }
}
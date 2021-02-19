const Usuarios = require('../models/Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta'
    });
}

exports.crearNuevaCuenta = async (req,res) => {
    const usuario = req.body;

    const rules = [
        body('confirmar').notEmpty().withMessage('Debes de confirmar tu password'),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente')
      ]
    await Promise.all(rules.map(validation => validation.run(req)))

    //Leer los errores de express
    const erroresExpress = validationResult(req);

    try {
        await Usuarios.create(usuario);
        
        //Flash Messages y redireccionar
        req.flash('exito', 'Se ha enviado un correo para confirmar la cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {

        //Extraer el message de los errores
        const erroresSequelize = error.errors.map(err => err.message);
        
        //Extraer el msg de los errores
        //const errExp = erroresExpress.map(err => err.msg);

        //unir los errores
        const listaErrores = erroresSequelize

        req.flash('error', listaErrores);
        res.redirect('/crear-cuenta');
    }
}

//Formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión'
    });
}
const Usuarios = require('../models/Usuarios');
const { body, validationResult } = require('express-validator');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta'
    });
}

exports.crearNuevaCuenta = async (req,res) => {
    const usuario = req.body;

    try {
        await Usuarios.create(usuario);

        //generar url de confirmacion
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        //Enviar correo de confirmacion
        await enviarEmail.enviarEmail({
            usuario,
            url,
            subject: 'Confirma tu cuenta de Meeti',
            archivo: 'confirmar-cuenta'
        });
        
        //Flash Messages y redireccionar
        req.flash('exito', 'Se ha enviado un correo para confirmar la cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {

        //Extraer el message de los errores
        //const erroresSequelize = error.errors.map(err => err.message);
        
        //Extraer el msg de los errores
        //const errExp = erroresExpress.map(err => err.msg);

        //unir los errores
        //const listaErrores = erroresSequelize

        req.flash('error', "Hay un error");
        res.redirect('/crear-cuenta');
    }
}

//Confirmar cuenta
exports.confirmarCuenta = async (req, res, next) => {
    //Verificar que el usuario existe
    const usuario = await Usuarios.findOne({where:{email:req.params.correo}});

    //No existe, redireccionar
    if (!usuario) {
        req.flash('error', 'La cuenta no existe');
        res.redirect('/crear-cuenta');
        return next();
    }

    //Existe, confirmar suscripcion y redireccionar
    usuario.activo = 1;
    await usuario.save();
    req.flash('exito', 'Cuenta confirmada correctamente');
    res.redirect('/iniciar-sesion')
}

//Formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión'
    });
}
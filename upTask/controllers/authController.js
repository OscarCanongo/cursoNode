const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require("bcrypt-nodejs");
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Funcion para revisar si el usuario esta autenticado o no
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    //Si no esta autenticado, redirigir al form
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //Al cerrar sesion nos lleva al login
    });
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({
        where: { email }
    });

    //Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/restablecer');
    }

    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardarlo en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
    
    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerPassword'
    });

    //Terminar la ejecución
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        token: req.params.token
    });

    //Si no encuentra el usuario
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/restablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    });
}

// cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {

    // Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}
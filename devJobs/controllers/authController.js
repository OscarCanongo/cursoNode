const passport = require('passport');
const Vacante = require('../models/Vacantes');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Revisar si el usuario está autenticado
exports.verificarUsuario = (req, res, next) => {
    //revisar el usuario
    if (req.isAuthenticated()) {
        return next(); //Están autenticados
    }

    //Redireccionar
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req, res) => {
    //Consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id }).lean()

    res.render('administracion', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y administra tus vacantes',
        vacantes: vacantes
    });
}
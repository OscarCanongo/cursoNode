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
    const vacantes = await Vacante.find({ autor: req.user._id }).lean();

    console.log(req.user.imagen);

    res.render('administracion', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y administra tus vacantes',
        vacantes: vacantes,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    });
}

exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Se ha cerrado la sesion');
    return res.redirect('/iniciar-sesion');
}
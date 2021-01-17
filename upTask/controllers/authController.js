const passport = require('passport');

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
    })
}
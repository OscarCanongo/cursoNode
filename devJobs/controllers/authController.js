const passport = require('passport');
const Vacante = require('../models/Vacantes');
const Usuario = require('../models/Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

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
        imagen: req.user.imagen,
    });
}

exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Se ha cerrado la sesion');
    return res.redirect('/iniciar-sesion');
}

//Formulario para restablecer password
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer-password', {
        nombrePagina: 'Restablecer password',
        tagline: 'Si olvidaste tu password, escribe tu correo para restablecerlo'
    });
}

//Genera el token en la tabla del usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuario.findOne({ email: req.body.email });

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/restablecer-password/${usuario.token}`;

    // console.log(resetUrl);

    // Enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    //Todo correcto
    req.flash('correcto', 'Se ha mandado un email para restablecer la contraseña');
    res.redirect('/iniciar-sesion');
}

//Valida si el token es valido, el usuario existe y muestra la vista
exports.restablecerPassword = async (req, res) => {
    const usuario = await Usuario.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if (!usuario) {
        req.flash('error', 'El formulario no es valido, intenta nuevamente');
        return res.redirect('/restablecer-password');
    }

    //Todo bien, mostrar formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nueva contraseña'
    })
}

//Almacena el nuevo password en la base de datos
exports.guardarPassword = async (req, res) => {
    const usuario = await Usuario.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    //No existe el usuario o el token es invalido
    if (!usuario) {
        req.flash('error', 'El formulario no es valido, intenta nuevamente');
        return res.redirect('/restablecer-password');
    }

    //Asignar nuevo password y limpiar valores previos
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;

    console.log(usuario);

    //Guardar en la base de datos
    await usuario.save();

    //Redireccionar
    req.flash('correcto', 'Contraseña modificada correctamente');
    res.redirect('/iniciar-sesion');
}
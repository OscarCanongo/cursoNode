const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear cuenta'
    });
}

exports.crearNuevaCuenta = async (req,res) => {
    const usuario = req.body;

    const user = await Usuarios.create(usuario);

    console.log('Usuario creado', user)
}
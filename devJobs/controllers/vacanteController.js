const mongoose = require('mongoose');
const Vacante = require('../models/Vacantes');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    });
}

//Agregar vacantes a la base de datos
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    //Crear arreglo de habilidades (skills)
    vacante.skills = req.body.skills.split(',');

    //Almacenarlo en la base de datos
    const nuevaVacante = await vacante.save();

    //redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

//Muestra una vacante
exports.mostrarVacante = async (req, res, nest) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    //Si no hay resultados
    if (!vacante) {
        return next();
    }

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}
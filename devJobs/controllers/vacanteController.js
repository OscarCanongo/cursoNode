const mongoose = require('mongoose');
const Vacante = require('../models/Vacantes');
const { body, sanitizeBody, validationResult } = require('express-validator');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

//Agregar vacantes a la base de datos
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    //Usuario autor de la vacante
    vacante.autor = req.user._id;

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

exports.formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) {
        return next();
    }

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

exports.editarVacante = async (req, res) => {
    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada, {
        new: true,
        runValidators: true
    } );

    res.redirect(`/vacantes/${vacante.url}`);
}

//validar y sanitizar los campos de las nuevas vacantes
exports.validarVacante = async (req, res, next) => {
    //Sanitizar los campos
    const rules = [
        body('titulo').notEmpty().withMessage('El titulo es obligatorio').escape(),
        body('empresa').notEmpty().withMessage('La empresa es obligatoria').escape(),
        body('ubicacion').notEmpty().withMessage('La ubicación es obligatoria').escape(),
        body('salario').escape(),
        body('contrato').notEmpty().withMessage('El contrato es obligatorio').escape(),
        body('skills').notEmpty().withMessage('Agrega minimo una habilidad').escape()
    ];
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);


    if(errores){
        //Recargar la vista con los errores
        req.flash('error', errores.array().map(error => error.msg));
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensaje: req.flash
        });
    }

    //Siguiente middleware
    next();
}

exports.eliminarVacante = async(req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)){
        // Todo bien, si es el usuario, eliminar
        res.status(200).send('Vacante Eliminada Correctamente');
        vacante.remove();
    } else {
        // no permitido
        res.status(403).send('Error')
    }
}

const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}
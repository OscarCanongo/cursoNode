const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

exports.formNuevoGrupo = async (req, res) => {

    const categorias = await Categorias.findAll();
    //console.log(categorias)

    res.render('nuevo-grupo', {
        nombrePagina: 'Crear grupo',
        categorias
    });
}

//Almacena los grupos el la bd
exports.crearGrupo = async(req, res) => {
    
    //Sanitizar
    //req.sanitizeBody('nombre');
    //req.sanitizeBody('url');

    const grupo = req.body;

    //Almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId = req.user.id;

    try {

        //Almacenar el la bd
        await Grupos.create(grupo);
        req.flash('exito', 'Grupo creado correctamente');
        res.redirect('/administracion');

    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', error);
        res.redirect('/nuevo-grupo')
    }
}
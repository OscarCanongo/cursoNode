const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const multer = require('multer');
const shortid = require('shortid');
const { MulterError } = require('multer');
const fs = require('fs');

const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/grupos/');
        },
        filename : (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el formato es valido
            next(null, true);
        } else {
            // el formato no es valido
            next(new Error('Formato no válido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

//Sube una imagen en el servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error){
        if (error) {
            if (error.code == 'LIMIT_FILE_SIZE') {
                if (error instanceof multer.MulterError) {
                    req.flash('error', 'Archivo excede el tamaño permitido');
                } else{
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')){
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    })
}

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

    //Leer la imagen
    if (req.file) {
        grupo.imagen = req.file.filename;
    }

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

exports.formEditarGrupo = async (req, res) => {
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());

    //Promise con await
    const [grupo, categorias] = await Promise.all(consultas);

    res.render('editar-grupo', {
        nombrePagina: `Editar grupo: ${grupo.nombre}`,
        grupo,
        categorias
    });
}

//guarda los cambios en la base de datos
exports.editarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    //Si no existe ese grupo o no es el dueño
    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    //Todo bien, leer los valores
    const { nombre, descripcion, categoriaId, url } = req.body;

    //Asignar los valores
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    //Guardamos en la base de datos
    await grupo.save();
    req.flash('exito', 'Cambios almacenados correctamente');
    res.redirect('/administracion');
}

//Muestra el formulario para editar una imagen de grupo
exports.formEditarImagen = async (req, res) => {
    const grupo = await Grupos.findByPk(req.params.grupoId);
    res.render('imagen-grupo', {
        nombrePagina: `Editar imagen de ${grupo.nombre}`,
        grupo
    })
}

//Modifica la imagen en la base de datos y elimina la anterior
exports.editarImagen = async(req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });
    
    //El grupo existe y es valido
    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/iniciar-sesion');
        return next();
    }

    //Si hay imagen anterior y nueva, tenemos que borrar la anterior
    if (req.file && grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        //Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        });
    }

    //Si hay una imagen nueva, la guardamos
    if (req.file) {
        grupo.imagen = req.file.filename;
    }

    //Guardar en la base de datos
    await grupo.save();
    req.flash('exito', 'Cambios guardados correctamente');
    res.redirect('/administracion');
}

//Muestra el formulario para eliminar un grupo
exports.formEliminarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id}});

    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    //Todo bien, ejecutar la vista
    res.render('eliminar-grupo',{
        nombrePagina: `Eliminar grupo: ${grupo.nombre}`
    });
}

//Elimina el grupo e imagen
exports.eliminarGrupo = async(req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id}});

    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    //Si hay una imagen,
    if (grupo.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

        //Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if (error) {
                console.log(error);
            }
            return;
        });
    }

    //Eliminar el grupo
    await Grupos.destroy({
        where: {
            id: req.params.grupoId
        }
    });

    //Redireccionar al usuario
    req.flash('exito', 'Grupo eliminado');
    res.redirect('/administracion');
}
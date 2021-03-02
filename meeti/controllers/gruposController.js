const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const multer = require('multer');
const shortid = require('shortid');
const { MulterError } = require('multer');

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
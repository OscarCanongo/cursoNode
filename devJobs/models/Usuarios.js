const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String
    },
    expira: {
        type: Date
    }
});

//Metodo para hashear los passwords
usuariosSchema.pre('save', async function(next) {
    
    //si el password esta hasheado 
    if (!this.isModified('password')) {
        return next();
    }

    //si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//Envia alerta cuando un usuario esta registrado

usuariosSchema.post('save', function(error, doc, next){
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Correo ya registrado');
    } else {
        next(error);
    }
});

//autenticar usuarios
usuariosSchema.methods = {
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);
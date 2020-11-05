
const mongoose= require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario un estado']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: [true, "El usuario es necesario"],
        ref: 'Usuario'
    }
});


categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'})

module.exports = mongoose.model('Categoria', categoriaSchema);
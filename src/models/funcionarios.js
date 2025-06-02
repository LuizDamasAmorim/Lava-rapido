const { model, Schema } = require('mongoose')

const funcionariosSchema = new Schema({
    nomeFunc: {
        type: String
    },
    cpfFunc:{
        type: String,
        unique: true,
        index: true
    },
    emailFunc: {
        type: String
    },
    foneFunc: {
        type: String
    },
    cargoFunc: {
        type: String
    },
    horaFunc: {
        type: String
    },
    salarioFunc: {
        type: String
    }
}, {versionKey: false})

module.exports = model('Funcionarios', funcionariosSchema)
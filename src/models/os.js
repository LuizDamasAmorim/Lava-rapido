const {model, Schema} = require('mongoose')

const cadastroOS = new Schema({
    dataEntrada: {
        type: Date,
        default: Date.now
    },
    marcaOs: {
        type: String
    },
    modeloOs: {
        type: String
    },
    PlacaVeiculoOS: {
        type: String
    },
    funResponsavel: {
        type: String
    },
    TipoDeLavagem: {
        type: String
    },
    valor: {
        type: String
    }
}, {versionKey: false}) 

module.exports = model('OS', cadastroOS)

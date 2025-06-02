const { model, Schema } = require('mongoose')

const veiculoSchema = new Schema({
    placaVeiculo: {
        type: String,
        unique: true
    },
    marcaVeiculo: {
        type: String
    },
    modeloVeiculo: {
        type: String
    },
    anoVeiculo:{
        type: String,
    },
    corVeiculo: {
        type: String
    },
    tipoVeiculo: {
        type: String
    }
    
}, {versionKey: false})

module.exports = model('Veiculos', veiculoSchema)
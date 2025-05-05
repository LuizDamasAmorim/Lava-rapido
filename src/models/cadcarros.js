/**
 * Modelo de dados para construção das coleções("tabelas")
 * Cadcarros
 */

// Importação dos recursos do framework mongoose
const { model, Schema } = require('mongoose')

// Criação da estrutura da coleção Clientes
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
    
}, {versionKey: false}) // Não versionar os dados armazenados

// Exportar para o main o modelo de dados 
// OBS: Clientes será o nome da coleção
module.exports = model('Veiculos', veiculoSchema)
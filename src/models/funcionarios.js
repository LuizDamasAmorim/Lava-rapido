/**
 * Modelo de dados para construção das coleções("tabelas")
 * Clientes
 */

// Importação dos recursos do framework mongoose
const { model, Schema } = require('mongoose')

// Criação da estrutura da coleção Clientes
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
}, {versionKey: false}) // Não versionar os dados armazenados

// Exportar para o main o modelo de dados 
// OBS: Clientes será o nome da coleção
module.exports = model('Funcionarios', funcionariosSchema)
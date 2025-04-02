/**
 * Modelo de dados para construção das coleções("tabelas")
 * Ordem de serviço 
 */

//Importação dos recursos do framework mongoose
const {model, Schema} = require('mongoose')
const { version, type } = require('os')

//Criação da estrutura da coleção OS
const cadastroOS = new Schema({
    placaOs: {
        type: String
    },
    prazodeFim: {
        type: String
    },
    funResponsavel: {
        type: String
    },
    valor: {
        type: String
    },
    statusDaOS: {
        type: String
    }
}, {versionKey: false}) //Não versionar os dados armazenadas

//Exportar para o main o modelo de dados
//cadastroOS será o nome da coleção

module.exports = model('OS', cadastroOS)

/**
 * Modulo de conexão com o banco de dados
 * Uso de framework mongoose
 */

// Importação do mongoose
const mongoose = require('mongoose')

// Configuração do acesso ao banco de dados
// ip/link - autenticação(usuario e senha)
// Obs: Atlas(obter via compass)
// Para criar um banco  de dados personalizado basta escolher um nome no final da String da url (ex: dbdamasTI)
const url = 'mongodb+srv://admin:123senac@projetonode.hrbjb.mongodb.net/Lava-rapido' //Ligando a nuvem ao meu banco de dados
// Link tirado do meu servidor no Compass

// Criar uma variável de apoio para validação 
let conectado = false

// Metodo para conectar o banco de dados

const conectar = async () => {  // async(trabalha de forma assíncrona)
    // Validação (se não estiver conectado, conectar)
    if (!conectado) { // ! inverte o valor(falso vira verdadeiro)

        // Conectar com o banco de dados:

        try {         // try catch - Tratamento de exceções (try - deu certo / catch - erro)
            await mongoose.connect(url)

            conectado = true //setar a variável

            console.log("MongoDB conectado")
            return true // Para o main identificar a conexão estabelecida com sucesso

        } catch (error) {
            console.log(error)
            if (error.code = 8000) {        // Se o código de erro = 8000 (autenticação)
                console.log("Erro de autenticação")
            } else {
                console.log(erro)
            }
        }
    }
}

// Metodo para desconectar o banco de dados

const desconectar = async () => {
    // Validação (se estiver conectado, desconectar)
    if (conectado) { // ! inverte o valor(falso vira verdadeiro)

        // Desconectar com o banco de dados:

        try {
            await mongoose.disconnect(url) // Desconectar
            conectado = false
            console.log("MongoDB desconectado")
            return true // Para o main identificar que o banco de dados desconectado com sucesso
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

// Exportar para o main os metodos conectar e desconectar 
module.exports = { conectar, desconectar }

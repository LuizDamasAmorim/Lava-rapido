// === Importações ==================================================================================

//Importação do módulo de conexão
const { conectar, desconectar } = require("./database.js")

//Importação do modelo de dados do cliente
const clienteModel = require("./src/models/os.js")
//===================================================================================================



//ATENÇÂO: Para trabalhar com banco de dados usar sempre
//async - await e try-catch


//=== Função para cadastrar uma nova OS: =============================================================

const salvarOS = async (nomeDaOS, prazoDaOS, funcionarioDaOS, valorDaOS, statusDaOS) => {
    try {
        //setar a estrutura de dados com os valores
        //obs: usar os mesmo nomes da estrutura
        const novaOS = new clienteModel({
            nomeOS: nomeDaOS,
            prazodeFim: prazoDaOS,
            funResponsavel: funcionarioDaOS,
            valor: valorDaOS,
            statusOrdServico: statusDaOS
        })

        //A linha abaixo salva os dados no banco de dados
        await novaOS.save()
        console.log("OS adicionada com sucesso")
    } catch (error) {
        //Tratamento personalizado aos erros(exeções)
        if (error.code === 11000) {
            console.log(`Erro no CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}
//===================================================================================================



//=== Função listar todas as OS =====================================================================
const listarOS = async () => {
    try {
        const clientes = await clienteModel.find().sort({
            nomeCliente: 1
        })
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}
//===================================================================================================



//=== Função para buscar uma OS pelo nome do cliente ================================================

//find({nomeCliente: new RegExp(nome, i)}) = Ignorar na bucas letras maiúsculas ou minúsculas
//(i = casy insentive)
const buscarOS = async (nome) => {
    try {
        const clienteNome = await clienteModel.find({
            nomeCliente: new RegExp(nome, 'i')
        })
        console.log(busucarOS)
    } catch (error) {
        console.log(error)
    }
}
//===================================================================================================



//=== Função para editar os dados da OS =============================================================
//ATENÇÃO: usar o id do cliente
const atualizarOS = async (id, nomeOS, prazoOS, funcionarioOS, valorOS, statusOS) => {
    try {
        const osAlterada = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeOS,
                prazodeFim: prazoOS,
                funResponsavel: funcionarioOS,
                valor: valorOS,
                statusDaOS: statusOS
            },
            {
                new: true,
                runValidators: true
            }
        )
        console.log("Dados da OS alterado com sucesso")
    } catch (error) {
        //Tratamento personalizado aos erros(exeções)
        if (error.code === 11000) {
            console.log(`Erro no CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}
//===================================================================================================



//=== Função para excluir os dados da OS ============================================================
const excluirOS = async (id) => {
    try {
        const osDeletado = await clienteModel.findByIdAndDelete(id)
        console.log("OS excluída com sucesso!")
    } catch (error) {
        console.log(error)
    }
}

//====================================================================================================



//=== Inserir os dados no banco de dados: ============================================================
const iniciarSistema = async () => {
    console.clear()
    console.log("Estudo do MongoDB")
    console.log("-------------------------------------")
    await conectar()

    //CRUD create(inscerção do banco de dados)
    //await salvarOS("Luiz Damas Amorim", "12 Horas", "Marcelo Pereira", "R$220,00", "Pendente")

    //CRUD read(listar todas as OS)
    //await listar OS()

    //CRUD read (buscar OS pelo nome do cliente)
    //await buscarOS("Jeferson")

    //CRUD update (id da OS)
    //await atualizarOS("67db23512ed7a6cceff4f67e", "Carlos Henrique Pinheiros", "12 Horas", "Marcelo Pereira", "R$220,00", "Pendente")

    //CRUD delete (id da OS)
    //await excluirOS("67db23512ed7a6cceff4f67e")

    //await salvarOS("Fábio Alberto Lopes", "12 Horas", "Marcelo Pereira", "R$220,00", "Pendente")

    await desconectar()
}

iniciarSistema()

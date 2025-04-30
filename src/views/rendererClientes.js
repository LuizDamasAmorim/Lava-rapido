// Buscar CEP 
function buscarCEP() {
    //console.log("teste do evento blur")

    // Pegando a tag pelo input e colocando o valor dentro de "cep" 
    let cep = document.getElementById('inputCEPClient').value
    console.log(cep)

    //console.log(cep) //teste de recebimento do CEP 
    //"consumir" a API do ViaCEP

    let urlAPI = `https://viacep.com.br/ws/${cep}/json`
    // Acessando o web service para obter os dados 
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {

            // Extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputneighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf

        })
        .catch(error => console.log(error))
}

// Vetor global que será usado na manipulação dos dados 
let arrayClient = []

// Capturar o foco na busca pelo nome  cliente
// A constante foco obtem o elemento html (input) identificação como 'searchClient'
const foco = document.getElementById('searchClient')

// Iniciar a janela de clientes alterando as propiedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões 
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente 
    foco.focus()
})


// Captura dos dados dos inputs do formulário (Passo 1: Fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let addressClient = document.getElementById('inputAddressClient')
let numberClient = document.getElementById('inputNumberClient')
let complementClient = document.getElementById('inputComplementClient')
let neighborhoodClient = document.getElementById('inputneighborhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')

// Captura do Id do cliente (usado no delete e update)
let id = document.getElementById('idClient')
// =============================================================================



// Manipulação da tecla Enter ======================================================

// Função para manipular o evento da tecla Enter 
function teclaEnter(event) {
    // Se a tecla Enter for pressionada
    if (event.key === "Enter") {
        event.preventDefault() // Ignorar o comportamento padrão 
        // Associar o Enter a busca pelo cliente
        buscarCliente()
    }
}

// funão para restaurar o padrão da tecla Enter (submit)
function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}

// "Escuta do evento Tecla Enter"
frmClient.addEventListener('keydown', teclaEnter)

// Fim - Manipulação da tecla Enter ================================================




// =============================================================================
// == CRUD Create/Update =======================================================

// Evento associado ao botão submit (Uso das validações do html)
frmClient.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit, que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulário - passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value, complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value, id.value)
    
    // Limpa o CPF antes de salvar no banco
    let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");

    // Estratégia usada para utlizar o submit para criar um novo cliente ou alterar os dados do cliente, se existir id significa que existe um cliente se não significa que é para adicionar um novo cliente 
    if (id.value === "") {
        // Executar o método para cadastrar um novo cliente
        // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 

        const client = {
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
            emailCli: emailClient.value,
            phoneCli: phoneClient.value,
            cepCli: cepClient.value,
            addressCli: addressClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodCli: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufCli: ufClient.value
        }
        // Enviar ao main o objeto client - (Passo 2: fluxo)
        // Uso do preload.js
        api.newClient(client)
    } else {
        // Executar o método para alterar os dados do cliente
        const client = {
            idCli: id.value,
            nameCli: nameClient.value,
            cpfCli: cpfSemFormatacao,
            emailCli: emailClient.value,
            phoneCli: phoneClient.value,
            cepCli: cepClient.value,
            addressCli: addressClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodCli: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufCli: ufClient.value
        }
        // Enviar ao main o objeto client - (Passo 2: fluxo)
        // Uso do preload.js
        api.updateClient(client)
    }
})
// == Fim CRUD Create/Update ===================================================
// =============================================================================



// == CRUD Read ================================================================
// =============================================================================

function buscarCliente() {
    // Passo 1: capturar o nome do cliente
    let name = document.getElementById('searchClient').value

    console.log(name) // Teste do passo 1

    // Validação de campo obrigatório
    // Se o campo da busca não for preenchido 
    if (name === "") {
        // enviar ao main um pedido para alertar para o usuario
        api.validateSearch()
        foco.focus()
    } else {
        api.searchName(name) // Passo 2: envio do nome ao main

        // Recebimento dos dados do cliente 
        api.renderClient((event, dataClient) => {
            console.log(dataClient) // Teste do passo 5
            // Passo 6: renderizar os dados do cliente no formulário
            // - Criar um vetor global para manipulação dos dados
            // - Criar uma constante para converter os dados recebidos que estão no formato string para o formato JASON (JASON.parse)
            // Usar o laço forEatch para percorrer o vetor e setar os campos (caixas de texto do formulário)
            const dadosCliente = JSON.parse(dataClient)
            // atribuir ao vetor os dados do cliente 
            arrayClient = dadosCliente
            // extrair os dados do cliente
            arrayClient.forEach((c) => {
                id.value = c._id,
                    nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    emailClient.value = c.emailCliente,
                    phoneClient.value = c.foneCliente,
                    cepClient.value = c.cepCliente,
                    addressClient.value = c.logradouroCliente,
                    numberClient.value = c.numeroCliente,
                    complementClient.value = c.complementoCliente,
                    neighborhoodClient.value = c.bairroCliente,
                    cityClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente
                // ------------------------------------------------------------------------------------------------
                // Aqui, apartir do momento em que você pesquisa um usuario presente no seu banco de dados, ele desabilita o botão de adicionar, e habilita os de editar e excluir: 

                // Bloqueio do botão adicionar 
                btnCreate.disabled = true // Pegar o identificador do botão no html e desabilitar ele com o .disabled = true

                // Desbloqueio dos botões editar e excluir
                btnUpdate.disabled = false  // Estavam desativados antes, ativei eles a partir daqui
                btnDelete.disabled = false
            })
        })
    }
}
// ------------------------------------------------------------------------------------------------

// Setar o cliente não cadastrado
api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()

    // Regex para verificar se o valor é só número (CPF)
    if (/^\d{11}$/.test(campoBusca)) {
        // É um número → CPF
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    }
    else if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)) {
        cpfClient.focus()
        foco.value = ""
        cpfClient.value = campoBusca
    }
    else {
        // Não é número → Nome
        nameClient.focus()
        foco.value = ""
        nameClient.value = campoBusca
    }
})


// == Fim CRUD Read ============================================================
// =============================================================================



// =============================================================================
// == Reset Form ===============================================================
function resetForm() {
    // Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload() //Recarrega as configyrções predefinidas
}

// Recebimento do pedido do main para resetar o formuário
api.resetForm((args) => {
    resetForm()
})

// == Fim - Reset Form =========================================================
// =============================================================================




// =============================================================================================
// == Função para aplicar máscara no CPF =======================================================

function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Adicionar eventos para CPF
cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); // Máscara ao digitar
cpfClient.addEventListener("blur", validarCPF); // Validação ao perder o foco


// ====================================================================================================




// == CRUD Delete ==============================================================
// =============================================================================

function excluirCliente() {
    console.log(id.value) // Passo 1 (receber do form o id)
    api.deleteClient(id.value) // Passo 2 (enviar o id ao main)
}

// == Fim do CRUD Delete =======================================================
// =============================================================================

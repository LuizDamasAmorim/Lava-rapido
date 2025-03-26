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

// =============================================================================
// == CRUD Create/Update =======================================================

// Evento associado ao botão submit (Uso das validações do html)
frmClient.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit, que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulário - passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, cepClient.value, addressClient.value, numberClient.value, complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)
    // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
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
})
// == Fim CRUD Create/Update ===================================================


// =============================================================================
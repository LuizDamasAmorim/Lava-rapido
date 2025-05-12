// ====================== Capturar o foco na busca pelo nome cliente =========================
// A constante foco obtem o elemento html (input) identificação como 'searchClient'
const foco = document.getElementById('inputSearchOS')

// Iniciar a janela de clientes alterando as propiedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões 
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente 
    foco.focus()
})
// ===========================================================================================



// Captura dos dados dos inputs do formulário (Passo 1: Fluxo) ===============================
let frmOS = document.getElementById('frmOS')
let FuncionarioOS = document.getElementById('inputFuncionarioOS')
let OsTipo = document.getElementById('inputOsTipo')
let ValorOS = document.getElementById('inputValorOS')
// ============================================================================================



// == CRUD Create/Update ======================================================================

// Evento associado ao botão submit (Uso das validações do html)
frmOS.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit, que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulário - passo 1 do fluxo)
    console.log(FuncionarioOS.value, OsTipo.value, ValorOS.value)

    // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 
    const os = {
        FuncOrderservice: FuncionarioOS.value,
        statusOsTipoLavagem: OsTipo.value,
        valorOrderservice: ValorOS.value,
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // Uso do preload.js
    api.newOs(os)

})
// == Fim CRUD Create/Update ==================================================================



// == Busca avançada - estilo Google ==========================================================

// capturar os ids referente aos campos do nome 
const input = document.getElementById('inputSearchOS')

// capturar o id do ul da lista de sugestoes de placas
const suggestionList = document.getElementById('viewListSuggestion')

// capturar os campos que vão ser preenchidos
let idOS = document.getElementById('IdOS')
let placaCar = document.getElementById('inputPlacaCar')
let marcaOS = document.getElementById('inputMarcaOS')
let ModeloOS = document.getElementById('inputModeloOS')

// vetor usado na manipulação (filtragem) dos dados
let arrayPlaca = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {

    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    //console.log(search) // teste de apoio a logica 

    // passo 2: enviar ao main um pedido de busca de clientes pelo nome (via preload - api (IPC))
    api.searchCar()

    // Recebimentos dos clientes do banco de dados (passo 3)
    api.listVeiculos((event, cars) => {
        console.log(cars) // teste do passo 3 
        // converter o vetor para JSON os dados dos clientes recebidos
        const dataCars = JSON.parse(cars)
        // armazenar no vetor os dados dos clientes
        arrayPlaca = dataCars

        // Passo 4: Filtrar todos os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real 
        const results = arrayPlaca.filter(p =>
            p.placaCar && p.placaCar.toLowerCase().includes(search)
        ).slice(0, 10) // maximo 10 resultados
        console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um item da lista <li>
        results.forEach(p => {
            // criar o elemento li
            const item = document.createElement('li')

            // Adicionar classes bootstrap a cada li criado 
            item.classList.add('list-group-item', 'list-group-item-action')

            // exibir as placas
            item.textContent = p.placaCar

            // adicionar os lis criados a lista ul
            suggestionList.appendChild(item)

            // Adicionar um evento de clique no item da lista para preencher os campos do formulario 
            item.addEventListener('click', () => {
                //idVeiculo.value = c._id
                marcaOS.value = p.marcaOS
                ModeloOS.value = p.ModeloOS

                // Limpar o input e recolher a lista 
                input.value = ""
                suggestionList.value = ""
            }) 
        })
    })
        
})

// Ocultar a lista ao clicar fora
document.addEventListener('click', (event) => {
    // Ocultar a lista se ela existir e estiver ativa 
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})
// == Fim - Busca avançada - estilo Google ====================================================



// == Buscar Os ===============================================================================

function inputOs() {
    //console.log("teste do botão Buscar OS")
    api.searchOS()
}

// == Fim - Buscar OS =========================================================================



// == Reset Form ==============================================================================
function resetForm() {
    // Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload() //Recarrega as configyrções predefinidas
}

// Recebimento do pedido do main para resetar o formuário
api.resetForm((args) => {
    resetForm()
})

// == Fim - Reset Form =========================================================



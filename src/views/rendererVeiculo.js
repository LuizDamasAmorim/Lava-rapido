// Capturar o foco na busca pelo nome do cliente
// A constante foco obtem o elemento html (input) identificação como 'searchClient'
const foco = document.getElementById('searchCar')

// Iniciar a janela de clientes alterando as propiedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões 
    btnUpdate.disabled = true 
    btnDelete.disabled = true
    // Foco na busca do cliente 
    foco.focus()
})


// Captura dos dados dos inputs do formulário (Passo 1: Fluxo)
let frmVeiculo = document.getElementById('frmVeiculo')
let MarcaCar = document.getElementById('inputMarcaCar')
let ModelCar = document.getElementById('inputModeloCar')
let AnoCar = document.getElementById('inputAnoCar')
let CorCar = document.getElementById('inputCorCar')
let TipoCar = document.getElementById('inputTipoCar')
let PlacaCar = document.getElementById('inputPlacaCar')
// =============================================================================



// == CRUD Create/Update =======================================================

// Evento associado ao botão submit (Uso das validações do html)
frmVeiculo.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit, que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulário - passo 1 do fluxo)
    console.log(MarcaCar.value, ModelCar.value, AnoCar.value, CorCar.value, TipoCar.value, PlacaCar.value)
    // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 


    const veiculo = {
        marcaVeiculo: MarcaCar.value,
        modeloVeiculo: ModelCar.value,
        anoVeiculo: AnoCar.value,
        corVeiculo: CorCar.value,
        tipoVeiculo: TipoCar.value,
        placaVeiculo: PlacaCar.value
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // Uso do preload.js
    api.newVeiculo(veiculo) 
})
// == Fim CRUD Create/Update ===================================================




// == Reset Form ===============================================================
function resetForm () {
    // Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload() //Recarrega as configyrções predefinidas
}

// Recebimento do pedido do main para resetar o formuário
api.resetForm((args) =>{
    resetForm()
})

// == Fim - Reset Form =========================================================
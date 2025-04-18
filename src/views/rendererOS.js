// ====================== Capturar o foco na busca pelo nome cliente =========================
// A constante foco obtem o elemento html (input) identificação como 'searchClient'
const foco = document.getElementById('searchOS')

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
let PlacaOS = document.getElementById('inputPlacaOS')
let PrazoOS = document.getElementById('inputPrazoOS')
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
    console.log(PlacaOS.value, PrazoOS.value, FuncionarioOS.value, OsTipo.value, ValorOS.value)

    // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 
    const os = {
        placaOrderservice: PlacaOS.value,
        prazoOrderservice: PrazoOS.value,
        FuncOrderservice: FuncionarioOS.value,
        statusOsTipoLavagem: OsTipo.value,
        valorOrderservice: ValorOS.value,
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // Uso do preload.js
    api.newOs(os) 

})
// == Fim CRUD Create/Update ==================================================================



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



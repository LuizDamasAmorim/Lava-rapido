// ====================== Capturar o foco na busca pelo nome cliente =========================
// A constante foco obtem o elemento html (input) identificação como 'searchFunc'
const foco = document.getElementById('searchFunc')

// Iniciar a janela de funcionários alterando as propiedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    // Desativar os botões 
    btnUpdate.disabled = true 
    btnDelete.disabled = true
    // Foco na busca do cliente 
    foco.focus()
})
// ===========================================================================================



// Captura dos dados dos inputs do formulário (Passo 1: Fluxo) ===============================
let frmFunc = document.getElementById('frmFunc')
let NameFunc = document.getElementById('inputNameFunc')
let CPFFunc = document.getElementById('inputCPFFunc')
let EmailFunc = document.getElementById('inputEmailFunc')
let PhoneFunc = document.getElementById('inputPhoneFunc')
let CargoFunc = document.getElementById('inputCargoFunc')
let HoraFunc = document.getElementById('inputHoraFunc')
let SalarioFunc = document.getElementById('inputSalarioFunc')
// ============================================================================================



// == CRUD Create/Update ======================================================================

// Evento associado ao botão submit (Uso das validações do html)
frmFunc.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão do submit, que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // Teste importante (recebimento dos dados do formulário - passo 1 do fluxo)
    console.log(NameFunc.value, CPFFunc.value, EmailFunc.value, PhoneFunc.value, CargoFunc.value, HoraFunc.value, SalarioFunc.value,)

    // Limpa o CPF antes de salvar no banco
    let cpfSemFormatacao = CPFFunc.value.replace(/\D/g, "");

    // Criarum objeto para armazenar os dados do cliente antes de enviar ao main 
    const funcionario = {
        nomeF: NameFunc.value,
        cpfF: cpfSemFormatacao,
        emailF: EmailFunc.value,
        foneF: PhoneFunc.value,
        cargoF: CargoFunc.value,
        horaF: HoraFunc.value,
        salarioF: SalarioFunc.value
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // Uso do preload.js
    api.newFuncionario(funcionario) 

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
    let campo = document.getElementById('inputCPFFunc');
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
CPFFunc.addEventListener("input", () => aplicarMascaraCPF(CPFFunc)); // Máscara ao digitar
CPFFunc.addEventListener("blur", validarCPF); // Validação ao perder o foco


// ====================================================================================================

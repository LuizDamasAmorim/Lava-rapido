/**
 * Processo de renderezação
 * Tela principal
 */

console.log("Processo de renderização")

// Envio de uma mensagem para o main abrir a janela CadCliente
function cadclientes(){
    // console.log('Teste do botão cliente')
    // Uso da api(autorizada no preload.js)
    api.cadclientesWindow()
}

// Envio de uma mensagem para o main abrir a janela CadCarros
function cadcarros() {
    // console.log("Teste do botão OS")
    // Uso da api(autorizada no preload.js)
    api.cadcarrosWindow()
}

// Envio de uma mensagem para o main abrir a janela Funcionarios
function funcionarios() {
    // console.log("Teste do botão OS")
    // Uso da api(autorizada no preload.js)
    api.funcionariosWindow()
}

// Envio de uma mensagem para o main abrir a janela Funcionarios
function servicos() {
    // console.log("Teste do botão OS")
    // Uso da api(autorizada no preload.js)
    api.servicosWindow()
}

// troca do icone do banco de dados (usando a api do preload.js)
api.dbStatus((event, message) => {
    // teste do recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)
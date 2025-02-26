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
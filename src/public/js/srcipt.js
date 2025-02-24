// Data atualizada no rodapé

function obterData() {
    const dataAtual = new Date ()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    } 

    return dataAtual.toLocaleDateString('pt-BR', options)
}

// Executar a função ao iniciar o aplicativo
document.getElementById('dataAtual').innerHTML = obterData()

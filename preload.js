/**
 * Arquivo de pré carregamento e reforço de segurança na comunicação entre processos (IPC)
 */

// Importação de recursos do framework electron
// contextBridge (segurança) ipcRenderer (comunicação)
const {contextBridge, ipcRenderer} = require('electron')

// enviar ao main um pedido para conexão com o banco de dados e troca do icone no processo de renderização (index.html - renderer.html)
ipcRenderer.send('db-connect')

// Expor (autorizar a comunicação entre processos)

contextBridge.exposeInMainWorld('api', {
    cadclientesWindow: () => ipcRenderer.send('cadclientes-window'),
    cadcarrosWindow: () => ipcRenderer.send('cadcarros-window'),
    servicosWindow: () => ipcRenderer.send('servicos-window'),
    funcionariosWindow: () => ipcRenderer.send('funcionarios-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    newOs: (os) => ipcRenderer.send('new-os', os),
    newVeiculo: (veiculo) => ipcRenderer.send('new-veiculo', veiculo),
    newFuncionario: (funcionario) => ipcRenderer.send('new-funcionario', funcionario),
    resetForm: (args) => ipcRenderer.on('reset-form', args)

})

function dbStatus(message) {
    ipcRenderer.on('db-status', message)
}


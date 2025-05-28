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
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (dataClient) => ipcRenderer.on('render-client', dataClient),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send ('delete-client', id),
    deleteOS: (id) => ipcRenderer.send('delete-OS', id),
    updateClient: (client) => ipcRenderer.send ('update-client', client),
    updateOS: (os) => ipcRenderer.send ('update-os', os),
    searchOS: () => ipcRenderer.send('search-os'),
    searchCar: (cars) => ipcRenderer.send('search-car', cars),
    listVeiculos: (cars) => ipcRenderer.on('list-veiculos', cars),
    renderOS: (dataOS) => ipcRenderer.on('render-os', dataOS),
    printOS: () => ipcRenderer.send('print-os')
})

function dbStatus(message) {
    ipcRenderer.on('db-status', message)
}


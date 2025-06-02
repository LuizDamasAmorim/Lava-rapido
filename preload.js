const {contextBridge, ipcRenderer} = require('electron')

ipcRenderer.send('db-connect')


contextBridge.exposeInMainWorld('api', {
    cadclientesWindow: () => ipcRenderer.send('cadclientes-window'),
    cadcarrosWindow: () => ipcRenderer.send('cadcarros-window'),
    servicosWindow: () => ipcRenderer.send('servicos-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    newOs: (os) => ipcRenderer.send('new-os', os),
    newVeiculo: (veiculo) => ipcRenderer.send('new-veiculo', veiculo),
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


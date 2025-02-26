/**
 * Arquivo de pré carregamento e reforço de segurança na comunicação entre processos (IPC)
 */

// Importação de recursos do framework electron
// contextBridge (segurança) ipcRenderer (comunicação)
const {contextBridge, ipcRenderer} = require('electron')

// Expor (autorizar a comunicação entre processos)

contextBridge.exposeInMainWorld('api', {
    cadclientesWindow: () => ipcRenderer.send('cadclientes-window'),
    cadcarrosWindow: () => ipcRenderer.send('cadcarros-window'),
    servicosWindow: () => ipcRenderer.send('servicos-window'),
    funcionariosWindow: () => ipcRenderer.send('funcionarios-window'),
})


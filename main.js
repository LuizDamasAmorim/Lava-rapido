console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')

// Esta linha está relacionada ao preload.js
const path = require("node:path")

// Importação dos metodos conectar e desconectar (do modulo de conexão)
const {conectar,desconectar} = require("./database.js")

// Janela principal 
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'dark' //se quiser tema claro colocar 'light'
    win = new BrowserWindow({
        width: 800,
        height: 600,
        //autoHideMenuBar: true,    //Minimizar a tela
        //minimizable: false,      //Não deixar diminuir a tela manualmente
        resizable: false,

         //Ativação do preload .js
         webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    // Recebimento dos pedidos remotos do renderizador para a abertura de janelas (botões) autorizado no preload.js 
    ipcMain.on ('cadclientes-window', () => {
        cadclientesWindow()
    })

    ipcMain.on ('servicos-window', () => {
        servicosWindow()
    })

    ipcMain.on ('cadcarros-window', () => {
        cadcarrosWindow()
    })

    ipcMain.on ('funcionarios-window', () => {
        funcionariosWindow()
    })
}

//Janela sobre
function aboutWindow(){
    nativeTheme.themeSource = 'light'

    // A linha abauixo obtem a janela principal
    const main = BrowserWindow.getFocusedWindow()

    let about
    // Estabelecer uma relação hierarquica entre janelas
    if (main) {

        // Criar a janela sobre
        about = new BrowserWindow({
            width: 360,
            height: 220,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true
        })
    }
    // Carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
}

//Janela cadclientes
let cadclientes
function cadclientesWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        cadclientes = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    cadclientes.loadFile('./src/views/cadclientes.html')
    cadclientes.center() // centralizar cadclientes
}

//Janela cadcarros
let cadcarros
function cadcarrosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        cadcarros = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    cadcarros.loadFile('./src/views/cadcarros.html')
    cadcarros.center() // centralizar cadcarros
}

//Janela serviços
let servicos
function servicosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        servicos = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    servicos.loadFile('./src/views/servicos.html')
    servicos.center() // centralizar servicos
}

//Janela funcionarios
let funcionarios
function funcionariosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        funcionarios = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true
        })
    }
    funcionarios.loadFile('./src/views/funcionarios.html')
    funcionarios.center() // centralizar funcionarios
}

// Iniciar a aplicação  

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Reduzir lags não criticos
app.commandLine.appendSwitch('log-level', '3')


// iniciar a conexão com o banco de dados (pedido direto do preload.js)
ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    // se conectado for igual a true
    if (conectado) {
      // enviar uma mensagem para o renderizador trocar o ícone
      setTimeout(() => {
        event.reply('db-status', "conectado")
      }, 500)
    }
  })
  
  // IMPORTANTE! Desconectar do banco de dados quando a aplicação for encerrada
  app.on('before-quit', () => {
    desconectar()
  })


// Template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => cadclientesWindow() 
            },
            {
                label: 'Serviços',
                click: () => servicosWindow() 
            },
            {
                label: 'Funcionários',
                click: () => funcionariosWindow() 
            },
            {
                type: 'separator'
            },
            {
                label: 'Cadastro de veículos',
                click: () => vadcarrosiosWindow() 
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Serviços',
        submenu: [
            {
                label: 'Pendente'
            },
            {
                label: 'Em andamento'
            },
            {
                label: 'Concluidos'
            },
            {
                label: 'Canceladas'
            }
        ]
    },
    {
        label: 'Pagamentos',
        submenu: [
            {
                label: 'Status do pagamento'
            },
            {
                label: 'Forma de pagamento'
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Histórico de serviços'
            },
            {
                label: 'Total faturado'
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restautar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]
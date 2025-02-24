console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu } = require('electron')

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
        resizable: false
    })

    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
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

// Iniciar a aplicação  
app.whenReady().then(() => {
    createWindow()
})

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

// Template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes'
            },
            {
                label: 'Serviços'
            },
            {
                label: 'Funcionários'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cadastro de veículos'
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
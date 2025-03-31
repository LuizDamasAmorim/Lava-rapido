console.log("Processo principal")

// Importações =========================================================================================

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell} = require('electron')

// shell serve para importar pdf

// Esta linha está relacionada ao preload.js
const path = require("node:path")

// Importação dos metodos conectar e desconectar (do modulo de conexão)
const { conectar, desconectar } = require("./database.js")

// Importação dos métodos conectar e desconectar (módulo de conexão)
const clientModel = require('./src/models/Clientes.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca fs (nativa do JavaScript) para manipulação de arquivos pdf
const fs = require('fs')

// ====================================================================================================

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
    ipcMain.on('cadclientes-window', () => {
        cadclientesWindow()
    })

    ipcMain.on('servicos-window', () => {
        servicosWindow()
    })

    ipcMain.on('cadcarros-window', () => {
        cadcarrosWindow()
    })

    ipcMain.on('funcionarios-window', () => {
        funcionariosWindow()
    })
}

//Janela sobre
function aboutWindow() {
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
    if (main) {
        cadclientes = new BrowserWindow({
            width: 1010,
            height: 720,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
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
    if (main) {
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
    if (main) {
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
    if (main) {
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
                label: 'Clientes',
                click: () => relatorioClientes()
            },
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


// Clientes - CRUD Create ==================================================================

// Recebimento do objeto que contém os dados do cliente
ipcMain.on('new-client', async (event, client) => {
    // Importante! Teste de recebimento dos dados do cliente
    console.log(client)

    // Cadastrar a estrutura de dados no banco de dados mongoDB
    try {
        // Criar uma nova estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser identicos ao mdelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto client
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.phoneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.addressCli,
            numeroCliente: client.numberCli,
            complementoCliente: client.complementCli,
            bairroCliente: client.neighborhoodCli,
            cidadeCliente: client.cityCli,
            ufCliente: client.ufCli,
        })
        // Salvar os dados do cliente no banco de dados
        await newClient.save()

         // Mensagem de confirmação 
         dialog.showMessageBox({
            // Customização 
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            // Ação ao pressionar o botão (result = 0)
            if(result.response === 0){
                // Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo 'reset-form' do preload.js)
                event.reply('reset-form')
            }
        })
    } catch (error) {
        //  Se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuario 
        if(error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF ja está cadastrado\nVerifique se digitou corretamente",
                buttons: ['OK']
            }).then((result)=> {
                if (result.response === 0) {
                    // 
                }
            })
        }
        console.log(error)
    }
})
// Fim - Clientes - CRUD CREATE==================================================================



// == Relatório dos clientes ===========================================================

async function relatorioClientes() {
    try {
        // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadasrtrados por ordem alfabética
        const clientes = await clientModel.find().sort({nomeCliente: 1})
        // Teste de recebimento da listagem de clientes
        // console.log(clientes)

        // Passo 2: Formatação do documento pdf 
        // p - portrait | l - landscape | mm e a4 (folha)
        const doc = new jsPDF('p', 'mm', 'a4')
        // definir o tamanho da fonte (tamanho equivalente ao word)
        doc.setFontSize(16)
        
        // Escrevendo um texto (titulo)
        doc.text("Relatório de clientes", 14, 20)//x, y (mm)  (x é horizontal(margem)) (y é vertical)

        // Inserir a  data atual no relatório 
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)   //(x = 160) (y = 10)

        // Variável de apoio na formatação 
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("Email", 130, y)
        y += 5 
        //  Desenhar a linnha 
        doc.setLineWidth(0.5) // espessura da linha 
        doc.line(10, y, 200, y) // 10 (Inicio) ------- 200 (fim)

        // Definir o caminho do arquivo temporário
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        // Salvar temporariamente o arquivo 
        doc.save(filePath)
        // Abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuario
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
    
}
// === Fim - Relatório dos clientes ===================================================
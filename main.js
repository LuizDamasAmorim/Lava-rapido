console.log("Processo principal")

//Importação do modelo de dados do cliente
const clienteModel = require("./src/models/os.js")
// Importações =========================================================================================

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// shell serve para importar pdf

// Esta linha está relacionada ao preload.js
const path = require("node:path")

// Importação dos metodos conectar e desconectar (do modulo de conexão)
const { conectar, desconectar } = require("./database.js")

// Importação dos métodos conectar e desconectar (módulo de conexão)
const clientModel = require('./src/models/Clientes.js')

//Importação do modelo de dados da Os
const osModel = require("./src/models/os.js")

//Importação do modelo de dados dos veículos
const veiculoModel = require("./src/models/cadcarros.js")


// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca fs (nativa do JavaScript) para manipulação de arquivos pdf
const fs = require('fs')

// =====================================================================================================




// Janela principal ====================================================================================
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

    // Fim - Janela principal ===========================================================================




    // Menu personalizado ===============================================================================

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
// Fim - Menu personalizado =========================================================================




// Janelas ==========================================================================================

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
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
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
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
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
// Fim - Janelas ===========================================================================




// Iniciar a aplicação =====================================================================

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
// fim -Iniciar a aplicação ================================================================




// Template do menu ========================================================================
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
// Fim - Template do menu ============================================================================




// Clientes - CRUD Create ============================================================================

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
            if (result.response === 0) {
                // Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo 'reset-form' do preload.js)
                event.reply('reset-form')
            }
        })
    } catch (error) {
        //  Se o código de erro for 11000 (cpf duplicado) enviar uma mensagem ao usuario 
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CPF ja está cadastrado\nVerifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    // 
                }
            })
        }
        console.log(error)
    }
})
// Fim - Clientes - CRUD CREATE==================================================================




// == Relatório dos clientes ====================================================================

async function relatorioClientes() {
    try {
        // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadasrtrados por ordem alfabética
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })
        // Teste de recebimento da listagem de clientes
        // console.log(clientes)

        // Passo 2: Formatação do documento pdf 
        // p - portrait | l - landscape | mm e a4 (folha)
        const doc = new jsPDF('p', 'mm', 'a4')

        // Inserir imagens no documento PDF
        // imagePath (caminho da imagem que será inserida no pfd)
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')

        // imageBase64 (Uso da biblioteca fs para ler o arquivo no formato png)
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })

        doc.addImage(imageBase64, 'PNG', 170, 15) //(eixo X: 5mm, eixo Y: 8mm)

        // definir o tamanho da fonte (tamanho equivalente ao word)
        doc.setFontSize(18)

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

        // renderizar os clientes cadastrados no banco
        y += 10 // Espaçamento da linha

        // Percorrer o vetor clientes(obtido no banco) usando o laço forEach (equivale a laço for)
        clientes.forEach((c) => {
            // Adicionar outra página se a folha inteira for preenchida (estratégia  é saber o tamanho da folha)
            //  folha A4 y = 297mm
            if (y > 280) {
                doc.addPage()
                y = 20 // resetar a variável y

                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("Email", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(c.nomeCliente, 14, y)
            doc.text(c.foneCliente, 80, y)
            doc.text(c.emailCliente || "N/A", 130, y)
            y += 10 // Quebra de linha 
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

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




// Crud OS ============================================================================

ipcMain.on('new-os', async (event, os) => {
    console.log(os)


    try {
        const newOs = new osModel({
            placaOs: os.placaOrderservice,
            prazodeFim: os.prazoOrderservice,
            funResponsavel: os.funResponsavel,
            statusDaOS: os.statusOrderservice,
            valor: os.valorOrderservice
        })
        await newOs.save()
        
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Os adicionada com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }

        })
    } catch (error) {
        console.log(error)
    }
})

// Fim - Crud OS ======================================================================




// Crud Veículos ======================================================================

ipcMain.on('new-veiculo', async (event, veiculo) => {
    console.log(veiculo)


    try {
        const newVeiculo = new veiculoModel({
            modeloVeiculo: veiculo.modeloVeiculo,
            anoVeiculo: veiculo.anoVeiculo,
            corVeiculo: veiculo.corVeiculo,
            tipoVeiculo: veiculo.tipoVeiculo,
            placaVeiculo: veiculo.placaVeiculo
        })
        await newVeiculo.save()
        
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Veículo cadastrado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }

        })
    } catch (error) {
        console.log(error)
    }
})

// Fim - Crud OS ======================================================================

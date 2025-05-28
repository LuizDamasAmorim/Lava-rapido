console.log("Processo principal")

//Importação do modelo de dados do cliente
// const clienteModel = require("./src/models/os.js")

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

//Importação do modelo de dados dos veículos
const funcionarioModel = require("./src/models/funcionarios.js")

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca fs (nativa do JavaScript) para manipulação de arquivos pdf
const fs = require('fs')

// Importação do recurso 'electron-prompt' (dialog de input)
// 1° Instalar o recurso: npm i electron-prompt
const prompt = require('electron-prompt')

// Importação do Mongoose
const mongoose = require('mongoose')
const os = require('./src/models/os.js')

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
            height: 240,
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
            height: 550,
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
            height: 550,
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
            height: 640,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            //Ativação do preload.js
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
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
                click: () => cadcarrosWindow()
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
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'Lavagens concluidas',
                click: () => relatorioLavagem()
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
        doc.text("Telefone", 90, y)
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
                doc.text("Telefone", 90, y)
                doc.text("Email", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(c.nomeCliente, 14, y)
            doc.text(c.foneCliente, 90, y)
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
            PlacaVeiculoOS: os.PlacaVeiculoOS,
            funResponsavel: os.FuncOrderservice,
            TipoDeLavagem: os.statusOsTipoLavagem,
            valor: os.valorOrderservice,
            marcaOs: os.marcaOs,
            modeloOs: os.modeloOs
        })
        await newOs.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Lavagem adicionada com sucesso",
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

// Fim - Crud OS ===================================================================



// == Relatório das lavagens (OS) ==================================================

async function relatorioLavagem() {
    try {
        const fun = await osModel.find().sort({ PlacaVeiculoOS: 1 })

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')

        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })

        doc.addImage(imageBase64, 'PNG', 170, 15) //(eixo X: 5mm, eixo Y: 8mm)

        doc.setFontSize(18)

        doc.text("Relatório de lavagens", 14, 20)//x, y (mm)  (x é horizontal(margem)) (y é vertical)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)   //(x = 160) (y = 10)

        let y = 45
        doc.text("Placa", 14, y)
        doc.text("Tipo", 90, y)
        doc.text("Valor", 130, y)
        y += 5

        //  Desenhar a linnha 
        doc.setLineWidth(0.5) // espessura da linha 
        doc.line(10, y, 200, y) // 10 (Inicio) ------- 200 (fim)

        y += 10

        fun.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20 // resetar a variável y

                doc.text("Placa", 14, y)
                doc.text("Tipo", 90, y)
                doc.text("Valor", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10
            }

            doc.text(String(c.PlacaVeiculoOS), 14, y)
            doc.text(String(c.TipoDeLavagem), 90, y)
            doc.text(String(c.valor ?? "N/A"), 130, y)

            y += 10 // Quebra de linha
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'lavagens.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }

}
// === Fim - Relatório das Lavagens (OS) ===========================================



// Crud Veículos ===================================================================

ipcMain.on('new-veiculo', async (event, veiculo) => {
    console.log(veiculo)


    try {
        const newVeiculo = new veiculoModel({
            marcaVeiculo: veiculo.marcaVeiculo,
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
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "Placa ja está cadastrada\nVerifique se digitou corretamente",
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

// Fim - Crud OS ===================================================================



// Crud Funcionários ===============================================================

ipcMain.on('new-funcionario', async (event, funcionario) => {
    console.log(funcionario)


    try {
        const newFuncionario = new funcionarioModel({
            nomeFunc: funcionario.nomeF,
            cpfFunc: funcionario.cpfF,
            emailFunc: funcionario.emailF,
            foneFunc: funcionario.foneF,
            cargoFunc: funcionario.cargoF,
            horaFunc: funcionario.horaF,
            salarioFunc: funcionario.salarioF
        })
        await newFuncionario.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Funcionário cadastrado com sucesso",
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

// Fim - Crud OS ===================================================================




// Crud Read =======================================================================

// Validação de busca (preenchimento obrigatório)
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ['OK']
    })
})

ipcMain.on('search-name', async (event, name) => {
    //console.log("teste IPC search-name") ( *Dica para testar sempre passo a passo* usar o console.log primeiro e depois ir pro proximo passo)

    //console.log(name) // Teste do passo 2 (Importante!)

    // Passos 3 e 4: Busca dos dados do cliente no banco 

    // find({nomeCliente: name}) - busca pelo nome
    // RegExp(name, 'i') - i (insensitive / Ignorar maiúsculo ou minúsculo)
    try {
        //console.log(dataClient)
        const dataClient = await clientModel.find({
            $or: [
                { nomeCliente: new RegExp(name, 'i') },
                { cpfCliente: new RegExp(name, 'i') }
            ]
        })
        console.log(dataClient) // Teste passos 3 e 4 (importante!) 


        // Melhoria da expêriencia do usuario (se o cliente não estiver cadastrado, alertar o usúario e questionar se ele quer cadastrar este novo cliente. Se não quiser cadastrar, limpar os campos, se quiser cadastrar recortar o nome do cliente do campo de busca e cloar no campo nome)

        // Se o vetor estiver vazio [] (cliente não cadastrado)
        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastrado.\n Deseja cadastrar este cliente?",
                defaultId: 0,
                buttons: ['Sim', 'Não'] // [0,1]
            }).then((result) => {
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar od campod (recortar do campo de busca e colar no campo nome)
                    event.reply('set-client')
                } else {
                    // Limpar o formulário
                    event.reply('reset-form')
                }
            })
        }

        // Passo 5: 
        // Enviando os dados do cliente ao rendererCliente
        // OBS: IPC so trabalha com string, então é necessario converter o JSON para JSON.stringify(dataClient)
        event.reply('render-client', JSON.stringify(dataClient))

    } catch (error) {
        console.log(error)
    }
})

// Fim - Crud Read ===================================================================



// == CRUD Delete ====================================================================

ipcMain.on('delete-client', async (event, id) => {
    console.log(id) //Teste do passo 2 (recebimento do id)

    try {
        // Importante - confirmar a exclusão
        // Client é o nome da variável que representa a janela
        const { response } = await dialog.showMessageBox(cadclientes, {
            type: 'warning',
            title: "Atenção",
            message: "Deseja excluir este cliente?\nEsta ação não podera ser desfeita.",
            buttons: ['Cancelar', 'Excluir'] //[0, 1]
        })
        if (response === 1) {
            // Passo 3 - Excluir o registro do cliente
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-OS', async (event, id) => {
    console.log("TESTE")
    try {
        const { response } = await dialog.showMessageBox({
            type: 'warning',
            title: "Atenção",
            message: "Deseja realmente excluir esta OS?",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {
            const delos = await osModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

// == Fim do CRUD Delete =============================================================



// == CRUD Update ====================================================================

ipcMain.on('update-client', async (event, client) => {
    console.log(client) //teste importante (recebimento dos dados do cliente)
    try {
        // Criar uma nova estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser identicos ao mdelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto client
        const updateClient = await clientModel.findByIdAndUpdate(
            client.idCli,
            {
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
            },
            {
                new: true
            }
        )
        // Mensagem de confirmação 
        dialog.showMessageBox({
            // Customização 
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            // Ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                // Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo 'reset-form' do preload.js)
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// == Fim do CRUD Update =============================================================



// == CRUD Update - OS ===============================================================

ipcMain.on('update-os', async (event, os) => {
    console.log(os) //teste importante (recebimento dos dados do cliente)
    try {
        // Criar uma nova estrutura de dados usando a classe modelo. Atenção! Os atributos precisam ser identicos ao mdelo de dados Clientes.js e os valores são definidos pelo conteúdo do objeto client
        const updateOS = await osModel.findByIdAndUpdate(
            os.idOS,
            {
                funResponsavel: os.FuncOrderservice,
                TipoDeLavagem: os.statusOsTipoLavagem,
                valor: os.valorOrderservice
            },
            {
                new: true
            }
        )
        // Mensagem de confirmação 
        dialog.showMessageBox({
            // Customização 
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {
            // Ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                // Enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rotulo 'reset-form' do preload.js)
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// == Fim do CRUD Update OS ==========================================================






// ================================================================================================*
// == Ordem de Serviço ============================================================================*
// ================================================================================================*



// == Buscar OS =========================================================================

ipcMain.on('search-os', (event) => {
    //console.log("teste: busca OS")
    prompt({
        title: 'Buscar OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        if (result !== null) {

            //buscar a os no banco pesquisando pelo valor do result (número da OS)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dateOS = await osModel.findById(result)
                    if (dateOS) {
                        console.log(dateOS) // teste importante
                        // enviando os dados da OS ao rendererOS
                        // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dateOS)
                        event.reply('render-os', JSON.stringify(dateOS))
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})
//ipcMain.on('search-os', async(event,nameOS)=>{
//try {
//const dateOS  = await osModel.find({nomeClient: new RegExp(name, 'i')})
//console.log(dataClient)
//event.reply ('render-client', JSON.stringify(dataClient))

//} catch (error) {
//console.log(error)  }
//})
// buscar cliente para vincular
ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeClient: 1 })
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})

// == Fim - Buscar OS ====================================================================



// == Buscar Placa para vincular na OS (estilo Google) ===================================

ipcMain.on('search-car', async (event) => {
    try {

        //Buscar as placas em ordem alfabetica
        const cars = await veiculoModel.find().sort({ placaVeiculo: 1 })
        console.log(cars)

        // Passo 3: envio das placas para o renderizador. OBS: Não esquecer de converter para String
        event.reply('list-veiculos', JSON.stringify(cars))

    } catch (error) {
        console.log(error)
    }
})

// == Fim - Buscar Placa =================================================================



// == Imprimir OS ========================================================================


// ipcMain.on('print-os', (event) => {
//     //console.log("teste: busca OS")
//     prompt({
//         title: 'Imprimir OS',
//         label: 'Digite o número da OS:',
//         inputAttrs: {
//             type: 'text'
//         },
//         type: 'input',
//         width: 400,
//         height: 200
//     }).then(async (result) => {
//         if (result !== null) {

//             //buscar a os no banco pesquisando pelo valor do result (número da OS)
//             if (mongoose.Types.ObjectId.isValid(result)) {
//                 try {
//                     // teste importante 
//                     //console.log("imprimir OS")

//                     const dateOS = await osModel.findById(result)
//                     if (dateOS) {
//                         console.log(dateOS) // teste importante
//                         // enviando os dados da OS ao rendererOS
//                         // const cars = await veiculoModel.find({PlacaVeiculoOS: dateOS.PlacaVeiculoOS
//                         // }).sort({ placaVeiculo: 1 })
//                         // console.log(cars)

//                         // impressão (documento PDF) com os dados da OS dos carros e termos do serviço (uso do jspdf)

//                     } else {
//                         dialog.showMessageBox({
//                             type: 'warning',
//                             title: "Aviso!",
//                             message: "OS não encontrada",
//                             buttons: ['OK']
//                         })
//                     }

//                 } catch (error) {
//                     console.log(error)
//                 }
//             } else {
//                 dialog.showMessageBox({
//                     type: 'error',
//                     title: "Atenção!",
//                     message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
//                     buttons: ['OK']
//                 })
//             }
//         }
//     })
// }) 

//ipcMain.on('search-os', async(event,nameOS)=>{
//try {
//const dateOS  = await osModel.find({nomeClient: new RegExp(name, 'i')})
//console.log(dataClient)
//event.reply ('render-client', JSON.stringify(dataClient))

//} catch (error) {
//console.log(error)  }
//})
// buscar cliente para vincular
ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeClient: 1 })
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})

// impressão via botão imprimir
ipcMain.on('print-os', async (event) => {
    prompt({
        title: 'Imprimir OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
        if (result !== null) {
            // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    // teste do botão imprimir
                    //console.log("imprimir OS")
                    const dateOS = await osModel.findById(result)
                    if (dateOS && dateOS !== null) {
                        console.log(dateOS) // teste importante
                        // extrair os dados do cliente de acordo com o idCliente vinculado a OS
                        const dataClient = await veiculoModel.find({
                            _id: dateOS.idCliente
                        })
                        console.log(dataClient)
                        // impressão (documento PDF) com os dados da OS, do cliente e termos do serviço (uso do jspdf)

                        // formatação do documento pdf
                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, 8)
                        doc.setFontSize(18)
                        doc.text("OS:", 14, 45) //x=14, y=45
                        doc.setFontSize(12)

                        // Extração dos dados do cliente vinculado a OS
                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 65),
                                doc.text(c.PlacaVeiculoOS, 34, 65),
                                doc.text(c.modeloOs, 85, 65),
                                doc.text(c.marcaOs || "N/A", 130, 65)
                            //...
                        })

                        // Extração dos dados da OS                        
                        doc.text(String(dateOS.funResponsavel), 14, 85)
                        doc.text(String(dateOS.TipoDeLavagem), 80, 85)
                        doc.text(String(dateOS.valor), 150, 85)

                        // Texto do termo de serviço
                        doc.setFontSize(10)
                        const termo = `
    Termo de Serviço e Garantia
    
    O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:
    
    - Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
    - Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
    - A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do Código de Defesa do Consumidor, e cobre exclusivamente o reparo executado ou peça trocada, desde que o equipamento não tenha sido violado por terceiros.
    - Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
    - Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de armazenagem ou descarte, conforme Art. 1.275 do Código Civil.
    - O cliente declara estar ciente e de acordo com os termos acima.`

                        // Inserir o termo no PDF
                        doc.text(termo, 14, 150, { maxWidth: 180 }) // x=14, y=60, largura máxima para quebrar o texto automaticamente

                        // Definir o caminho do arquivo temporário e nome do arquivo
                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        // salvar temporariamente o arquivo
                        doc.save(filePath)
                        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
                        shell.openPath(filePath)
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }

                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Código da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})

async function printOS(osId) {
    try {
        const dateOS = await osModel.findById(osId)

        const dataClient = await clientModel.find({
            _id: dateOS.idCliente
        })
        console.log(dataClient)
        // impressão (documento PDF) com os dados da OS, do cliente e termos do serviço (uso do jspdf)

        // formatação do documento pdf
        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("OS:", 14, 45) //x=14, y=45
        doc.setFontSize(12)

        // Extração dos dados do cliente vinculado a OS
        dataClient.forEach((c) => {
            doc.text("Cliente:", 14, 65),
                doc.text(c.PlacaVeiculoOS, 34, 65),
                doc.text(c.modeloOs, 85, 65),
                doc.text(c.marcaOs || "N/A", 130, 65)
            //...
        })

        // Extração dos dados da OS                        
        doc.text(String(dateOS.funResponsavel), 14, 85)
        doc.text(String(dateOS.TipoDeLavagem), 40, 85)
        doc.text(String(dateOS.valor), 80, 85)

        // Texto do termo de serviço
        doc.setFontSize(10)
        const termo = `
Termo de Serviço e Garantia

O cliente autoriza a realização dos serviços técnicos descritos nesta ordem, ciente de que:

- Diagnóstico e orçamento são gratuitos apenas se o serviço for aprovado. Caso contrário, poderá ser cobrada taxa de análise.
- Peças substituídas poderão ser retidas para descarte ou devolvidas mediante solicitação no ato do serviço.
- A garantia dos serviços prestados é de 90 dias, conforme Art. 26 do Código de Defesa do Consumidor, e cobre exclusivamente o reparo executado ou peça trocada, desde que o equipamento não tenha sido violado por terceiros.
- Não nos responsabilizamos por dados armazenados. Recomenda-se o backup prévio.
- Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de armazenagem ou descarte, conforme Art. 1.275 do Código Civil.
- O cliente declara estar ciente e de acordo com os termos acima.`

        // Inserir o termo no PDF
        doc.text(termo, 14, 150, { maxWidth: 180 }) // x=14, y=60, largura máxima para quebrar o texto automaticamente

        // Definir o caminho do arquivo temporário e nome do arquivo
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
        shell.openPath(filePath)

    } catch (error) {
        console.log(error)
    }
}

// == Fim - Imprimir Os ==================================================================



// ================================================================================================*
// == Fim - Ordem de Serviço ======================================================================*
// ================================================================================================*
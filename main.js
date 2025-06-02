const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')


const path = require("node:path")

const { conectar, desconectar } = require("./database.js")

const clientModel = require('./src/models/Clientes.js')

const osModel = require("./src/models/os.js")

const veiculoModel = require("./src/models/cadcarros.js")

const { jspdf, default: jsPDF } = require('jspdf')

const fs = require('fs')

const prompt = require('electron-prompt')

const mongoose = require('mongoose')
const os = require('./src/models/os.js')





let win
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    ipcMain.on('cadclientes-window', () => {
        cadclientesWindow()
    })

    ipcMain.on('servicos-window', () => {
        servicosWindow()
    })

    ipcMain.on('cadcarros-window', () => {
        cadcarrosWindow()
    })
}


function aboutWindow() {
    nativeTheme.themeSource = 'light'

    const main = BrowserWindow.getFocusedWindow()

    let about
    if (main) {

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
    about.loadFile('./src/views/sobre.html')
}

let cadclientes
function cadclientesWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        cadclientes = new BrowserWindow({
            width: 1010,
            height: 720,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    cadclientes.loadFile('./src/views/cadclientes.html')
    cadclientes.center()
}

let cadcarros
function cadcarrosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        cadcarros = new BrowserWindow({
            width: 1010,
            height: 550,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    cadcarros.loadFile('./src/views/cadcarros.html')
    cadcarros.center()
}

let servicos
function servicosWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        servicos = new BrowserWindow({
            width: 1010,
            height: 550,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    servicos.loadFile('./src/views/servicos.html')
    servicos.center()
}

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

app.commandLine.appendSwitch('log-level', '3')


ipcMain.on('db-connect', async (event) => {
    let conectado = await conectar()
    if (conectado) {
        setTimeout(() => {
            event.reply('db-status', "conectado")
        }, 500)
    }
})

app.on('before-quit', () => {
    desconectar()
})


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


ipcMain.on('new-client', async (event, client) => {
    try {
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
        await newClient.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
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
                message: "CPF ja está cadastrado\nVerifique se digitou corretamente",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                }
            })
        }
        console.log(error)
    }
})


async function relatorioClientes() {
    try {
        const clientes = await clientModel.find().sort({ nomeCliente: 1 })

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')

        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })

        doc.addImage(imageBase64, 'PNG', 170, 15)

        doc.setFontSize(18)

        doc.text("Relatório de clientes", 14, 20)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 90, y)
        doc.text("Email", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)

        y += 10

        clientes.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20

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
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }

}


ipcMain.on('new-os', async (event, os) => {

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

async function relatorioLavagem() {
    try {
        const fun = await osModel.find().sort({ PlacaVeiculoOS: 1 })

        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')

        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })

        doc.addImage(imageBase64, 'PNG', 170, 15)

        doc.setFontSize(18)

        doc.text("Relatório de lavagens", 14, 20)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)

        let y = 45
        doc.text("Placa", 14, y)
        doc.text("Tipo", 90, y)
        doc.text("Valor", 130, y)
        y += 5

        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)

        y += 10

        fun.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20

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

            y += 10
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


ipcMain.on('new-veiculo', async (event, veiculo) => {

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
                }
            })
        }
        console.log(error)
    }
})


ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ['OK']
    })
})

ipcMain.on('search-name', async (event, name) => {
    try {
        const dataClient = await clientModel.find({
            $or: [
                { nomeCliente: new RegExp(name, 'i') },
                { cpfCliente: new RegExp(name, 'i') }
            ]
        })

        if (dataClient.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: "Aviso",
                message: "Cliente não cadastrado.\n Deseja cadastrar este cliente?",
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-client')
                } else {
                    event.reply('reset-form')
                }
            })
        }

        event.reply('render-client', JSON.stringify(dataClient))

    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-client', async (event, id) => {

    try {
        const { response } = await dialog.showMessageBox(cadclientes, {
            type: 'warning',
            title: "Atenção",
            message: "Deseja excluir este cliente?\nEsta ação não podera ser desfeita.",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {
            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('delete-OS', async (event, id) => {
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


ipcMain.on('update-client', async (event, client) => {
    try {
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
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
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

ipcMain.on('update-os', async (event, os) => {
    try {
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
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados do cliente alterados com sucesso",
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

ipcMain.on('search-os', (event) => {
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

            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dateOS = await osModel.findById(result)
                    if (dateOS) {
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

ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeClient: 1 })
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})


ipcMain.on('search-car', async (event) => {
    try {

        const cars = await veiculoModel.find().sort({ placaVeiculo: 1 })

        event.reply('list-veiculos', JSON.stringify(cars))

    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeClient: 1 })
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})

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
        if (result !== null) {
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dateOS = await osModel.findById(result)
                    if (dateOS && dateOS !== null) {
                    
                        const dataClient = await veiculoModel.find({
                            _id: dateOS.idCliente
                        })
                    

                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, 8)
                        doc.setFontSize(18)
                        doc.text("Lavagem:", 14, 45)
                        doc.setFontSize(12)

                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 65),
                                doc.text(c.PlacaVeiculoOS, 34, 65),
                                doc.text(c.modeloOs, 85, 65),
                                doc.text(c.marcaOs || "N/A", 130, 65)
                        })

                        doc.text(String(dateOS.funResponsavel), 14, 65)
                        doc.text(String(dateOS.TipoDeLavagem), 80, 65)
                        doc.text(String(dateOS.valor), 150, 65)

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

                        doc.text(termo, 14, 140, { maxWidth: 180 })

                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        doc.save(filePath)
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

        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logotubarao64x64.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(18)
        doc.text("OS:", 14, 45)
        doc.setFontSize(12)

        dataClient.forEach((c) => {
            doc.text("Cliente:", 14, 65),
                doc.text(c.PlacaVeiculoOS, 34, 65),
                doc.text(c.modeloOs, 85, 65),
                doc.text(c.marcaOs || "N/A", 130, 65)
        })

        doc.text(String(dateOS.funResponsavel), 14, 65)
        doc.text(String(dateOS.TipoDeLavagem), 40, 65)
        doc.text(String(dateOS.valor), 80, 65)

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

        doc.text(termo, 14, 140, { maxWidth: 180 })

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os.pdf')
        doc.save(filePath)
        shell.openPath(filePath)

    } catch (error) {
        console.log(error)
    }
}
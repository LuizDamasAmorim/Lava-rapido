function cadclientes(){
    api.cadclientesWindow()
}

function cadcarros() {
    api.cadcarrosWindow()
}

function funcionarios() {
    api.funcionariosWindow()
}

function servicos() {
    api.servicosWindow()
}

api.dbStatus((event, message) => {
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
}
)
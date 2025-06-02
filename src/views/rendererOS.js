const foco = document.getElementById('inputSearchOS')

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

let frmOS = document.getElementById('frmOS')
let PlacaVeiculoOS = document.getElementById('inputPlacaOS')
let FuncionarioOS = document.getElementById('inputFuncionarioOS')
let OsTipo = document.getElementById('inputOsTipo')
let ValorOS = document.getElementById('inputValorOS')
let marcaOs = document.getElementById('inputMarcaOS')
let modeloOs = document.getElementById('inputModeloOS')




frmOS.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (idOS.value === "") {
        const os = {
            PlacaVeiculoOS: PlacaVeiculoOS.value,
            FuncOrderservice: FuncionarioOS.value,
            statusOsTipoLavagem: OsTipo.value,
            valorOrderservice: ValorOS.value,
            marcaOs: marcaOs.value,
            modeloOs: modeloOs.value
        }
        api.newOs(os)
    } else {
        const os = {
            idOS: idOS.value,
            PlacaVeiculoOS: PlacaVeiculoOS.value,
            FuncOrderservice: FuncionarioOS.value,
            statusOsTipoLavagem: OsTipo.value,
            valorOrderservice: ValorOS.value,
            marcaOs: marcaOs.value,
            modeloOs: modeloOs.value
        }

        api.updateOS(os)

    }

})

const input = document.getElementById('inputSearchOS')

const suggestionList = document.getElementById('viewListSuggestion')

let idOS = document.getElementById('inputReciboOS')
let dateOS = document.getElementById('inputData')
let placaCar = document.getElementById('inputPlacaCar')
let PlacaOS = document.getElementById('inputPlacaOS')

let arrayPlaca = []

input.addEventListener('input', () => {

    const search = input.value.toLowerCase()

    api.searchCar()

    api.listVeiculos((event, cars) => {
        const dataCars = JSON.parse(cars)
        arrayPlaca = dataCars

        const results = arrayPlaca.filter(c =>
            c.placaVeiculo && c.placaVeiculo.toLowerCase().includes(search)
        ).slice(0, 10)
        suggestionList.innerHTML = ""
        results.forEach(c => {
            const item = document.createElement('li')

            item.classList.add('list-group-item', 'list-group-item-action')

            item.textContent = c.placaVeiculo

            suggestionList.appendChild(item)

            item.addEventListener('click', () => {
                marcaOs.value = c.marcaVeiculo
                modeloOs.value = c.modeloVeiculo
                PlacaOS.value = c.placaVeiculo

                input.value = ""
                suggestionList.value = ""
            })
        })
    })

})

document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})




function inputOs() {
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    const os = JSON.parse(dataOS)

    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    idOS.value = os._id
    dateOS.value = formatada
    marcaOs.value = os.marcaOs
    modeloOs.value = os.modeloOs
    PlacaVeiculoOS.value = os.PlacaVeiculoOS
    FuncionarioOS.value = os.funResponsavel
    OsTipo.value = os.TipoDeLavagem
    ValorOS.value = os.valor

    btnUpdate.disabled = false
    btnDelete.disabled = false

    btnCreate.disabled = true
})




function resetForm() {
    location.reload()
}

api.resetForm((args) => {
    resetForm()
})




function excluirOS() {
    api.deleteOS(idOS.value)
}


function generateOS() {
    api.printOS()
}


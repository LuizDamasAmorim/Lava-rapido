const foco = document.getElementById('searchCar')

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true 
    btnDelete.disabled = true
    foco.focus()
})

let frmVeiculo = document.getElementById('frmVeiculo')
let MarcaCar = document.getElementById('inputMarcaCar')
let ModelCar = document.getElementById('inputModeloCar')
let AnoCar = document.getElementById('inputAnoCar')
let CorCar = document.getElementById('inputCorCar')
let TipoCar = document.getElementById('inputTipoCar')
let PlacaCar = document.getElementById('inputPlacaCar')




frmVeiculo.addEventListener('submit', async (event) => {
    event.preventDefault()

    const veiculo = {
        marcaVeiculo: MarcaCar.value,
        modeloVeiculo: ModelCar.value,
        anoVeiculo: AnoCar.value,
        corVeiculo: CorCar.value,
        tipoVeiculo: TipoCar.value,
        placaVeiculo: PlacaCar.value
    }
    api.newVeiculo(veiculo) 
})


function resetForm () {
    location.reload()
}

api.resetForm((args) =>{
    resetForm()
})


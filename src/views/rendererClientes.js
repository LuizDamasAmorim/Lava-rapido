// Buscar CEP 
function buscarCEP() {
    //console.log("teste do evento blur")

    // Pegando a tag pelo input e colocando o valor dentro de "cep" 
    let cep = document.getElementById('inputCEPClient').value 
    console.log(cep)

    //console.log(cep) //teste de recebimento do CEP 
    //"consumir" a API do ViaCEP

    let urlAPI = `https://viacep.com.br/ws/${cep}/json`
    // Acessando o web service para obter os dados 
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {

            // Extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputneighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf

        })
        .catch(error => console.log(error))
}

const d = document,
    $tplEstado = document.getElementById("tpl-estado");

// Almacenar apikey en backend por seguridad**
// Obtener API en "https://copomex.com/"
let apikey = "";
let copomex = "https://api.copomex.com/query/";
let fragment = document.createDocumentFragment();

let $municipios = d.getElementById("municipio"),
    $estados = d.getElementById("estados");

// Peticion AXIOS

async function getDatos(url) {
    if (apikey == "") {
        console.log("Por favor administrar una API-KEY valida")
        return
    }
    try {
        let response = await axios.get(url);
        return response
    } catch (error) {
        console.log(`Ha surgido un error: ${error}`)
    }

}

// Logica para agregar estados
d.addEventListener("DOMContentLoaded", async e => {


    let estados = await getDatos(`${copomex}/get_estados?token=${apikey}`);
    console.log(estados)
    datosSelect(estados.data.response.estado, $estados);
});

// Agregar datos a <select> de estados o municipios 

let datosSelect = function (array, select) {

    array.forEach(e => {
        let $clon = document.importNode($tplEstado.content, true);
        let $option = $clon.querySelector("option");
        $option.value = e;
        $option.textContent = e;
        fragment.appendChild($clon);
    });


    select.appendChild(fragment);
}

// Logica estado seleccionado

$estados.addEventListener("change", async e => {
    let estado = e.target.value;
    renderMunicipios(estado)
})

// Logica para agregar municipios

let renderMunicipios = async function (estado) {


    let municipios =
        await getDatos(`${copomex}/get_municipio_por_estado/${estado}?token=${apikey}`);
    $municipios.innerHTML = `<option disabled selected value="value1">Elige un municipio</option>`;
    console.log(municipios)
    datosSelect(municipios.data.response.municipios, $municipios)
}


const d = document,
    $tbody = d.querySelector(".tbody"),
    $plantilla = document.querySelector('template').content,
    $busqueda = document.querySelector(".filtro");

// Peticion AXIOS

async function getData(url) {
    try {
        let response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return []; 
    }
}

// Listener del input

d.addEventListener("keydown", async e => {
    if (e.target == $busqueda) {
        let busqueda = $busqueda.value;
        let data = await getData(`https://api.tvmaze.com/search/shows?q=${busqueda}`)
        $tbody.innerHTML = "";
        for (let i = 0; i < data.length; i++) {

            // Lógica del template
            let $clon = d.importNode($plantilla, true);
            // Agregar nombre
            let name = data[i].show.name;
            $clon.querySelector(".nombre").textContent = name;
            let image = data[i].show.image.medium;
            // Agregar poster
            let img = document.createElement("img");
            img.src = image;
            img.alt = name;
            $clon.querySelector(".imagen").appendChild(img);
            // Agregar descripción
            let summary = data[i].show.summary
                ? data[i].show.summary.replace(/<[^>]+>/g, "")
                : "Sin descripción";
            $clon.querySelector(".descripcion").textContent = summary;
            $tbody.appendChild($clon);

        }

    }
})



const d = document,
    $artista = d.querySelector(".artista"),
    $cancion = d.querySelector(".cancion"),
    $form = d.querySelector("form");
$tbody = d.querySelector(".tbody");
// Template
const $template = document.querySelector(".template");

// API KEY

let apiKey = "";

// Peticion AXIOS

async function getDatos(url) {
    try {
        let response = await axios.get(url);
        return response;
    } catch (error) {
        console.error(`Ha surgido un erro: ${error}`)
    }
}

d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();
        let nombreArtista = $artista.value;
        let nombreCancion = $cancion.value;

        let lyricsData =
            await getDatos(`https://api.lyrics.ovh/v1/${nombreArtista}/${nombreCancion}`);
        let artistaData =
            await getDatos(`www.theaudiodb.com/api/v1/json/${APIKEY}/artist.php?i=${nombreArtista}`);



        let $clon = d.importNode($template.content, true);
        $tbody.innerHTML = "";

        // Datos artista
        let artista = artistaData?.data?.artists?.[0];
        $clon.querySelector(".nombre-artista").textContent = artista?.strArtist || "Artista no encontrado";
        $clon.querySelector(".bio").textContent = artista?.strBiographyES || "Sin biografía";
        $clon.querySelector(".cancion").textContent = nombreCancion;
        let letraElem = $clon.querySelector(".letra");
        if (letraElem) {
            letraElem.textContent = lyricsData?.data?.lyrics || "Letra no encontrada";
        }
        $clon.querySelector(".letra").textContent = lyricsData?.data?.lyrics || "Letra no encontrada";

        // Imagen
        let img = $clon.querySelector(".imagen-artista");
        img.src = artista?.strArtistThumb || "";
        img.alt = artista?.strArtist || "Artista";

        $tbody.appendChild($clon);
    }

});;
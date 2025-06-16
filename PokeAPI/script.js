
const d = document,
    $tbody = d.querySelector(".tbody"),
    $prev = d.querySelector(".prev"),
    $next = d.querySelector(".next"),
    $plantilla = document.querySelector('template').content;

// Peticiones Axiox para pokemones e imagenes a traves de PokéAPI

async function getAllPokemons(url) {
    try {
        let res = await axios.get(url);
        let json = res.data;
        return json;
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function getImage(url) {
    try {
        let res = await axios.get(url);
        let json = res.data;
        return json.sprites.front_shiny;
    } catch (err) {
        console.log(err);
        return [];
    }
}


// Inserción Pokemones en el viewport 

d.addEventListener("DOMContentLoaded", async e => {


    function renderPokemones(array) {
        if (respuestas.previous != null) {
            $prev.removeAttribute("hidden");
        } else {
            $prev.setAttribute("hidden", "");
        }
        $tbody.innerHTML = "";
        for (let i = 0; i < array.length; i++) {
            const a = array[i];
            const $clon = d.importNode($plantilla, true);
            $clon.querySelector(".nombre").textContent = a.name;
            getImage(a.url).then(imgUrl => {
                const $imgTd = $clon.querySelector(".imagen");
                if ($imgTd) {
                    $imgTd.innerHTML = `<img src="${imgUrl}" alt="${a.name}">`;
                }
                $tbody.appendChild($clon);
            });
        }
    }


    // Primera solicitud de renderización de pokemones

    let respuestas = await getAllPokemons("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
    renderPokemones(respuestas.results);

    // Comportamiento de botones "Prev" y "Next"
    d.addEventListener("click", async e => {
        if (e.target == $next) {
            if (respuestas.next) {
                respuestas = await getAllPokemons(respuestas.next);
                renderPokemones(respuestas.results);
            }
        }
        if (e.target == $prev) {
            if (respuestas.previous) {
                respuestas = await getAllPokemons(respuestas.previous);
                renderPokemones(respuestas.results);
            }
        }
    });

})


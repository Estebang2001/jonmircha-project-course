
const d = document,
    W = window,
    $site = d.getElementById("site"),
    $post = d.getElementById("posts"),
    $loader = d.querySelector(".loader"),
    $template = d.getElementById("post-template").content,
    $fragment = d.createDocumentFragment(),
    DOMAIN = "https://malvestida.com",
    SITE = `${DOMAIN}/wp-json`,
    API_WP = `${SITE}/wp/v2`,
    POSTS = `${API_WP}/posts?_embed`,
    PAGES = `${API_WP}/pages`,
    CATEGORIES = `${API_WP}/categories`;

let pages = 1,
post = 5;

fetch(POSTS)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => {
        console.log(json)
    })

function getSiteData() {
    fetch(SITE)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            console.log(json);
            $site.innerHTML = `
        <h3> Sitio Web </h3>
        <h2> 
        <a href="${json.url}" target="_blank"> ${json.name} </a>
        </h2>
        <p> ${json.description} </p>
        <p> ${json.timezone_string} </p>
        `;
        })
        .catch(err => {
            console.log(err);
            let message = err.statusText || "Ocurrió un error";
            $site.innerHTML = `<p> Error ${err.status}: ${message}</p>`;
        });
}

function getPost() {
    fetch(`${POSTS}&page=${pages}&per_page=${post}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            console.log(json);



            json.forEach(e => {

                let categories = "",
                    tags = "";

                e._embedded["wp:term"][0].forEach(e => {
                    categories += `<li> ${e.name}</li>`
                })
                e._embedded["wp:term"][1].forEach(e => {
                    tags += `<li> ${e.name}</li>`
                })

                $template.querySelector(".post-image").src = e._embedded["wp:featuredmedia"][0].source_url;
                $template.querySelector(".post-image").alt = e._embedded["wp:featuredmedia"][0].title.rendered;
                $template.querySelector(".post-date").innerHTML = new Date(e.date).toLocaleString();
                $template.querySelector(".post-link").href = e.link;
                $template.querySelector(".post-excerpt").innerHTML = e.excerpt.rendered.replace("[&hellip;]", "... ");
                $template.querySelector(".post-categories").innerHTML = `
            <p> 
            <ul> ${categories} </ul>
            </p>`;
                $template.querySelector(".post-tags").innerHTML = `
            <p> 
            <ul> ${tags} </ul>
            </p>`;
                $template.querySelector(".post-title").innerHTML = e.title.rendered;
                $template.querySelector(".post-content > article").innerHTML = e.content.rendered;




                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });

            $post.appendChild($fragment);

        })
        .catch(err => {
            console.log(err);
            let message = err.statusText || "Ocurrió un error";
            $post.innerHTML = `<p> Error ${err.status}: ${message}</p>`;
        });
}

d.addEventListener("DOMContentLoaded", e => {
    getSiteData();
    getPost();
})

W.addEventListener("scroll", e => {
    let {scrollTop, clientHeight, scrollHeight} = d.documentElement;
    pages++
    if (Math.ceil(scrollTop) + clientHeight >= scrollHeight) {
        console.log("Cargar mas")
        getPost();
    }
})
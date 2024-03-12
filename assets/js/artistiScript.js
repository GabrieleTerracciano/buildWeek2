let config = {}
let id;
let contenitoreArtist = [];
let contenitoreAlbum = [];
const container = document.getElementById('container');
const artista = document.getElementById('nomeartista');
const ascolti = document.getElementById('ascolti');
const topArtista = document.getElementById('top-artista');
const albumArtist = document.getElementById('album');


window.addEventListener('load', init);

function init() {
    GET()
}

async function GET() {
    let jsonConfig = await fetch('assets/data/config.json');
    jsonConfig = await jsonConfig.json();
    config = jsonConfig
    const search = window.location.search
    const urlParametro = new URLSearchParams(search)
    id = urlParametro.get('id');

    getArtist()
    setTimeout(() => {
        getSongAlbum()

    }, 2000)
}

async function getArtist() {
    let artist = await fetch(config.proxy+config.fetchs.artist + id, config.options)
    artist = await artist.json()
    contenitoreArtist = artist;
    artista.innerText = artist.name;
    ascolti.innerText = artist.nb_fan;
    let tracklist = await fetch(config.proxy+artist.tracklist, config.options);
    tracklist = await tracklist.json();
    for(i=0; i < 5; i++){
        const li = document.createElement('li')
        li.innerHTML = `
        <img class="rounded-1 m-2"
            src="${tracklist.data[i].album.cover_small}" width="3.5%"
            alt="${tracklist.data[i].title_short}" />&nbsp;&nbsp;${tracklist.data[i].title}`
    
            topArtista.appendChild(li)
    };
}

async function getSongAlbum() {
    let idMerda = id
    for(i=0; i < config.artist[id].albums.length; i++){
        let album = await fetch(config.proxy+config.fetchs.album+config.artist[idMerda].albums[i], config.options);
        album = await album.json()
const id = album.id;
const title =  album.title;
const cover =  album.cover_medium;


     const div = document.createElement('div');
     div.classList.add('col-2')
    
     div.innerHTML = `<a href="album.html?id=${id}">
     <div class="card bg-card" id="author-${id}">
         <img src="${cover}" class="card-img-top p-3 m-auto" style="border-radius:20px" alt="${title}">
         <div class="card-body">
             <h6 class="card-title">${title}</h6>
             <p class="card-text text-secondary">Artista</p>
         </div>
     </div>
 </a>`
     
     

     albumArtist.appendChild(div);
    }
};
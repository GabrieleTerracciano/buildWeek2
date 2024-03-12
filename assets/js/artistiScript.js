let config = {}
let id;
let contenitore = [];
const container = document.getElementById('container');
const artista = document.getElementById('nomeartista');
const ascolti = document.getElementById('ascolti');
const topArtista = document.getElementById('top-artista');
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
}

async function getArtist() {
    let artist = await fetch(config.fetchs.artist + id, config.options)
    artist = await artist.json()
    console.log(artist.name)
    contenitore = artist;
    artista.innerText = artist.name;
    ascolti.innerText = artist.nb_fan;
    let tracklist = await fetch(artist.tracklist, config.options);
    tracklist = await tracklist.json();
    for(i=0; i < 5; i++){
        const li = document.createElement('li')
        li.innerHTML = `
        <img class="rounded-1"
            src="${tracklist.data[i].album.cover_small}" width="3.5%"
            alt="${tracklist.data[i].title_short}" />&nbsp;&nbsp;${tracklist.data[i].title}`
    
            topArtista.appendChild(li)
    };
}

async function getSongAlbum() {
    let song = await fetch(config.fetch.artist.songs + id, config.options)
    song = await song.json()
}
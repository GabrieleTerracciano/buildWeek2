
let config = {}
const durationTrack = document.getElementById('duration');
const trackList = document.getElementById('trackList');
const nomeAlbum = document.getElementById('nomeAlbum');
const artista = document.getElementById('artista');
const anno = document.getElementById('anno');
const nBrani = document.getElementById('nBrani');
const oreAlbum = document.getElementById('oreAlbum');
const minutiAlbum = document.getElementById('minutiAlbum');
const albumCover = document.getElementById('albumCover');
let id;
let albums = {};




window.addEventListener('load', init);

function init() {
    console.log('init')
    GET()
    Vibrant.from('https://e-cdns-images.dzcdn.net/images/cover/7c7cfb109091024c59ff65e1b7b93704/250x250-000000-80-0-0.jpg').getPalette(function(err, palette) {
        console.log(palette)
        const bgVibrant = document.getElementById('bgVibrant')
        bgVibrant.style.backgroundColor = `rgb(${palette.DarkMuted._rgb[0]},${palette.DarkMuted._rgb[1]},${palette.DarkMuted._rgb[2]})`
        
    });
}





async function GET() {
    console.log('get')
    let jsonConfig = await fetch('assets/data/config.json');
    jsonConfig = await jsonConfig.json();
    config = jsonConfig


    getSongAlbum();


}


async function getSongAlbum() {
    
    console.log('song')
    const search = window.location.search
    const urlParametro = new URLSearchParams(search)
    id = urlParametro.get('id');


    let album = await fetch(config.proxy + config.fetchs.album + id, config.options);
    album = await album.json()
    albums = album


    //destrutturiamo l'oggetto
    const nomeAlb = albums.title;
    let durataAlbum = albums.duration;
    let oreAlb = Math.floor((durataAlbum / 60) / 60);
    let minutiRimanentiAlb = oreAlb % 60;
    const annoAlbum = albums.release_date;
    const soloAnno = annoAlbum.split('-')[0];
    const nomeArtista = albums.artist.name;
    const numeroBrani = albums.nb_tracks;
    const img = albums.cover_medium;
    albumCover.src = img;

    
    
    

    console.log(durataAlbum, soloAnno, nomeArtista,numeroBrani, oreAlb, minutiRimanentiAlb,nomeAlbum)

    //mandiamo in html i valori destrutturati
    nomeAlbum.innerText = nomeAlb;
    artista.innerText = nomeArtista;
    anno.innerText = soloAnno;
    nBrani.innerText = numeroBrani;
    oreAlbum.innerText = oreAlb;
    minutiAlbum.innerText = minutiRimanentiAlb;

    console.log(albums)
    
for (i = 0; i < albums.tracks.data.length; i++) {
        const li = document.createElement('li');
        const idAlbum = albums.tracks.data[i].id;
        const title = albums.tracks.data[i].title;
        const cover = albums.tracks.data[i].cover_medium;
        const duration = albums.tracks.data[i].duration;
        

        li.innerHTML = `<div id="${idAlbum}" class="d-flex align-center justify-content-between">
        <div class="w-75">
        <span class="d-block fs-5 col-6 titoloTrack w-100">${title}</span>
        <span class="d-block">${nomeArtista}</span>
        </div>
        <div>${duration}
        </div>
        </div>`

        

        trackList.appendChild(li);
       
    }

    

};



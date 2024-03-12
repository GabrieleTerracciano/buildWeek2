
let config = {}
const trackList = document.getElementById('trackList');
const nomeArtista = document.getElementById('nomeArtista');
let id;
let array = [];




window.addEventListener('load', init);

function init(){
GET()
    
}


async function GET() {
    let jsonConfig = await fetch('assets/data/config.json');
    jsonConfig = await jsonConfig.json();
    config = jsonConfig
    
   
        getSongAlbum();

   
}


async function getSongAlbum() {
    const search = window.location.search
    const urlParametro = new URLSearchParams(search)
    id = urlParametro.get('id');
    
    
        let album = await fetch(config.proxy+"https://deezerdevs-deezer.p.rapidapi.com/album/"+ config.artist[id].albums[i], config.options);
        album = await album.json()
        array = album
for(i=0; i < array.length; i++){        
        console.log(array)
const idAlbum = data.id;
const title =  data.title;
const cover =  album.cover_small;

nomeArtista.innerText = title;
     const li = document.createElement('li');
     li.innerHTML = `<div><h5>${id}/h5>
     <p>Artista</p>
      </div>`
     
     

     trackList.appendChild(li);
    }
};
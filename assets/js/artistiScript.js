let config = {}
let id;
let contenitoreArtist = [];
let contenitoreAlbum = [];
const container = document.getElementById('container');
const artista = document.getElementById('nomeartista');
const ascolti = document.getElementById('ascolti');
const topArtista = document.getElementById('top-artista');
const albumArtist = document.getElementById('album');

const playPauseButton = document.querySelector(".play-pause");
const progressBar = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container .progress-bar");
const volumeProgressBar = document.querySelector(".volume-bar .progress");
const volumeContainer = document.querySelector(".volume-bar .progress-bar");

const cTime = document.getElementById('currentTime')
const tTime = document.getElementById('totalTime')

let isPlaying = false;
let audio;

function togglePlayPause() {
    if (audio) {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon();
    }
    return
}

// Funzione per aggiornare l'icona del pulsante play/pausa
function updatePlayPauseIcon() {
    playPauseButton.classList.toggle("bi-play-fill", !isPlaying);
    playPauseButton.classList.toggle("bi-pause-fill", isPlaying);
}

playPauseButton.addEventListener('click', togglePlayPause)

progressContainer.addEventListener('click', function(e) {
    if (audio) {
        const clickX = e.offsetX;
        const progressBarWidth = progressContainer.offsetWidth;
        const clickPercent = (clickX / progressBarWidth);
        const newTime = clickPercent * audio.duration;
        audio.currentTime = newTime
    }
})

volumeContainer.addEventListener('click', function(e) {
    const clickX = e.offsetX;
    const volumeBarWidth = volumeContainer.offsetWidth;
    const clickPercent = clickX / volumeBarWidth;
    if (audio) {
        audio.volume = clickPercent;
    }
    volumeProgressBar.style.width = `${clickPercent * 100}%`;
})

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

    await getArtist()
    getSongAlbum()
}

function getDurata(time) {
    time = parseInt(time)
    const minuti = Math.floor(time / 60)
    console.log(minuti)
    let secondi = time - (minuti * 60)
    if (secondi >= 0  && secondi < 10) {
        secondi = "0"+secondi
    }
    return `${minuti}:${secondi}`
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
        console.log(tracklist.data[i])
        const div = document.createElement('div')
        div.setAttribute('data-preview', tracklist.data[i].preview)
        div.innerHTML = `
        <img class="rounded-1 m-2"
            src="${tracklist.data[i].album.cover_small}" width="3.5%"
            alt="${tracklist.data[i].title_short}" />&nbsp;&nbsp;${tracklist.data[i].title}`
        div.addEventListener('click', async function(e) {
            e.preventDefault();
            if (audio) {
                if (isPlaying) {
                    togglePlayPause()
                }
                audio.removeEventListener('timeupdate', function() {
                    const progressPercent = (audio.currentTime / audio.duration) * 100;
                    progressBar.style.width = `${progressPercent}%`;
                })
                audio= null;
            }
            audio = new Audio(this.getAttribute('data-preview'));
            cTime.innerText = "0:00"
            audio.addEventListener('timeupdate', function() {
                tTime.innerText = getDurata(audio.duration)
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                cTime.innerText = getDurata(audio.currentTime)
                progressBar.style.width = `${progressPercent}%`;
            })
            togglePlayPause()
        })
            li.appendChild(div)
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
     <div class="card bg-card" id="album-${id}">
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





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
const player = document.getElementById('player');
let id;
let albums = {};

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
    console.log('init')
    GET()
}





async function GET() {
    console.log('get')
    let jsonConfig = await fetch('assets/data/config.json');
    jsonConfig = await jsonConfig.json();
    config = jsonConfig


    getSongAlbum();


}

function getDurata(time) {
    time = parseInt(time)
    const minuti = Math.floor(time / 60)
    let secondi = time - (minuti * 60)
    if (secondi >= 0 && secondi < 10) {
        secondi = "0"+secondi
    }
    return `${minuti}:${secondi}`
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

    
    Vibrant.from(albums.cover_medium).getPalette(function(err, palette) {
        const bgVibrant = document.getElementById('bgVibrant')
        console.log(palette)
        bgVibrant.style.backgroundColor = `rgb(${palette.DarkMuted._rgb[0]},${palette.DarkMuted._rgb[1]},${palette.DarkMuted._rgb[2]})`
    });
    

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
        const durationMin = Math.floor(duration / 60);
        let secRiman = duration - (durationMin * 60);
        
        if (secRiman >= 0 && secRiman < 10) {
            secRiman = "0"+ secRiman
  
        }
          
        
        
        

        li.innerHTML = `<div class="d-flex align-center justify-content-between">
            <div class="w-75">
                <span class="d-block fs-5 col-6 titoloTrack w-100" id="${idAlbum}" data-preview="${albums.tracks.data[i].preview}">${title}</span>
                <span class="d-block">${nomeArtista}</span>
            </div>
            <div>${durationMin}:${secRiman}
            </div>
        </div>`

        trackList.appendChild(li);
        const album = document.getElementById(idAlbum)
        album.addEventListener('click', function(e) {
            e.preventDefault();
            if (audio) {
                if (isPlaying) {
                    togglePlayPause();
                }
                audio.removeEventListener('timeupdate', function() {
                    const progressPercent = (audio.currentTime / audio.duration) * 100;
                    progressBar.style.width = `${progressPercent}%`;
                })
                audio = null;
            }
            const preview = this.getAttribute('data-preview')
            audio = new Audio(preview)
            cTime.innerText = "0:00";
            audio.addEventListener('timeupdate', function() {
                tTime.innerText = getDurata(this.duration)
                const progressPercent = (this.currentTime / this.duration) * 100
                cTime.innerText = getDurata(this.currentTime)
                progressBar.style.width = `${progressPercent}%`
            })
            togglePlayPause()
        })
    }

    

};


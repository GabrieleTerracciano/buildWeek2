let config = {}

// let contenitore = [];

const rowArtist = document.getElementById('rowArtist');
const rowAlbum = document.getElementById('rowAlbum');
const rowTracce = document.getElementById('rowTracce');

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

window.addEventListener('load', init);
function init() {
	GET();
}

const GET = async () => {
	try {
		let jsonConfig = await fetch('assets/data/config.json');
		jsonConfig = await jsonConfig.json();
		config = jsonConfig;
		getArtist();
		getAlbum();
		getTrack();
	} catch (error) {
		console.error(error);
	}
};

async function getArtist() {
	for (const [key, value] of Object.entries(config.artist)) {
		let artista = await fetch(`${config.proxy}${config.fetchs.artist}${key}`, config.options)
		artista = await artista.json();

		const div = document.createElement('div');
		div.classList.add('col-2')
		div.innerHTML = `
		<a href="artista.html?id=${artista.id}">
			<div class="card border-0" id="author-${artista.id}" style="background-color:#181818">
				<img src="${artista.picture_medium}" class="card-img-top w-75 p-2 m-auto rounded-circle" alt="${artista.name}">
				<div class="card-body">
					<h6 class="card-title">${artista.name}</h6>
					<p class="card-text text-secondary">Artista</p>
				</div>
			</div>
		</a>`;
		rowArtist.appendChild(div)
	}
};

async function getAlbum() {
	config.home.albums.forEach(async (element) => {
		let album = await fetch(`${config.proxy}${config.fetchs.album}${element}`, config.options)
		album = await album.json();
		const div = document.createElement('div');
		div.classList.add('col-2')
		div.innerHTML = `
		<a href="album.html?id=${album.id}">
			<div class="card border-0" id="album-${album.id}" style="background-color:#181818">
				<img src="${album.cover_medium}" class="card-img-top w-75 p-2 m-auto rounded-2" alt="${album.title}">
				<div class="card-body">
					<h6 class="card-title">${album.title}</h6>
					<p class="card-text text-secondary">Album &middot; ${album.artist.name}</p>
				</div>
			</div>
		</a>`;
		rowAlbum.appendChild(div)
	})
}


async function getTrack() {

	let ricerca = config.home.tracks[Math.floor(Math.random() * config.home.tracks.length)]
	console.log(ricerca)
	let track = await fetch(`${config.proxy}${config.fetchs.search}${ricerca}`, config.options)
	track = await track.json();
	let count = 0
	track.data.forEach(async (element) => {
		if (count >= 6) {
			return
		}
		count++
		console.log(element)
		const div = document.createElement('div');
		div.classList.add('col-2')
		div.innerHTML = `
		<div class="card border-0" id="search-${element.id}" style="background-color:#181818" data-preview="${element.preview}">
			<img src="${element.album.cover_medium}" class="card-img-top w-75 p-2 m-auto rounded-2" alt="${element.title}">
			<div class="card-body">
				<h6 class="card-title">${element.title}</h6>
				<p class="card-text text-secondary">${element.type == 'track' && "Traccia" || "Album"} &middot; ${element.artist.name}</p>
			</div>
		</div>`;
		rowTracce.appendChild(div)
		const card = document.getElementById(`search-${element.id}`)
		card.addEventListener('click', function(e) {
			e.preventDefault();
			if (audio) {
                if (isPlaying) {
                    togglePlayPause()
                }
                audio.removeEventListener('timeupdate', function() {
                    const progressPercent = (audio.currentTime / audio.duration) * 100;
                    progressBar.style.width = `${progressPercent}%`;
                })
                audio = null;
            }
            audio = new Audio(this.getAttribute('data-preview'));
            cTime.innerText = "0:00"
            audio.addEventListener('timeupdate', function() {
                tTime.innerText = getDurata(this.duration)
                const progressPercent = (this.currentTime / this.duration) * 100;
                cTime.innerText = getDurata(this.currentTime)
                progressBar.style.width = `${progressPercent}%`;
            })
            togglePlayPause()
		})
	})
}
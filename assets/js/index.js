const options = {
	method: 'GET',
	headers: {
		// 'X-RapidAPI-Key': 'c509d4948cmsh9aac42c276c130ep19f8a1jsn3b39e16794e9',
		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
	},
};

let config = {}

let contenitore = [];

const row = document.getElementById('row-artist');

window.addEventListener('load', init);
function init() {
	GET();
}

const GET = async () => {
	try {
		let jsonConfig = await fetch('assets/data/config.json');
		jsonConfig = await jsonConfig.json();
		console.log(jsonConfig)
		options.headers["X-RapidAPI-Key"] = jsonConfig.clientId
		console.log(options)
		config = jsonConfig;
		console.log(config.artist)
		getArtist();
	} catch (error) {
		console.error(error);
	}
};

async function getArtist() {
	for (const [key, value] of Object.entries(config.artist)) {
		let artista = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/artist/${key}`, options)
		artista = await artista.json();

		const div = document.createElement('div');
		div.classList.add('col-2')
		div.innerHTML = ` 
		<div class="card bg-card" id="author-${artista.id}">
			<img src="${artista.picture_medium}" class="card-img-top w-75 p-2 m-auto rounded-circle" alt="${artista.name}">
			<div class="card-body">
				<h6 class="card-title">${artista.name}</h6>
				<p class="card-text text-secondary">Artista</p>
			</div>
		</div>`;
		row.appendChild(div)
	}
// 	for (let i = 0; i < contenitore.data.length; i++) {
// 		const id = contenitore.data[i].album.id;
// 		console.log(id);

// 		const title = contenitore.data[i].album.title;
// 		console.log(title);
// 		const cover = contenitore.data[i].album.cover;
// 		const tracklist = contenitore.data[i].album.tracklist;

// 		const div = document.createElement('div');
// 		div.classList.add('col-2')
// 		div.innerHTML = ` 
// <div class="card" id="${id}">
//   <img src="${cover}" class="card-img-top w-50" alt="${title}" style="border-radius:10px">
//   <div class="card-body">
//     <h5 class="card-title">${title}</h5>
//     <p class="card-text">Artista</p>
//   </div>
// </div>`;
// 		row.appendChild(div);
// 	}
};

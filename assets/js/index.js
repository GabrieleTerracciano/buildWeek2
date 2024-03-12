let config = {}

// let contenitore = [];

const row = document.getElementById('row-artist');

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
	} catch (error) {
		console.error(error);
	}
};

async function getArtist() {
	for (const [key, value] of Object.entries(config.artist)) {
		let artista = await fetch(`${config.fetchs.artist}${key}`, config.options)
		artista = await artista.json();

		const div = document.createElement('div');
		div.classList.add('col-2')
		div.innerHTML = `
		<a href="artista.html?id=${artista.id}">
			<div class="card bg-card" id="author-${artista.id}">
				<img src="${artista.picture_medium}" class="card-img-top w-75 p-2 m-auto rounded-circle" alt="${artista.name}">
				<div class="card-body">
					<h6 class="card-title">${artista.name}</h6>
					<p class="card-text text-secondary">Artista</p>
				</div>
			</div>
		</a>`;
		row.appendChild(div)
	}
};



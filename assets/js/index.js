let clientId;

async function getConfig() {
    let response = await fetch('assets/data/config.json')
    const config = await response.json();
    clientId = config.clientId
}

const start = async () => {
    getConfig().then(config => {
        clientId = config.clientId
    })
}

const init = () => {
    start()
}

window.addEventListener('load', init)
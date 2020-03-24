const fetch = require('node-fetch');
const config = require('config');
setInterval(async() => {
    try {
        const herokuPingUrl = config.get("heroku_ping_url");
        await fetch(herokuPingUrl);
    } catch (error) {
    }
}, 600000);
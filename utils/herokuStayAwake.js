const fetch = require('node-fetch');
setInterval(async() => {
    try {
        await fetch('http://localhost:5000/api/general/contents');
    } catch (error) {
    }
}, 600000);
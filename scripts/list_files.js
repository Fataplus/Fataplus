const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be";

function apiRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            path: '/api/v1/' + path,
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            family: 4
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: data });
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function main() {
    console.log("Probing Files API...");

    // 1. Files API with Root Path
    console.log("Probe 1: /files?path=/");
    let res = await apiRequest(`apps/${targetAppId}/files?path=/`);
    console.log(`Status: ${res.status}`);
    if (res.status < 400) console.log(res.body.substring(0, 200));

    // 2. Files API with relative Path
    console.log("\nProbe 2: /files?path=.");
    res = await apiRequest(`apps/${targetAppId}/files?path=.`);
    console.log(`Status: ${res.status}`);
    if (res.status < 400) console.log(res.body.substring(0, 200));

    // 3. Files API with /app/data
    console.log("\nProbe 3: /files?path=/app/data");
    res = await apiRequest(`apps/${targetAppId}/files?path=/app/data`);
    console.log(`Status: ${res.status}`);

    // 4. Try just /apps endpoint to ensure ID is valid (sanity check)
    console.log("\nProbe 4: /apps/{id}");
    res = await apiRequest(`apps/${targetAppId}`);
    console.log(`Status: ${res.status}`);

}

main();

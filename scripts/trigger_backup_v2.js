const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be"; // sitraka-prestataire.com
const siteId = "105bd299-275d-4be6-a977-029a11027c76"; // Found from previous check

function apiRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            path: '/api/v1/' + path,
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    console.log(`Error Status: ${res.statusCode} Body: ${data}`);
                    resolve({ error: true, status: res.statusCode, message: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function main() {
    try {
        console.log(`Triggering backup for App ID: ${targetAppId} to Site: ${siteId}`);
        const trigger = await apiRequest(`apps/${targetAppId}/backup`, 'POST', {
            backupSiteId: siteId
        });
        console.log("Trigger Result:", trigger);

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

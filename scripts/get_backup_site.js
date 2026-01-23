const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";

function apiRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            path: '/api/v1/' + path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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
    try {
        console.log("--- LISTING BACKUP SITES ---");
        // Endpoint: /api/v1/backups/sites (Guessing common Cloudron pattern for locations)
        // Or checking /settings/backups
        // Let's try to get system info which might have it

        // Trying /api/v1/backups/providers or /api/v1/storage
        let res = await apiRequest('backups/providers');
        if (res.status === 200) {
            console.log("Providers:", res.body);
        } else {
            console.log("Providers failed:", res.status);

            // Try listing backups again, maybe the 'backup' object has the siteId
            res = await apiRequest('backups');
            console.log("Backups List Snippet:", res.body.substring(0, 500));
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

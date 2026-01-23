const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be";

function apiRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            path: '/api/v1/' + path,
            method: 'GET',
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
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function main() {
    try {
        console.log("Listing backups for app...");
        const backups = await apiRequest(`apps/${targetAppId}/backups`);

        if (backups.backups && backups.backups.length > 0) {
            // Sort by time descending
            const sorted = backups.backups.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
            const latest = sorted[0];
            console.log(`Latest Backup ID: ${latest.id}`);
            console.log(`Creation Time: ${latest.creationTime}`);

            // Check for download URL
            // Endpoint guess: /api/v1/backups/{id}/download_url
            console.log("Checking download URL...");
            // Note: Use the backup ID, not app ID
            const downloadInfo = await apiRequest(`backups/${latest.id}/download_url`);
            console.log("Download Info:", JSON.stringify(downloadInfo, null, 2));

        } else {
            console.log("No backups found in list response.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

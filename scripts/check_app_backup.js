const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetDomain = "sitraka-prestataire.com";

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
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject("Json parse error");
                    }
                } else {
                    reject(`Status: ${res.statusCode} ${data}`);
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function main() {
    try {
        // 1. Find App ID
        const apps = await apiRequest('apps');
        const targetApp = apps.apps.find(a => a.domain === targetDomain || a.fqdn === targetDomain);

        if (!targetApp) {
            console.log("App not found");
            return;
        }

        console.log(`Found App: ${targetApp.manifest.title} (ID: ${targetApp.id})`);

        // 2. List Backups for this App
        // Try getting /apps/{id}/backups (common pattern)
        try {
            console.log("Listing backups for app...");
            const backups = await apiRequest(`apps/${targetApp.id}/backups`);
            console.log("Backups found:", backups.backups ? backups.backups.length : 0);
            if (backups.backups && backups.backups.length > 0) {
                console.log("Latest Backup:", JSON.stringify(backups.backups[0], null, 2));
            }
        } catch (e) {
            console.log("Failed to list backups via app endpoint:", e);
            // Fallback: Check global backup list filter
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

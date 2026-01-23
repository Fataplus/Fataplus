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
        console.log("--- APPS ---");
        const apps = await apiRequest('apps');
        apps.apps.forEach(app => {
            console.log(`[${app.runState}] ${app.manifest.title} (${app.manifest.id}) - ${app.fqdn}`);
        });

        console.log("\n--- BACKUPS ---");
        // Check backup config or listing
        // Note: Endpoint might be /backups or /cloudron/backups depending on version, trying /backups first
        try {
            const backups = await apiRequest('backups');
            // Backups might be an array or object with 'backups' key
            const list = backups.backups || backups;
            if (Array.isArray(list)) {
                list.slice(0, 5).forEach(b => {
                    console.log(`Backup: ${b.id} (${b.creationTime}) - ${b.mode}`);
                });
            } else {
                console.log("Backup response:", JSON.stringify(list).substring(0, 200));
            }
        } catch (e) {
            console.log("Could not list backups:", e);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

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
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    console.log("Inspecting Backup Metadata...");
    try {
        const result = await apiRequest(`apps/${targetAppId}/backups`, 'GET');

        if (result.status === 200) {
            const data = JSON.parse(result.body);
            if (data.backups && data.backups.length > 0) {
                const latest = data.backups[0];
                console.log("Latest Backup Object:", JSON.stringify(latest, null, 2));

                // Probe GET /backups/{id}
                console.log("\nProbing GET /backups/{id}...");
                const backupMeta = await apiRequest(`backups/${latest.id}`, 'GET');
                console.log(`Status: ${backupMeta.status}`);
                if (backupMeta.status === 200) {
                    console.log("Backup Details:", backupMeta.body);
                }
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

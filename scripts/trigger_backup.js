const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be"; // sitraka-prestataire.com

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
                        // Some endpoints might return empty body
                        resolve(data);
                    }
                } else {
                    // Start of error handling
                    console.log(`Error Status: ${res.statusCode}`);
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
        console.log("--- CHECKING BACKUP CONFIG ---");
        // Try to get backup config to see if it's local or provider
        // Assuming endpoint might be /backups/config or similar, inspecting commonly used ones
        // Actually /api/v1/backups usually returns the list, let's look for provider info in system info if possible
        // But first, let's try to trigger the backup for the app.

        console.log(`Triggering backup for App ID: ${targetAppId}`);
        const trigger = await apiRequest(`apps/${targetAppId}/backup`, 'POST');
        console.log("Trigger Result:", trigger);

        // It might take time.
        // Let's check the app status or tasks.

        console.log("Waiting 5s...");
        await new Promise(r => setTimeout(r, 5000));

        const tasks = await apiRequest('tasks');
        console.log("Recent Tasks:", JSON.stringify(tasks.tasks.slice(0, 3), null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

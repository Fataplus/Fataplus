const https = require('https');
const WebSocket = require('ws');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be";

function apiRequest(path, method = 'POST', body = null) {
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
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function tryWs(url, label) {
    return new Promise((resolve) => {
        console.log(`[${label}] Connecting to: ${url}`);
        const ws = new WebSocket(url);

        let success = false;

        ws.on('open', function open() {
            console.log(`[${label}] CONNECTED!`);
            success = true;
            ws.close();
            resolve(true);
        });

        ws.on('error', (err) => {
            console.log(`[${label}] Failed: ${err.message}`);
            resolve(false);
        });

        // Timeout
        setTimeout(() => {
            if (!success) {
                console.log(`[${label}] Timeout`);
                ws.terminate();
                resolve(false);
            }
        }, 5000);
    });
}

async function main() {
    console.log("Probing WS Endpoints...");

    try {
        const result = await apiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/ls", "-la", "/app/data"],
            tty: false
        });

        const execId = result.id;
        console.log("Exec ID:", execId);

        const base = `wss://${host}`;

        // Probe List
        const endpoints = [
            `/api/v1/apps/${targetAppId}/exec/${execId}/ws`,
            `/api/v1/apps/${targetAppId}/exec/${execId}/attach`,
            `/api/v1/exec/${execId}/ws`,
            `/api/v1/exec/${execId}/attach` // Some versions might be global
        ];

        for (const path of endpoints) {
            const url = `${base}${path}?access_token=${token}`;
            await tryWs(url, path);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

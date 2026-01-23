const https = require('https');
const { exec } = require('child_process');

const cloudronToken = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const cloudronHost = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be";

function cloudronApiRequest(path, method = 'POST', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: cloudronHost,
            path: '/api/v1/' + path,
            method: method,
            headers: {
                'Authorization': `Bearer ${cloudronToken}`,
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

function createWebhook() {
    return new Promise((resolve, reject) => {
        // Create a new token
        const req = https.request({
            hostname: 'webhook.site',
            path: '/token',
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function getWebhookRequests(uuid) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'webhook.site',
            path: `/token/${uuid}/requests?sorting=newest`,
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log("Starting Reflector IP Discovery...");

    try {
        // 1. Create Webhook
        console.log("Creating Webhook...");
        const hookData = await createWebhook();
        const uuid = hookData.uuid;
        console.log(`Webhook created: https://webhook.site/${uuid}`);

        // 2. Trigger Cloudron to ping Webhook
        console.log("Triggering Cloudron ping...");
        const cmd = `curl -v https://webhook.site/${uuid}`;

        await cloudronApiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/bash", "-c", cmd]
        });

        console.log("Ping sent. Waiting 10s for propagation...");
        await new Promise(r => setTimeout(r, 10000));

        // 3. Check Requests
        console.log("Checking Webhook logs...");
        const requests = await getWebhookRequests(uuid);

        if (requests && requests.data && requests.data.length > 0) {
            const req = requests.data[0];
            console.log("\n!!! IP DISCOVERED !!!");
            console.log(`Cloudron IP: ${req.ip}`);
            console.log(`User-Agent: ${req.headers['user-agent']}`);
            console.log("----------------------");
        } else {
            console.log("No requests received yet. Cloudron might be blocked entirely from Internet or Webhook.site.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

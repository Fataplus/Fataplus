const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const taskId = "9853";

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
                        resolve(data);
                    }
                } else {
                    resolve({ error: true, status: res.statusCode });
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function main() {
    console.log(`Polling Task ID: ${taskId}`);

    for (let i = 0; i < 20; i++) { // Try up to 20 times (every 3s = 60s)
        try {
            const task = await apiRequest(`tasks/${taskId}`);
            console.log(`Status: ${task.status} - ${task.message || ''}`);

            if (task.status === 'completed') {
                console.log("Task Completed!");
                process.exit(0);
            }
            if (task.status === 'error') {
                console.log("Task Failed:", task.error);
                process.exit(1);
            }

            await new Promise(r => setTimeout(r, 3000));
        } catch (e) {
            console.error("Poll Error:", e);
        }
    }
    console.log("Timeout waiting for task.");
}

main();

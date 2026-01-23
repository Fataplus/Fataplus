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
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    resolve({ error: true, status: res.statusCode, body: data });
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
        console.log("Attempting exec command...");
        // Command to test curl connectivity to O2Switch FTP
        // Note: We need to see the output. exec return id. We rely on the command *working* or blindly trusting. 
        // Better: Try to upload a meaningful file (date) and check if it appears on O2Switch.
        const cmd = "date > /tmp/connectivity_check.txt && curl -T /tmp/connectivity_check.txt ftp://raam.o2switch.net/ --user 'roxi8838:3aDb-cpH3-PpX+'";

        const result = await apiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/bash", "-c", cmd]
        });

        console.log("Exec Result:", JSON.stringify(result, null, 2));

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

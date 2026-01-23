const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be"; // sitraka-prestataire.com
const ftpUser = "roxi8838";
const ftpPass = "3aDb-cpH3-PpX+";
const ftpHost = "raam.o2switch.net";

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

async function main() {
    console.log("Checking tools in container...");

    // Check for curl and wget
    // Also try to hit the FTP server with a simple connection check (nc or curl)
    const cmd = `
        echo "Tools Check:" > /tmp/debug_log.txt
        which curl >> /tmp/debug_log.txt || echo "curl not found" >> /tmp/debug_log.txt
        which wget >> /tmp/debug_log.txt || echo "wget not found" >> /tmp/debug_log.txt
        
        echo "Connectivity Check:" >> /tmp/debug_log.txt
        curl -v ftp://${ftpHost} --user "${ftpUser}:${ftpPass}" 2>&1 | head -n 20 >> /tmp/debug_log.txt || echo "curl connection failed" >> /tmp/debug_log.txt
        
        # Try to cat the log to a public location we can read? 
        # Or just cat it here, but we can't see output of exec... 
        # We will try to write it to /app/data/public/debug.txt if possible
        
        mkdir -p /app/data/public
        cp /tmp/debug_log.txt /app/data/public/debug.txt
    `;

    try {
        const result = await apiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/bash", "-c", cmd]
        });
        console.log("Exec ID:", result.id);

        console.log("Waiting 10s for execution...");
        await new Promise(r => setTimeout(r, 10000));

        console.log("Attempting to read log from https://sitraka-prestataire.com/public/debug.txt");
        // We can't fetch it from here easily if it's not served, but user can check or we can try curl
    } catch (e) {
        console.error("Error:", e);
    }
}

main();

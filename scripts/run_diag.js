const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const targetAppId = "90ae632a-163a-4107-a1f3-3c02ec0463be"; // sitraka-prestataire.com (WP Managed)

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
    console.log("Running Network Diagnostics (v2)...");

    const publicPath = "/app/data/wp-content/uploads";

    // Commands to check IP and connectivity
    // Output to /app/data/wp-content/uploads/diag.txt so we can read it via HTTP
    const cmd = `
        mkdir -p ${publicPath}
        echo "--- DIAGNOSTICS START ---" > ${publicPath}/diag.txt
        echo "Time: $(date)" >> ${publicPath}/diag.txt
        
        echo "\\n[1] Public IP Check:" >> ${publicPath}/diag.txt
        curl --connect-timeout 5 -s ifconfig.me >> ${publicPath}/diag.txt || echo "Failed" >> ${publicPath}/diag.txt
        
        echo "\\n\\n[2] Google Connectivity:" >> ${publicPath}/diag.txt
        curl --connect-timeout 5 -I -s https://google.com | head -n 1 >> ${publicPath}/diag.txt || echo "Failed" >> ${publicPath}/diag.txt
        
        echo "\\n[3] Bridge Connectivity (O2Switch):" >> ${publicPath}/diag.txt
        # Added verbose output to see 406/403/500 errors
        curl --connect-timeout 10 -v -s http://roxi8838.odns.fr/bridge_upload.php >> ${publicPath}/diag.txt 2>&1 || echo "Failed" >> ${publicPath}/diag.txt
        
        echo "\\n--- DIAGNOSTICS END ---" >> ${publicPath}/diag.txt
    `;

    try {
        const result = await apiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/bash", "-c", cmd]
        });
        console.log("Exec ID:", result.id);

        console.log("Waiting 10s...");
        await new Promise(r => setTimeout(r, 10000));

        console.log("Check logs at: https://sitraka-prestataire.com/wp-content/uploads/diag.txt");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

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
    console.log("Running verbose debug probe (IPv4 Force + IP Exfil)...");

    const uploadUrl = "http://roxi8838.odns.fr/bridge_upload.php";
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    const publicPath = "/app/data/wp-content/uploads";

    const cmd = `
        mkdir -p ${publicPath}
        
        # Get IP
        MYIP=$(curl -4 -s ifconfig.me)
        echo "My IP is $MYIP" > ${publicPath}/debug_ip.txt
        
        echo "Debug Test $(date)" >> ${publicPath}/debug_ip.txt
        
        # Upload with IP in filename for exfiltration
        # Force IPv4
        curl -4 -v -L -c /tmp/cookies.txt -b /tmp/cookies.txt -A "${userAgent}" -F "file=@${publicPath}/debug_ip.txt;filename=debug_from_$MYIP.txt" ${uploadUrl}
    `;

    try {
        const result = await apiRequest(`apps/${targetAppId}/exec`, 'POST', {
            command: ["/bin/bash", "-c", cmd]
        });
        console.log("Exec ID:", result.id);

        console.log("Waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));

        console.log("Check O2Switch Dashboard or public_html/backupcloudron/ for 'debug_from_X.X.X.X.txt'");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

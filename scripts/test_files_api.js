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
        console.log("Listing /app/data via Files API...");
        // API path for files usually: /apps/{id}/files?path=...
        // Note: Encode the slash
        const path = encodeURIComponent('/app/data');
        const result = await apiRequest(`apps/${targetAppId}/files?path=${path}&directory=true`);

        if (result.error) {
            console.log("Files API Failed:", result);
        } else {
            console.log("Files found:", result.length || "Object");
            if (Array.isArray(result)) {
                result.slice(0, 10).forEach(f => console.log(`- ${f.name} (${f.size})`));
            } else {
                console.log(JSON.stringify(result, null, 2).substring(0, 500));
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();

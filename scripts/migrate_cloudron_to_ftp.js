const https = require('https');

const token = "95e12af77576a9ce270a384e3114d3f45d447146242edcd8bde19feccded7ec3";
const host = "my.sitraka-prestataire.com";
const ftpUser = "roxi8838";
const ftpPass = "3aDb-cpH3-PpX+";
const ftpHost = "raam.o2switch.net";

// Helper for API calls
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
            family: 4 // Force IPv4
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
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function getDumpCommand(app) {
    const addons = app.manifest.addons || {};
    const timestamp = Math.floor(Date.now() / 1000);
    const dumpFile = `/tmp/db_dump_${timestamp}.sql`;

    // Check Addons
    if (addons.mysql) {
        return `mysqldump -h "\${CLOUDRON_MYSQL_HOST}" -u "\${CLOUDRON_MYSQL_USERNAME}" -p"\${CLOUDRON_MYSQL_PASSWORD}" "\${CLOUDRON_MYSQL_DATABASE}" > ${dumpFile}`;
    } else if (addons.postgresql) {
        return `PGPASSWORD="\${CLOUDRON_POSTGRESQL_PASSWORD}" pg_dump -h "\${CLOUDRON_POSTGRESQL_HOST}" -p "\${CLOUDRON_POSTGRESQL_PORT}" -U "\${CLOUDRON_POSTGRESQL_USERNAME}" "\${CLOUDRON_POSTGRESQL_DATABASE}" > ${dumpFile}`;
    } else if (addons.mongodb) {
        return `mongodump --uri="\${CLOUDRON_MONGODB_URL}" --archive=${dumpFile}`;
    }

    return `echo "No DB Detected" > ${dumpFile}`;
}

async function startMigration() {
    console.log("Fetching Apps...");
    const appsRes = await apiRequest('apps');
    if (appsRes.error) {
        console.error("Failed to list apps:", appsRes);
        return;
    }

    const apps = appsRes.apps;
    console.log(`Found ${apps.length} apps.`);

    for (const app of apps) {
        console.log(`\nProcessing: ${app.manifest.title} (${app.fqdn})`);

        // 1. Construct Command
        const dumpCmd = getDumpCommand(app);
        const archiveName = `${app.fqdn}_migration.tar.gz`;
        const localArchive = `/tmp/${archiveName}`;

        // Use HTTP Bridge with Cookie Bypass for Tiger Protect
        const uploadUrl = "http://roxi8838.odns.fr/bridge_upload.php";
        const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

        const fullCmd = [
            `echo "Starting Migration for ${app.fqdn}..."`,
            dumpCmd,
            `tar -czf ${localArchive} -C /app/data . -C /tmp $(basename ${dumpCmd.split('>')[1].trim()})`,
            `curl --connect-timeout 600 -L -c /tmp/cookies.txt -b /tmp/cookies.txt -A "${userAgent}" -F "file=@${localArchive};filename=${archiveName}" ${uploadUrl}`,
            `rm ${localArchive}`,
            `rm ${dumpCmd.split('>')[1].trim()}`,
            `echo "Complete"`
        ].join(" && ");

        // 2. Execute
        console.log("Sending Exec Command...");

        try {
            const execRes = await apiRequest(`apps/${app.id}/exec`, 'POST', {
                command: ["/bin/bash", "-c", fullCmd]
            });
            console.log(`Exec Started. ID: ${execRes.id}`);
            console.log("Waiting 30 seconds before next app to prevent saturation...");
            await new Promise(r => setTimeout(r, 30000));

        } catch (e) {
            console.error(`Failed to process ${app.fqdn}:`, e);
        }
    }

    console.log("\nAll commands issued. Please check O2Switch FTP '/backupcloudron' folder or via Bridge URL.");
}

startMigration();

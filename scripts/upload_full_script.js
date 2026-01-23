const fs = require('fs');
const { exec } = require('child_process');

const uploadUrl = "http://roxi8838.odns.fr/bridge_upload.php";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
const fileToUpload = "scripts/full_migration.sh";

console.log(`Uploading ${fileToUpload} to Bridge...`);

const cmd = `curl -v -L -c /tmp/cookies.txt -b /tmp/cookies.txt -A "${userAgent}" -F "file=@${fileToUpload};filename=full_migration.sh" ${uploadUrl}`;

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log("File should be at: http://roxi8838.odns.fr/backupcloudron/full_migration.sh");
});

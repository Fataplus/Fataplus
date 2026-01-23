const fs = require('fs');
const { exec } = require('child_process');

const uploadUrl = "http://roxi8838.odns.fr/bridge_upload.php";
// Matches the User-Agent in migrate_cloudron_to_ftp.js
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

console.log("Creating dummy file...");
fs.writeFileSync('agent_test_upload.txt', 'This is a test upload from the Agent to verification Bridge logic.');

console.log("Uploading to:", uploadUrl);

// Construct curl command with WAF bypass
const cmd = `curl -v -L -c /tmp/cookies.txt -b /tmp/cookies.txt -A "${userAgent}" -F "file=@agent_test_upload.txt;filename=agent_test_upload.txt" ${uploadUrl}`;

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

const fs = require('fs');
const path = require('path');
const http = require('http');

const filePath = path.join(__dirname, 'verify_backup_content.php');
const fileName = 'verify_backup_content.php';
const bridgeUrl = 'http://roxi8838.odns.fr/bridge_upload.php';

console.log(`Uploading ${fileName} to ${bridgeUrl}...`);

const fileStream = fs.createReadStream(filePath);
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const postDataStart = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
    'Content-Type: application/x-php',
    '',
    ''
].join('\r\n');

const postDataEnd = `\r\n--${boundary}--`;

const options = {
    hostname: 'roxi8838.odns.fr',
    port: 80,
    path: '/bridge_upload.php',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Connection': 'keep-alive'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(postDataStart);
fileStream.pipe(req, { end: false });
fileStream.on('end', () => {
    req.write(postDataEnd);
    req.end();
});

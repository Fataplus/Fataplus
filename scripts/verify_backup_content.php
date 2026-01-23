<?php
// verify_backup_content.php
// Place this in public_html/backupcloudron/ and visit in browser

// Extensive Search Paths
$searchPaths = [
    '*.tar.gz',
    '../*.tar.gz',
    '../migration/*.tar.gz',
    '../../migration/*.tar.gz',
    '../../roxi8838.odns.fr/migration/*.tar.gz',
    '/home/roxi8838/roxi8838.odns.fr/migration/*.tar.gz'
];

$files = [];
foreach ($searchPaths as $pattern) {
    foreach (glob($pattern) as $f) {
        if (strpos($f, 'cloudron_full_backup') !== false) {
            $files[] = $f;
        }
    }
}

if (empty($files)) {
    echo "<h1>Backup Content Inspector</h1>";
    echo "<p style='color:red'>Error: No cloudron_full_backup*.tar.gz file found.</p>";
    exit;
}

$backupFile = $files[0];

// Command: Filter for 'vmail' (Cloudron Mail Storage)
// 2>&1 redirects errors to output
$cmd = "tar -tzf " . escapeshellarg($backupFile) . " 2>&1 | grep 'vmail' | head -n 20";

echo "<h1>Backup Content Inspector</h1>";
echo "<p>Inspecting: <b>$backupFile</b><br>(" . round(filesize($backupFile) / 1024 / 1024 / 1024, 2) . " GB)</p>";
echo "<p>Searching for: <b>vmail (Email Storage)</b></p>";
echo "<pre style='background:#eee; padding:10px; border:1px solid #ccc'>";
echo "Running: tar -tzf ... | grep 'vmail' ...\n\n";
flush();

// Execute
$handle = popen($cmd, 'r');
while (!feof($handle)) {
    $buffer = fgets($handle);
    echo $buffer;
    flush();
}
pclose($handle);

echo "</pre>";
?>
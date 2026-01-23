<?php
// bridge_upload.php - Enhanced with Progress Dashboard
$target_dir = "backupcloudron/";
$status_file = "migration_status.json";

// Initialize Dir
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0755, true);
}

// --- API HANDLING ---

// 1. Initialize / Reset Migration
if (isset($_POST['action']) && $_POST['action'] === 'init') {
    $data = [
        'total_apps' => (int) $_POST['count'],
        'started_at' => time(),
        'apps' => [], // { name: 'app.com', status: 'pending'|'done', size: 0 }
        'log' => []
    ];
    file_put_contents($status_file, json_encode($data));
    echo json_encode(['status' => 'initialized']);
    exit;
}

// 2. Handle File Upload (The standard migration push)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {

    // Load current status
    $data = file_exists($status_file) ? json_decode(file_get_contents($status_file), true) : ['apps' => [], 'log' => []];

    $filename = basename($_FILES['file']['name']);
    $path = $target_dir . $filename;

    // Extract App Name (e.g. crm.apollonlab.com_migration.tar.gz -> crm.apollonlab.com)
    $appName = str_replace('_migration.tar.gz', '', $filename);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
        $size = filesize($path);

        // Update Status
        $data['apps'][$appName] = [
            'status' => 'done',
            'time' => time(),
            'size' => $size
        ];
        $data['log'][] = "Received $filename (" . round($size / 1024 / 1024, 2) . " MB)";

        file_put_contents($status_file, json_encode($data));
        echo "Success";
    } else {
        http_response_code(500);
        $data['log'][] = "Failed to write $filename";
        file_put_contents($status_file, json_encode($data));
        echo "Error";
    }
    exit;
}

// --- API HANDLING ---
function getDiskFiles($dir)
{
    $files = [];
    if (is_dir($dir)) {
        foreach (scandir($dir) as $file) {
            if ($file !== '.' && $file !== '..') {
                $path = $dir . $file;
                $files[$file] = [
                    'size' => file_exists($path) ? filesize($path) : 0,
                    'time' => file_exists($path) ? filemtime($path) : 0,
                    'source' => 'disk'
                ];
            }
        }
    }
    return $files;
}


// API: List contents of the backup tarball
if (isset($_GET['api']) && $_GET['api'] === 'tar_list') {
    $files = getDiskFiles($target_dir);
    $backupFile = '';
    foreach ($files as $name => $info) {
        // Look for the large tarball
        if (strpos($name, 'cloudron_full_backup') !== false) {
            $backupFile = $target_dir . $name;
            break;
        }
    }

    if ($backupFile && file_exists($backupFile)) {
        // Run tar -tzf and capture first 100 lines
        // redirect stderr to stdout
        $cmd = "tar -tzf " . escapeshellarg($backupFile) . " 2>&1 | head -n 100";
        $output = [];
        exec($cmd, $output);

        header('Content-Type: text/plain');
        echo "Inspecting: " . basename($backupFile) . "\n";
        echo "Command: $cmd\n";
        echo "---------------------------------------------------\n";
        echo implode("\n", $output);
    } else {
        // Fallback search
        echo "Error: Backup file not found in $target_dir.\n";
        echo "Files found: " . implode(", ", array_keys($files));
    }
    exit;
}

// 3. Serve Status JSON
if (isset($_GET['api']) && $_GET['api'] === 'status') {
    header('Content-Type: application/json');

    // Load JSON status
    $data = file_exists($status_file) ? json_decode(file_get_contents($status_file), true) : ['apps' => [], 'log' => []];

    // Merge Real-Time Disk (FTP Uploads)
    $diskFiles = getDiskFiles($target_dir);
    foreach ($diskFiles as $name => $info) {
        $data['apps'][$name] = $info;
    }

    echo json_encode($data);
    exit;
}

// --- DASHBOARD UI (Frontend) ---
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudron Migration Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;600&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
            color: #e2e8f0;
        }

        .cyber-font {
            font-family: 'Orbitron', sans-serif;
        }

        .glass-panel {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .progress-bar {
            transition: width 0.5s ease-in-out;
        }

        .blink {
            animation: blinker 1.5s linear infinite;
        }

        @keyframes blinker {
            50% {
                opacity: 0;
            }
        }
    </style>
</head>

<body class="min-h-screen p-4 md:p-8">

    <div class="max-w-4xl mx-auto space-y-6">

        <!-- Header -->
        <header class="glass-panel p-6 rounded-2xl flex justify-between items-center shadow-2xl">
            <div>
                <h1 class="text-3xl font-bold cyber-font text-cyan-400">MIGRATION PROTOCOL</h1>
                <p class="text-slate-400 text-sm mt-1">Cloudron &rarr; O2Switch Data Pipeline</p>
            </div>
            <div id="status-badge"
                class="px-4 py-2 rounded-full bg-slate-800 text-cyan-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 blink"></span> Live
            </div>
        </header>

        <!-- Main Progress -->
        <div class="glass-panel p-8 rounded-2xl shadow-xl">
            <div class="flex justify-between items-end mb-4">
                <div>
                    <span class="text-6xl font-bold text-white tracking-tighter" id="progress-percent">0%</span>
                    <span class="text-slate-500 ml-2 text-lg">Completed</span>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-white" id="progress-count">0 / 22</div>
                    <div class="text-xs text-slate-500 uppercase tracking-widest">Applications Migrated</div>
                </div>
            </div>

            <div class="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div id="progress-fill"
                    class="h-full bg-gradient-to-r from-cyan-500 to-blue-600 progress-bar shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    style="width: 0%"></div>
            </div>
        </div>

        <!-- Detail Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Log Feed -->
            <div class="glass-panel p-6 rounded-2xl h-80 flex flex-col">
                <h3
                    class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                    System Log</h3>
                <div id="log-container" class="flex-1 overflow-y-auto font-mono text-xs space-y-2 text-slate-300 pr-2">
                    <div class="text-slate-600 italic">Initializing link...</div>
                </div>
            </div>

            <!-- App Grid -->
            <div class="glass-panel p-6 rounded-2xl h-80 flex flex-col">
                <h3
                    class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                    Artifacts</h3>
                <div id="apps-container" class="flex-1 overflow-y-auto space-y-2 pr-2">
                    <!-- Apps injected here -->
                </div>
            </div>

        </div>

    </div>

    <script>
        const statusUrl = '?api=status';

        async function updateDashboard() {
            try {
                const res = await fetch(statusUrl);
                const data = await res.json();

                // Calc Progress
                const total = data.total_apps || 22; // Default to 22 if not inited
                const done = Object.keys(data.apps || {}).length;
                const percent = Math.min(100, Math.round((done / total) * 100));

                // Update UI
                document.getElementById('progress-percent').innerText = percent + '%';
                document.getElementById('progress-count').innerText = `${done} / ${total}`;
                document.getElementById('progress-fill').style.width = percent + '%';

                // Update Logs
                const logHTML = (data.log || []).slice().reverse().map(l =>
                    `<div><span class="text-cyan-500 mr-2">➜</span>${l}</div>`
                ).join('');
                document.getElementById('log-container').innerHTML = logHTML || '<div class="text-slate-600 italic">Waiting...</div>';

                // Update Apps
                const appsHTML = Object.entries(data.apps || {}).map(([name, info]) => `
                <div class="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700/50">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-green-400"></div>
                        <span class="font-medium text-sm text-slate-200">${name}</span>
                    </div>
                    <span class="text-xs font-mono text-slate-500">${(info.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
            `).join('');
                document.getElementById('apps-container').innerHTML = appsHTML;

            } catch (e) {
                console.error(e);
            }
        }

        setInterval(updateDashboard, 2000);
        updateDashboard();
    </script>
</body>

</html>
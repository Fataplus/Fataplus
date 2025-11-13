#!/usr/bin/env bash
set -euo pipefail

# Default PORT
: "${PORT:=3000}"
export PORT

# Change to script dir
cd "$(dirname "$0")" || true

# If Node.js project
if [ -f package.json ]; then
  echo "Detected Node.js project"
  # Prefer npm start if present
  if grep -q "\"start\"" package.json; then
    echo "Running npm run start"
    exec npm run start --silent
  fi
  for f in server.js index.js app.js main.js src/index.js; do
    if [ -f "$f" ]; then
      echo "Running node $f"
      exec node "$f"
    fi
  done
fi

# If Python project
if [ -f requirements.txt ] || ls *.py >/dev/null 2>&1 || [ -f setup.py ]; then
  echo "Detected Python project"
  if command -v gunicorn >/dev/null 2>&1 && [ -f app.py ]; then
    echo "Running gunicorn on app:app"
    exec gunicorn -b 0.0.0.0:\"$PORT\" app:app
  fi
  if [ -f main.py ]; then
    echo "Running python3 main.py"
    exec python3 main.py
  fi
  if [ -f app.py ]; then
    echo "Running python3 app.py"
    exec python3 app.py
  fi
fi

# Fallback
echo "No standard start command found. Listing files for debugging:"
ls -la
echo "Sleeping to keep container running for debugging."
tail -f /dev/null
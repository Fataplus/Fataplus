#!/bin/bash

# This script helps set up PocketBase for development

# Check if PocketBase is installed
if ! command -v pocketbase &> /dev/null; then
    echo "PocketBase is not installed. Please install it first:"
    echo "Visit https://pocketbase.io/docs/ for installation instructions"
    exit 1
fi

# Create PocketBase directory if it doesn't exist
mkdir -p pocketbase/pb_data

# Start PocketBase in the background
echo "Starting PocketBase..."
cd pocketbase && pocketbase serve &
PB_PID=$!

# Wait for PocketBase to start
echo "Waiting for PocketBase to start..."
sleep 5

# Import the schema
echo "Importing schema..."
curl -X POST http://127.0.0.1:8090/api/collections/import -H "Content-Type: application/json" -d @pb_schema.json

echo "PocketBase setup complete!"
echo "PocketBase is running in the background with PID: $PB_PID"
echo "You can access the admin UI at http://127.0.0.1:8090/_/"
echo "To stop PocketBase, run: kill $PB_PID"

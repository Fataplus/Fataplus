#!/bin/bash

# This script helps set up PocketBase for production deployment

# Check if PocketBase is installed
if ! command -v pocketbase &> /dev/null; then
    echo "PocketBase is not installed. Please install it first:"
    echo "Visit https://pocketbase.io/docs/ for installation instructions"
    exit 1
fi

# Create PocketBase directory if it doesn't exist
mkdir -p pocketbase/pb_data

# Import the schema
echo "Importing schema to production PocketBase instance..."
echo "Please enter your admin email for the production PocketBase instance:"
read ADMIN_EMAIL

echo "Please enter your admin password:"
read -s ADMIN_PASSWORD

# Authenticate and import schema
curl -X POST https://backend.fata.plus/api/admins/auth-with-password \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  -c cookies.txt

# Import the schema
curl -X POST https://backend.fata.plus/api/collections/import \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d @pocketbase/pb_schema.json

# Clean up
rm cookies.txt

echo "PocketBase production setup complete!"
echo "Your production PocketBase instance is available at https://backend.fata.plus"
echo "Admin UI: https://backend.fata.plus/_/"

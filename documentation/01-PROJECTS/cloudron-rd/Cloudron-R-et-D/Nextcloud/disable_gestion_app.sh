#!/bin/bash
# Script to disable the gestion app and complete Nextcloud upgrade

echo "=== Nextcloud Gestion App Fix Script ==="
echo "This script will disable the problematic gestion app to allow upgrade completion"

# Navigate to your Nextcloud installation directory
# Adjust this path to match your actual Nextcloud installation
NEXTCLOUD_PATH="/path/to/your/nextcloud"

echo "1. Disabling gestion app..."
php $NEXTCLOUD_PATH/occ app:disable gestion

echo "2. Running upgrade process..."
php $NEXTCLOUD_PATH/occ upgrade

echo "3. Checking upgrade status..."
php $NEXTCLOUD_PATH/occ status

echo "4. Maintenance mode off..."
php $NEXTCLOUD_PATH/occ maintenance:mode --off

echo ""
echo "=== Upgrade Complete ==="
echo "The gestion app has been disabled. You can:"
echo "- Re-enable it later with: php occ app:enable gestion"
echo "- Check the app store for updates"
echo "- Or remove it completely if not needed"
echo ""
echo "Your Nextcloud should now be accessible!"

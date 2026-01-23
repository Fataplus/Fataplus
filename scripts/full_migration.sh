#!/bin/bash
# full_migration.sh
# Run this script as ROOT on the Cloudron Server (my.sitraka-prestataire.com)

BRIDGE_URL="http://roxi8838.odns.fr/bridge_upload.php"
USER_AGENT="Mozilla/5.0 (CloudronHostMigration)"

# Strategy:
# 1. Prefer /var/backups if populated.
# 2. Fallback to /home/yellowtent/appsdata (Raw Data)
# 3. Stream tarball to O2Switch Bridge.

echo "=== Cloudron Full Host Migration ==="
echo "Target Bridge: $BRIDGE_URL"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Check Backups
if [ -d "/var/backups" ] && [ "$(ls -A /var/backups)" ]; then
    echo "Found Cloudron Backups in /var/backups"
    SOURCE_DIR="/var/backups"
    FILENAME="cloudron_full_backup_$TIMESTAMP.tar.gz"
else
    echo "No standard backups found. Using RAW Application Data."
    # Backing up critical directories
    SOURCE_DIR="/home/yellowtent"
    FILENAME="cloudron_raw_yellowtent_$TIMESTAMP.tar.gz"
    echo "This might include running databases (Potential inconsistency). Ideally stop apps first."
    # docker stop $(docker ps -aq) # Too aggressive?
fi

echo "Source: $SOURCE_DIR"
echo "Destination Filename: $FILENAME"
echo "Starting Upload Stream..."

# Stream Tar -> Curl (FTP Upload - Unlimited Size)
# User: migration@roxi8838.odns.fr (Confirmed Unlimited)
FTP_URL="ftp://raam.o2switch.net/$FILENAME"
FTP_USER="migration@roxi8838.odns.fr:2026Fataplus!"

echo "Uploading to FTP: $FTP_URL"

tar czf - -C / "${SOURCE_DIR#/}" | curl -v --ftp-create-dirs -u "$FTP_USER" -T - "$FTP_URL"

echo "=== Migration Upload Complete ==="
echo "Check dashboard at $BRIDGE_URL"

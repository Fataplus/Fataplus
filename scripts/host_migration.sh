#!/bin/bash
# host_migration.sh
# Run this script as ROOT on the Cloudron Server (my.sitraka-prestataire.com)

APP_ID="90ae632a-163a-4107-a1f3-3c02ec0463be"
BRIDGE_URL="http://roxi8838.odns.fr/bridge_upload.php"
USER_AGENT="Mozilla/5.0 (CloudronHostname)"

echo "=== Cloudron Host-Side Migration Helper ==="
echo "Target App ID: $APP_ID"
echo "Target Bridge: $BRIDGE_URL"

# 1. Find Container ID
CONTAINER=$(docker ps --filter "label=io.cloudron.appId=$APP_ID" --format "{{.ID}}")

if [ -z "$CONTAINER" ]; then
    echo "Error: Could not find running container for App ID $APP_ID"
    exit 1
fi

echo "Found Container ID: $CONTAINER"

# 2. Prepare Backup Filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="sitraka_manual_migration_$TIMESTAMP.tar.gz"

echo "Preparing to dump and stream data..."
echo "This will create a tarball of /app/data and text-dump the database (if MySQL/Postgres)."

echo "Step 1: Dumping Database..."
# Dump MySQL if creds exist
docker exec $CONTAINER /bin/bash -c "if [ -n \"\$CLOUDRON_MYSQL_PASSWORD\" ]; then mysqldump -h \"\$CLOUDRON_MYSQL_HOST\" -u \"\$CLOUDRON_MYSQL_USERNAME\" -p\"\$CLOUDRON_MYSQL_PASSWORD\" --all-databases > /app/data/db_dump.sql; echo 'MySQL Dumped'; fi"
# Dump Postgres if creds exist
docker exec $CONTAINER /bin/bash -c "if [ -n \"\$CLOUDRON_POSTGRESQL_PASSWORD\" ]; then PGPASSWORD=\"\$CLOUDRON_POSTGRESQL_PASSWORD\" pg_dump -h \"\$CLOUDRON_POSTGRESQL_HOST\" -U \"\$CLOUDRON_POSTGRESQL_USERNAME\" -f /app/data/db_dump.sql \"\$CLOUDRON_POSTGRESQL_DATABASE\"; echo 'Postgres Dumped'; fi"

echo "Step 2: Streaming /app/data to O2Switch Bridge..."

# Stream tar of /app/data (which now includes db_dump.sql) -> Host Curl -> Bridge
# We use 'cat' on host to verify flow? No, pipe directly.
docker exec $CONTAINER tar czf - -C /app/data . | curl -v -L -A "$USER_AGENT" -F "file=@-;filename=$FILENAME" "$BRIDGE_URL"

echo "=== Migration Upload Complete ==="
echo "Check the dashboard at $BRIDGE_URL"

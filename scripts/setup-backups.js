// Script to set up automated backups for PocketBase
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create backup scripts
const createBackupScripts = async () => {
  try {
    // Create the scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'backup-scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    
    // Create the backup script
    const backupScriptPath = path.join(scriptsDir, 'backup.sh');
    
    const backupScriptContent = `#!/bin/bash

# PocketBase Backup Script
# This script creates a backup of the PocketBase database and uploads it to cloud storage

# Configuration
POCKETBASE_DIR="/path/to/pocketbase"
BACKUP_DIR="/path/to/backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="pocketbase_backup_$DATE.zip"
RETENTION_DAYS=30

# Cloud storage configuration (uncomment the one you want to use)
# AWS S3
# S3_BUCKET="your-backup-bucket"

# Google Cloud Storage
# GCS_BUCKET="your-backup-bucket"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Stop PocketBase (if running as a service)
# systemctl stop pocketbase

# Create backup
echo "Creating backup: $BACKUP_FILE"
cd $POCKETBASE_DIR
zip -r "$BACKUP_DIR/$BACKUP_FILE" pb_data

# Start PocketBase (if running as a service)
# systemctl start pocketbase

# Upload to cloud storage (uncomment the one you want to use)
# AWS S3
# echo "Uploading to S3..."
# aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/$BACKUP_FILE"

# Google Cloud Storage
# echo "Uploading to Google Cloud Storage..."
# gsutil cp "$BACKUP_DIR/$BACKUP_FILE" "gs://$GCS_BUCKET/$BACKUP_FILE"

# Delete old backups
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "pocketbase_backup_*" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully!"
`;
    
    fs.writeFileSync(backupScriptPath, backupScriptContent);
    console.log(`Backup script created at: ${backupScriptPath}`);
    
    // Make the script executable
    fs.chmodSync(backupScriptPath, '755');
    
    // Create the restore script
    const restoreScriptPath = path.join(scriptsDir, 'restore.sh');
    
    const restoreScriptContent = `#!/bin/bash

# PocketBase Restore Script
# This script restores a PocketBase database from a backup

# Configuration
POCKETBASE_DIR="/path/to/pocketbase"
BACKUP_DIR="/path/to/backups"

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
  exit 1
fi

# Stop PocketBase (if running as a service)
# systemctl stop pocketbase

# Backup current data (just in case)
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
CURRENT_BACKUP="pocketbase_pre_restore_$DATE.zip"
echo "Creating backup of current data: $CURRENT_BACKUP"
cd $POCKETBASE_DIR
zip -r "$BACKUP_DIR/$CURRENT_BACKUP" pb_data

# Remove current data
echo "Removing current data..."
rm -rf $POCKETBASE_DIR/pb_data

# Restore from backup
echo "Restoring from backup: $BACKUP_FILE"
unzip "$BACKUP_DIR/$BACKUP_FILE" -d $POCKETBASE_DIR

# Start PocketBase (if running as a service)
# systemctl start pocketbase

echo "Restore completed successfully!"
`;
    
    fs.writeFileSync(restoreScriptPath, restoreScriptContent);
    console.log(`Restore script created at: ${restoreScriptPath}`);
    
    // Make the script executable
    fs.chmodSync(restoreScriptPath, '755');
    
    // Create the cron job file
    const cronJobPath = path.join(scriptsDir, 'backup-cron');
    
    const cronJobContent = `# PocketBase Backup Cron Job
# Add this to your crontab with: crontab backup-cron

# Run backup daily at 2:00 AM
0 2 * * * /path/to/backup-scripts/backup.sh >> /path/to/backup-scripts/backup.log 2>&1
`;
    
    fs.writeFileSync(cronJobPath, cronJobContent);
    console.log(`Cron job file created at: ${cronJobPath}`);
    
    // Create the README file
    const readmePath = path.join(scriptsDir, 'README.md');
    
    const readmeContent = `# PocketBase Backup System

This directory contains scripts for backing up and restoring your PocketBase database.

## Setup

1. Edit the configuration in \`backup.sh\` and \`restore.sh\`:
   - Set \`POCKETBASE_DIR\` to the directory where PocketBase is installed
   - Set \`BACKUP_DIR\` to the directory where backups should be stored
   - Configure cloud storage settings if you want to upload backups

2. Make the scripts executable:
   \`\`\`
   chmod +x backup.sh restore.sh
   \`\`\`

3. Set up a cron job to run the backup script automatically:
   \`\`\`
   crontab backup-cron
   \`\`\`

## Usage

### Creating a Backup Manually

\`\`\`
./backup.sh
\`\`\`

This will create a backup in the configured backup directory and upload it to cloud storage if configured.

### Restoring from a Backup

\`\`\`
./restore.sh pocketbase_backup_2023-01-01_00-00-00.zip
\`\`\`

This will restore the PocketBase database from the specified backup file.

## Backup Strategy

- Daily backups are created at 2:00 AM
- Backups older than 30 days are automatically deleted
- Before each restore, a backup of the current data is created

## Cloud Storage

The backup script supports uploading to:
- AWS S3
- Google Cloud Storage

To use cloud storage, uncomment and configure the appropriate section in \`backup.sh\`.

## Requirements

- \`zip\` and \`unzip\` commands
- AWS CLI or Google Cloud SDK (if using cloud storage)
`;
    
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`README file created at: ${readmePath}`);
    
    console.log('\nBackup system setup completed!');
    console.log('\nNext steps:');
    console.log('1. Edit the configuration in the backup scripts');
    console.log('2. Set up a cron job to run the backup script automatically');
    console.log('3. Test the backup and restore process');
    
    rl.close();
  } catch (error) {
    console.error('Error creating backup scripts:', error);
    rl.close();
  }
};

// Main function
const setupBackupSystem = async () => {
  try {
    console.log('Setting up backup system for PocketBase...');
    
    // Create backup scripts
    await createBackupScripts();
  } catch (error) {
    console.error('Error setting up backup system:', error);
    rl.close();
  }
};

// Run the script
setupBackupSystem();

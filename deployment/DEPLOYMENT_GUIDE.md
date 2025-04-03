# FataPlus Advanced Data Management Deployment Guide

This guide will help you deploy the advanced data management features to your PocketBase backend.

## Prerequisites

- PocketBase server running at https://backend.fata.plus
- Admin access to the PocketBase server
- Node.js installed on the server (for running migration and archiving scripts)

## Deployment Steps

### 1. Data Validation Hooks

1. Copy the validation hooks to your PocketBase server:
   ```
   scp pb_hooks/validation-hooks.js your-username@backend.fata.plus:/path/to/pocketbase/pb_hooks/
   ```

2. Restart your PocketBase server to load the hooks:
   ```
   ssh your-username@backend.fata.plus "cd /path/to/pocketbase && ./pocketbase serve --restart"
   ```

3. Test the validation hooks by creating and updating records through the API.

### 2. Data Migration Tools

1. Create a directory for migrations on your server:
   ```
   ssh your-username@backend.fata.plus "mkdir -p /path/to/pocketbase/migrations"
   ```

2. Copy the migration tools to your server:
   ```
   scp -r data-migration/* your-username@backend.fata.plus:/path/to/pocketbase/migrations/
   ```

3. Install dependencies:
   ```
   ssh your-username@backend.fata.plus "cd /path/to/pocketbase/migrations && npm install pocketbase"
   ```

4. Create and run your first migration:
   ```
   ssh your-username@backend.fata.plus "cd /path/to/pocketbase/migrations && node migration-manager.js"
   ```

### 3. Data Archiving System

1. Create a directory for the archiving system on your server:
   ```
   ssh your-username@backend.fata.plus "mkdir -p /path/to/pocketbase/archiving"
   ```

2. Copy the archiving system to your server:
   ```
   scp -r data-archiving/* your-username@backend.fata.plus:/path/to/pocketbase/archiving/
   ```

3. Install dependencies:
   ```
   ssh your-username@backend.fata.plus "cd /path/to/pocketbase/archiving && npm install pocketbase"
   ```

4. Configure the archiving rules by editing the `archive-config.json` file.

5. Run the archiver:
   ```
   ssh your-username@backend.fata.plus "cd /path/to/pocketbase/archiving && node archiver.js"
   ```

6. Set up a cron job to run the archiver automatically:
   ```
   ssh your-username@backend.fata.plus "crontab -e"
   ```
   
   Add the following line to run the archiver monthly:
   ```
   0 2 1 * * cd /path/to/pocketbase/archiving && node archiver.js run admin@example.com password >> archiver.log 2>&1
   ```

## Alternative Manual Deployment

If you don't have SSH access to your server, you can deploy the features manually:

### 1. Data Validation Hooks

1. Download the `validation-hooks.js` file from the `pb_hooks` directory.
2. Upload it to your PocketBase server's `pb_hooks` directory using the admin UI or FTP.
3. Restart your PocketBase server.

### 2. Data Migration Tools

1. Download the files from the `data-migration` directory.
2. Set up the migration tools on your local machine.
3. Run migrations locally, connecting to your remote PocketBase instance.

### 3. Data Archiving System

1. Download the files from the `data-archiving` directory.
2. Set up the archiving system on your local machine.
3. Run the archiver locally, connecting to your remote PocketBase instance.

## Verification

After deploying the features, verify that they are working correctly:

### Data Validation Hooks

1. Try to create a user with an invalid email format. You should get a validation error.
2. Try to create a product with a negative price. You should get a validation error.
3. Try to create an order with an invalid status. You should get a validation error.

### Data Migration Tools

1. Create a simple migration that adds a field to a collection.
2. Run the migration and verify that the field was added.
3. Check the migration state to confirm that the migration was recorded.

### Data Archiving System

1. Configure the archiver to archive a small set of test data.
2. Run the archiver and verify that the data was archived.
3. Try restoring the archived data to confirm that the restore process works.

## Troubleshooting

### Data Validation Hooks

- If validation hooks are not working, check the PocketBase logs for errors.
- Make sure the `validation-hooks.js` file is in the correct directory.
- Restart the PocketBase server after making changes to the hooks.

### Data Migration Tools

- If migrations fail, check the error message for details.
- Make sure you have the correct permissions to modify the database.
- Check the migration state to see which migrations have been applied.

### Data Archiving System

- If archiving fails, check the error message for details.
- Make sure you have sufficient disk space for archives.
- Verify that the archiving rules are correctly configured.

## Support

If you encounter any issues with the deployment, please refer to the individual README files for each feature or contact the development team for assistance.

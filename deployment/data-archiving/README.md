# PocketBase Data Archiver

This tool helps you archive old or inactive data from your PocketBase database to separate storage, reducing database size and improving performance.

## Features

- Archive data based on configurable conditions
- Multiple retention policies (delete or mark as archived)
- Restore archived data when needed
- Configurable archiving schedule
- Support for local file storage (expandable to cloud storage)

## Installation

1. Install dependencies:
   ```
   npm install pocketbase
   ```

2. Make sure the archiver is executable:
   ```
   chmod +x archiver.js
   ```

## Configuration

The archiver uses a configuration file (`archive-config.json`) to determine what data to archive and how to handle it. The default configuration looks like this:

```json
{
  "collections": {
    "orders": {
      "enabled": true,
      "conditions": [
        {
          "field": "created",
          "operator": "<",
          "value": "-6 months",
          "valueType": "date"
        },
        {
          "field": "status",
          "operator": "in",
          "value": ["completed", "cancelled", "refunded"],
          "valueType": "array"
        }
      ],
      "retentionPolicy": {
        "type": "delete",
        "afterArchive": true
      }
    },
    "posts": {
      "enabled": true,
      "conditions": [
        {
          "field": "created",
          "operator": "<",
          "value": "-1 year",
          "valueType": "date"
        }
      ],
      "retentionPolicy": {
        "type": "mark",
        "field": "archived",
        "value": true,
        "afterArchive": true
      }
    }
  },
  "archiveFormat": "json",
  "compression": true,
  "schedule": {
    "frequency": "monthly",
    "dayOfMonth": 1,
    "timeOfDay": "02:00"
  },
  "storage": {
    "type": "local",
    "path": "./archives"
  }
}
```

### Configuration Options

#### Collections

Each collection to archive has its own configuration:

- `enabled`: Whether to archive this collection
- `conditions`: Array of conditions to determine which records to archive
  - `field`: The field to check
  - `operator`: Comparison operator (`=`, `!=`, `>`, `>=`, `<`, `<=`, `~`, `!~`, `in`, `!in`)
  - `value`: The value to compare against
  - `valueType`: Type of the value (`string`, `number`, `boolean`, `date`, `array`)
- `retentionPolicy`: What to do with archived records
  - `type`: `delete` or `mark`
  - `field`: Field to mark (for `mark` type)
  - `value`: Value to set (for `mark` type)
  - `afterArchive`: Whether to apply the policy after archiving

#### Archive Format

- `archiveFormat`: Format to use for archives (`json` or `csv`)
- `compression`: Whether to compress archives

#### Schedule

- `frequency`: How often to run archiving (`daily`, `weekly`, `monthly`)
- `dayOfMonth`: Day of month to run (for `monthly` frequency)
- `timeOfDay`: Time of day to run

#### Storage

- `type`: Storage type (`local` or `cloud`)
- `path`: Path to store archives (for `local` type)

## Usage

### Running the Archiver

```
node archiver.js
```

When prompted, select `run` and enter your PocketBase admin credentials. This will archive data according to your configuration.

Example:
```
What would you like to do? (run/restore/list/config): run
Enter admin email: admin@example.com
Enter admin password: ********
Authenticating...
Authentication successful!
Starting archiving process...
Archiving collection: orders
Filter: created<"2023-01-01T00:00:00.000Z" && status in "completed","cancelled","refunded"
Found 150 records to archive
Archived 150 records to archives/orders_20230615123456.json
Deleting 150 archived records
Deleted 150 records
Archiving collection: posts
Filter: created<"2022-06-15T12:34:56.789Z"
Found 75 records to archive
Archived 75 records to archives/posts_20230615123456.json
Marking 75 records as archived
Marked 75 records as archived
Archiving process completed. Total records archived: 225
```

### Restoring Archived Data

```
node archiver.js
```

When prompted, select `restore`. The tool will list available archives, and you can select one to restore.

Example:
```
What would you like to do? (run/restore/list/config): restore
Available archives:

orders:
1. orders_20230615123456.json (2.5 MB, 2023-06-15)

posts:
1. posts_20230615123456.json (1.2 MB, 2023-06-15)

Enter archive file name to restore: orders_20230615123456.json
Enter admin email: admin@example.com
Enter admin password: ********
Authenticating...
Authentication successful!
Restoring archive: orders_20230615123456.json
Restoring to collection: orders
Record 1234567890 doesn't exist, creating
Record 1234567891 doesn't exist, creating
...
Restored 150 records from orders_20230615123456.json
```

### Listing Archives

```
node archiver.js
```

When prompted, select `list`. This will show all available archives.

Example:
```
What would you like to do? (run/restore/list/config): list
Available archives:

orders:
1. orders_20230615123456.json (2.5 MB, 2023-06-15)
2. orders_20230715123456.json (3.1 MB, 2023-07-15)

posts:
1. posts_20230615123456.json (1.2 MB, 2023-06-15)
```

### Viewing/Resetting Configuration

```
node archiver.js
```

When prompted, select `config`. This will show the current configuration and allow you to reset it to the default.

Example:
```
What would you like to do? (run/restore/list/config): config
Current archive configuration:
{
  "collections": {
    "orders": {
      "enabled": true,
      ...
    },
    ...
  },
  ...
}
Would you like to reset to default configuration? (y/n): n
```

## Automating Archiving

To run the archiver automatically according to your schedule, you can set up a cron job:

```
# Run archiver monthly at 2:00 AM on the 1st day of the month
0 2 1 * * node /path/to/archiver.js run admin@example.com password >> /path/to/archiver.log 2>&1
```

## Best Practices

1. **Start with a small dataset**: Begin by archiving a small amount of data to test the process.

2. **Backup before archiving**: Always backup your database before running the archiver in production.

3. **Monitor disk space**: Archives can take up significant disk space, especially for large datasets.

4. **Secure your archives**: Ensure your archive storage is secure, as archives may contain sensitive data.

5. **Test restoration**: Regularly test restoring archives to ensure the process works correctly.

## Extending the Archiver

### Adding Cloud Storage Support

You can extend the archiver to support cloud storage by modifying the `archiveCollection` function to upload archives to your preferred cloud storage provider.

Example for AWS S3:

```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY'
  }
});

// Upload archive to S3
const uploadToS3 = async (filePath, bucketName, key) => {
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent
  };
  
  await s3Client.send(new PutObjectCommand(params));
  console.log(`Uploaded ${filePath} to S3: ${bucketName}/${key}`);
};
```

### Adding Compression Support

You can add compression support by using a library like `zlib` to compress archives before storing them.

Example:

```javascript
const zlib = require('zlib');

// Compress file
const compressFile = (filePath) => {
  const input = fs.readFileSync(filePath);
  const compressed = zlib.gzipSync(input);
  const compressedFilePath = `${filePath}.gz`;
  
  fs.writeFileSync(compressedFilePath, compressed);
  console.log(`Compressed ${filePath} to ${compressedFilePath}`);
  
  return compressedFilePath;
};
```

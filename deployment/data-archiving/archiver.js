// PocketBase Data Archiver
// This script archives old/inactive data to separate storage

import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const ARCHIVES_DIR = path.join(process.cwd(), 'archives');

// Ensure archives directory exists
if (!fs.existsSync(ARCHIVES_DIR)) {
  fs.mkdirSync(ARCHIVES_DIR, { recursive: true });
}

// Archive configuration file
const ARCHIVE_CONFIG_FILE = path.join(process.cwd(), 'archive-config.json');

// Default archive configuration
const DEFAULT_ARCHIVE_CONFIG = {
  collections: {
    orders: {
      enabled: true,
      conditions: [
        {
          field: 'created',
          operator: '<',
          value: '-6 months',
          valueType: 'date'
        },
        {
          field: 'status',
          operator: 'in',
          value: ['completed', 'cancelled', 'refunded'],
          valueType: 'array'
        }
      ],
      retentionPolicy: {
        type: 'delete',
        afterArchive: true
      }
    },
    posts: {
      enabled: true,
      conditions: [
        {
          field: 'created',
          operator: '<',
          value: '-1 year',
          valueType: 'date'
        }
      ],
      retentionPolicy: {
        type: 'mark',
        field: 'archived',
        value: true,
        afterArchive: true
      }
    },
    comments: {
      enabled: true,
      conditions: [
        {
          field: 'created',
          operator: '<',
          value: '-1 year',
          valueType: 'date'
        }
      ],
      retentionPolicy: {
        type: 'delete',
        afterArchive: true
      }
    }
  },
  archiveFormat: 'json',
  compression: true,
  schedule: {
    frequency: 'monthly',
    dayOfMonth: 1,
    timeOfDay: '02:00'
  },
  storage: {
    type: 'local',
    path: ARCHIVES_DIR
  }
};

// Initialize or load archive configuration
const initArchiveConfig = () => {
  if (fs.existsSync(ARCHIVE_CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(ARCHIVE_CONFIG_FILE, 'utf8'));
  } else {
    fs.writeFileSync(ARCHIVE_CONFIG_FILE, JSON.stringify(DEFAULT_ARCHIVE_CONFIG, null, 2));
    return DEFAULT_ARCHIVE_CONFIG;
  }
};

// Save archive configuration
const saveArchiveConfig = (config) => {
  fs.writeFileSync(ARCHIVE_CONFIG_FILE, JSON.stringify(config, null, 2));
};

// Process date value
const processDateValue = (value) => {
  if (value === 'now') {
    return new Date();
  }
  
  if (typeof value === 'string' && value.startsWith('-')) {
    const match = value.match(/^-(\d+)\s+(day|days|week|weeks|month|months|year|years)$/);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2];
      
      const date = new Date();
      
      switch (unit) {
        case 'day':
        case 'days':
          date.setDate(date.getDate() - amount);
          break;
        case 'week':
        case 'weeks':
          date.setDate(date.getDate() - (amount * 7));
          break;
        case 'month':
        case 'months':
          date.setMonth(date.getMonth() - amount);
          break;
        case 'year':
        case 'years':
          date.setFullYear(date.getFullYear() - amount);
          break;
      }
      
      return date;
    }
  }
  
  return new Date(value);
};

// Build filter string from conditions
const buildFilterString = (conditions) => {
  return conditions.map(condition => {
    let value = condition.value;
    
    // Process value based on type
    if (condition.valueType === 'date') {
      value = processDateValue(value).toISOString();
    } else if (condition.valueType === 'array') {
      value = `"${value.join('","')}"`;
    } else if (condition.valueType === 'string') {
      value = `"${value}"`;
    }
    
    return `${condition.field}${condition.operator}${value}`;
  }).join(' && ');
};

// Archive records from a collection
const archiveCollection = async (pb, collectionName, config) => {
  try {
    console.log(`Archiving collection: ${collectionName}`);
    
    // Build filter string
    const filterString = buildFilterString(config.conditions);
    console.log(`Filter: ${filterString}`);
    
    // Get records to archive
    const records = await pb.collection(collectionName).getFullList({
      filter: filterString
    });
    
    console.log(`Found ${records.length} records to archive`);
    
    if (records.length === 0) {
      console.log('No records to archive, skipping');
      return 0;
    }
    
    // Create archive file
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const archiveFileName = `${collectionName}_${timestamp}.json`;
    const archiveFilePath = path.join(ARCHIVES_DIR, archiveFileName);
    
    // Write records to archive file
    fs.writeFileSync(archiveFilePath, JSON.stringify(records, null, 2));
    console.log(`Archived ${records.length} records to ${archiveFilePath}`);
    
    // Apply retention policy
    if (config.retentionPolicy && config.retentionPolicy.afterArchive) {
      if (config.retentionPolicy.type === 'delete') {
        console.log(`Deleting ${records.length} archived records`);
        
        for (const record of records) {
          await pb.collection(collectionName).delete(record.id);
        }
        
        console.log(`Deleted ${records.length} records`);
      } else if (config.retentionPolicy.type === 'mark') {
        console.log(`Marking ${records.length} records as archived`);
        
        for (const record of records) {
          await pb.collection(collectionName).update(record.id, {
            [config.retentionPolicy.field]: config.retentionPolicy.value
          });
        }
        
        console.log(`Marked ${records.length} records as archived`);
      }
    }
    
    return records.length;
  } catch (error) {
    console.error(`Error archiving collection ${collectionName}:`, error);
    throw error;
  }
};

// Run archiving process
const runArchiving = async (pb, config) => {
  try {
    console.log('Starting archiving process...');
    
    let totalArchived = 0;
    
    // Process each enabled collection
    for (const [collectionName, collectionConfig] of Object.entries(config.collections)) {
      if (collectionConfig.enabled) {
        const archivedCount = await archiveCollection(pb, collectionName, collectionConfig);
        totalArchived += archivedCount;
      } else {
        console.log(`Skipping disabled collection: ${collectionName}`);
      }
    }
    
    console.log(`Archiving process completed. Total records archived: ${totalArchived}`);
    return totalArchived;
  } catch (error) {
    console.error('Error running archiving process:', error);
    throw error;
  }
};

// Restore archived data
const restoreArchive = async (pb, archiveFile) => {
  try {
    console.log(`Restoring archive: ${archiveFile}`);
    
    // Read archive file
    const archiveFilePath = path.join(ARCHIVES_DIR, archiveFile);
    const archiveData = JSON.parse(fs.readFileSync(archiveFilePath, 'utf8'));
    
    if (!Array.isArray(archiveData) || archiveData.length === 0) {
      console.log('Archive is empty or invalid, skipping');
      return 0;
    }
    
    // Determine collection name from file name
    const collectionName = archiveFile.split('_')[0];
    console.log(`Restoring to collection: ${collectionName}`);
    
    // Restore records
    let restoredCount = 0;
    
    for (const record of archiveData) {
      try {
        // Check if record exists
        try {
          await pb.collection(collectionName).getOne(record.id);
          console.log(`Record ${record.id} already exists, updating`);
          
          // Update existing record
          await pb.collection(collectionName).update(record.id, record);
        } catch (error) {
          // Record doesn't exist, create it
          console.log(`Record ${record.id} doesn't exist, creating`);
          await pb.collection(collectionName).create(record);
        }
        
        restoredCount++;
      } catch (error) {
        console.error(`Error restoring record ${record.id}:`, error);
      }
    }
    
    console.log(`Restored ${restoredCount} records from ${archiveFile}`);
    return restoredCount;
  } catch (error) {
    console.error(`Error restoring archive ${archiveFile}:`, error);
    throw error;
  }
};

// List archives
const listArchives = () => {
  try {
    const archives = fs.readdirSync(ARCHIVES_DIR)
      .filter(file => file.endsWith('.json'))
      .sort();
    
    if (archives.length === 0) {
      console.log('No archives found');
      return [];
    }
    
    console.log('Available archives:');
    
    const archivesByCollection = {};
    
    archives.forEach((archive, index) => {
      const collectionName = archive.split('_')[0];
      
      if (!archivesByCollection[collectionName]) {
        archivesByCollection[collectionName] = [];
      }
      
      archivesByCollection[collectionName].push(archive);
    });
    
    for (const [collectionName, collectionArchives] of Object.entries(archivesByCollection)) {
      console.log(`\n${collectionName}:`);
      
      collectionArchives.forEach((archive, index) => {
        const stats = fs.statSync(path.join(ARCHIVES_DIR, archive));
        const size = (stats.size / 1024 / 1024).toFixed(2);
        const date = new Date(stats.mtime).toISOString().split('T')[0];
        
        console.log(`${index + 1}. ${archive} (${size} MB, ${date})`);
      });
    }
    
    return archives;
  } catch (error) {
    console.error('Error listing archives:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  console.log('PocketBase Data Archiver');
  console.log('======================');
  
  // Load archive configuration
  const config = initArchiveConfig();
  
  rl.question('What would you like to do? (run/restore/list/config): ', async (action) => {
    try {
      switch (action.toLowerCase()) {
        case 'run':
          rl.question('Enter admin email: ', (email) => {
            rl.question('Enter admin password: ', async (password) => {
              try {
                // Initialize PocketBase
                const pb = new PocketBase(POCKETBASE_URL);
                
                // Authenticate as admin
                console.log('Authenticating...');
                const authData = await pb.admins.authWithPassword(email, password);
                console.log('Authentication successful!');
                
                // Run archiving process
                await runArchiving(pb, config);
                rl.close();
              } catch (error) {
                console.error('Error:', error);
                rl.close();
              }
            });
          });
          break;
          
        case 'restore':
          // List archives
          const archives = listArchives();
          
          if (archives.length === 0) {
            rl.close();
            return;
          }
          
          rl.question('Enter archive file name to restore: ', (archiveFile) => {
            if (!archives.includes(archiveFile)) {
              console.log(`Archive ${archiveFile} not found`);
              rl.close();
              return;
            }
            
            rl.question('Enter admin email: ', (email) => {
              rl.question('Enter admin password: ', async (password) => {
                try {
                  // Initialize PocketBase
                  const pb = new PocketBase(POCKETBASE_URL);
                  
                  // Authenticate as admin
                  console.log('Authenticating...');
                  const authData = await pb.admins.authWithPassword(email, password);
                  console.log('Authentication successful!');
                  
                  // Restore archive
                  await restoreArchive(pb, archiveFile);
                  rl.close();
                } catch (error) {
                  console.error('Error:', error);
                  rl.close();
                }
              });
            });
          });
          break;
          
        case 'list':
          listArchives();
          rl.close();
          break;
          
        case 'config':
          console.log('Current archive configuration:');
          console.log(JSON.stringify(config, null, 2));
          
          rl.question('Would you like to reset to default configuration? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
              saveArchiveConfig(DEFAULT_ARCHIVE_CONFIG);
              console.log('Configuration reset to default');
            }
            rl.close();
          });
          break;
          
        default:
          console.log('Invalid action. Please choose run, restore, list, or config.');
          rl.close();
      }
    } catch (error) {
      console.error('Error:', error);
      rl.close();
    }
  });
};

// Run the script
main();

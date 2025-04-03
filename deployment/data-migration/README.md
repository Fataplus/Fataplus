# PocketBase Migration Manager

This tool helps you manage schema evolution and data migrations for your PocketBase database.

## Features

- Create migration files with up/down methods
- Run pending migrations
- Rollback migrations
- Track migration state
- Versioned database schema

## Installation

1. Install dependencies:
   ```
   npm install pocketbase
   ```

2. Make sure the migration manager is executable:
   ```
   chmod +x migration-manager.js
   ```

## Usage

### Creating a Migration

```
node migration-manager.js
```

When prompted, select `create` and enter a name for your migration. This will create a new migration file in the `migrations` directory.

Example:
```
What would you like to do? (create/run/rollback/status): create
Enter migration name: add_user_preferences
Created migration file: migrations/20230615123456_add_user_preferences.js
```

### Writing Migrations

Each migration file contains two methods:

- `up(pb)`: Apply the migration
- `down(pb)`: Rollback the migration

Example migration:

```javascript
export async function up(pb) {
  // Get the users collection
  const usersCollection = await pb.collections.getOne('users');
  
  // Add preferences field to users collection
  usersCollection.schema.push({
    name: 'preferences',
    type: 'json',
    required: false
  });
  
  // Update the collection
  await pb.collections.update(usersCollection.id, usersCollection);
  
  // Initialize preferences for existing users
  const users = await pb.collection('users').getFullList();
  
  for (const user of users) {
    await pb.collection('users').update(user.id, {
      preferences: JSON.stringify({
        notifications: true,
        darkMode: false,
        language: 'en'
      })
    });
  }
}

export async function down(pb) {
  // Get the users collection
  const usersCollection = await pb.collections.getOne('users');
  
  // Remove preferences field from schema
  usersCollection.schema = usersCollection.schema.filter(field => field.name !== 'preferences');
  
  // Update the collection
  await pb.collections.update(usersCollection.id, usersCollection);
}
```

### Running Migrations

```
node migration-manager.js
```

When prompted, select `run` and enter your PocketBase admin credentials. This will run all pending migrations.

Example:
```
What would you like to do? (create/run/rollback/status): run
Enter admin email: admin@example.com
Enter admin password: ********
Authenticating...
Authentication successful!
Found 1 pending migrations.
Running migration: 20230615123456_add_user_preferences.js
Applying migration: Add User Preferences
Added preferences field to users collection
Initialized preferences for all users
Migration completed: 20230615123456_add_user_preferences.js
All migrations completed successfully.
```

### Rolling Back Migrations

```
node migration-manager.js
```

When prompted, select `rollback`, enter the number of migrations to rollback, and enter your PocketBase admin credentials.

Example:
```
What would you like to do? (create/run/rollback/status): rollback
Enter number of migrations to rollback: 1
Enter admin email: admin@example.com
Enter admin password: ********
Authenticating...
Authentication successful!
Rolling back 1 migrations.
Rolling back migration: 20230615123456_add_user_preferences.js
Rolling back migration: Add User Preferences
Removed preferences field from users collection
Rollback completed: 20230615123456_add_user_preferences.js
Rollback completed successfully.
```

### Checking Migration Status

```
node migration-manager.js
```

When prompted, select `status`. This will show the current migration status.

Example:
```
What would you like to do? (create/run/rollback/status): status
Migration Status:
- Version: 0.0.0
- Last Migration: 20230615123456_add_user_preferences.js
- Last Run: 2023-06-15T12:34:56.789Z
- Applied Migrations: 1

Applied Migrations:
1. 20230615123456_add_user_preferences.js

Pending Migrations:
1. 20230615234567_add_user_settings.js
```

## Best Practices

1. **Always test migrations**: Test migrations in a development environment before running them in production.

2. **Keep migrations small**: Each migration should do one thing and do it well.

3. **Make migrations idempotent**: Migrations should be able to run multiple times without causing errors.

4. **Include both up and down methods**: Always implement both the `up` and `down` methods for each migration.

5. **Backup before migrating**: Always backup your database before running migrations in production.

## Common Migration Types

### Adding a Field

```javascript
export async function up(pb) {
  const collection = await pb.collections.getOne('collection_name');
  collection.schema.push({
    name: 'new_field',
    type: 'text',
    required: false
  });
  await pb.collections.update(collection.id, collection);
}

export async function down(pb) {
  const collection = await pb.collections.getOne('collection_name');
  collection.schema = collection.schema.filter(field => field.name !== 'new_field');
  await pb.collections.update(collection.id, collection);
}
```

### Creating a Collection

```javascript
export async function up(pb) {
  await pb.collections.create({
    name: 'new_collection',
    type: 'base',
    schema: [
      {
        name: 'field1',
        type: 'text',
        required: true
      }
    ]
  });
}

export async function down(pb) {
  await pb.collections.delete('new_collection');
}
```

### Data Migration

```javascript
export async function up(pb) {
  const records = await pb.collection('old_collection').getFullList();
  for (const record of records) {
    await pb.collection('new_collection').create({
      field1: record.old_field
    });
  }
}

export async function down(pb) {
  await pb.collection('new_collection').getFullList().then(records => {
    return Promise.all(records.map(record => {
      return pb.collection('new_collection').delete(record.id);
    }));
  });
}
```

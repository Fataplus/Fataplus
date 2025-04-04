# PocketBase Data Validation Hooks

This system provides custom server-side validation hooks for PocketBase, ensuring data integrity and consistency beyond basic schema rules.

## Features

- Advanced validation rules for all collections
- Custom business logic for data operations
- Automatic data enrichment and normalization
- Event-based actions (e.g., sending emails on order creation)
- Protection against invalid data and malicious inputs

## Installation

1. Copy the `validation-hooks.js` file to the `pb_hooks` directory of your PocketBase instance.

2. Restart your PocketBase server to load the hooks.

## Validation Rules

### Users Collection

#### Before Create
- Email format validation
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- User type validation (must be farmer, seller, learner, or admin)
- Automatic initialization of user preferences

#### Before Update
- Email format validation (if changed)
- Password strength validation (if changed)
- User type validation (if changed)
- Preferences format validation (if changed)

### Products Collection

#### Before Create
- Required fields validation (name, price, seller, sellerName, location, category)
- Price validation (must be positive)
- Category validation (must be from predefined list)
- Automatic creation date setting

#### Before Update
- Price validation (if changed)
- Category validation (if changed)
- Automatic update date setting

### Orders Collection

#### Before Create
- Required fields validation
- Total amount validation (must be positive)
- Status validation (must be pending, processing, completed, cancelled, or refunded)
- Payment method validation
- Items format validation
- Total amount verification (must match sum of items)
- Shipping address format validation

#### Before Update
- Status validation (if changed)
- Status transition validation (e.g., completed orders can only be changed to refunded)
- Automatic status change date setting

#### After Create
- Automatic order confirmation email sending

### Posts Collection

#### Before Create
- Required fields validation (author, content, postType)
- Content length validation (10-5000 characters)
- Post type validation (must be general, question, or marketplace)
- Spam/inappropriate content filtering
- Automatic creation date setting

#### Before Update
- Content length validation (if changed)
- Spam/inappropriate content filtering (if changed)
- Post type validation (if changed)
- Automatic update date setting

## Extending the Hooks

You can extend the validation hooks by adding new functions or modifying existing ones in the `validation-hooks.js` file.

### Adding a New Collection

To add validation hooks for a new collection, create a new function following this pattern:

```javascript
function registerNewCollectionValidationHooks() {
  // Before create validation
  onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== 'new_collection') {
      return;
    }
    
    const record = e.record;
    
    // Your validation logic here
  });
  
  // Before update validation
  onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== 'new_collection') {
      return;
    }
    
    const record = e.record;
    
    // Your validation logic here
  });
  
  // After create hooks
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'new_collection') {
      return;
    }
    
    // Your after-create logic here
  });
}
```

Then, add a call to your new function in the `app.before` event handler:

```javascript
onEvent('app.before', () => {
  console.log('Initializing data validation hooks...');
  
  // Register validation hooks for collections
  registerUserValidationHooks();
  registerProductValidationHooks();
  registerOrderValidationHooks();
  registerPostValidationHooks();
  registerNewCollectionValidationHooks(); // Add your new function here
  
  console.log('Data validation hooks initialized');
});
```

### Adding Custom Validation Rules

You can add custom validation rules to existing collections by modifying their respective functions. For example, to add a new validation rule for users:

```javascript
// Inside registerUserValidationHooks function
onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== 'users') {
    return;
  }
  
  const record = e.record;
  
  // Existing validation rules...
  
  // New validation rule: username must be at least 3 characters
  if (record.username && record.username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
});
```

### Adding After-Event Hooks

You can add hooks that run after certain events, such as after a record is created, updated, or deleted. For example, to send a notification when a product is updated:

```javascript
// Inside registerProductValidationHooks function
onRecordAfterUpdateRequest((e) => {
  if (e.collection.name !== 'products') {
    return;
  }
  
  const record = e.record;
  
  // Send notification to seller
  try {
    const sellerId = record.get('seller');
    const seller = $app.dao().findRecordById('users', sellerId);
    
    if (seller) {
      // Send email notification
      $app.newMailClient().send(
        seller.get('email'),
        'Your product has been updated',
        `Your product "${record.get('name')}" has been updated.`,
        { html: false }
      );
    }
  } catch (error) {
    console.error('Error sending product update notification:', error);
  }
});
```

## Available Events

PocketBase provides several events you can hook into:

- `onRecordBeforeCreateRequest`: Before a record is created
- `onRecordAfterCreateRequest`: After a record is created
- `onRecordBeforeUpdateRequest`: Before a record is updated
- `onRecordAfterUpdateRequest`: After a record is updated
- `onRecordBeforeDeleteRequest`: Before a record is deleted
- `onRecordAfterDeleteRequest`: After a record is deleted
- `onRecordsListRequest`: When records are listed
- `onRecordViewRequest`: When a record is viewed
- `onModelBeforeCreate`: Before a model is created (lower level than record)
- `onModelAfterCreate`: After a model is created
- `onModelBeforeUpdate`: Before a model is updated
- `onModelAfterUpdate`: After a model is updated
- `onModelBeforeDelete`: Before a model is deleted
- `onModelAfterDelete`: After a model is deleted

## Best Practices

1. **Keep validation rules simple**: Complex validation rules can be hard to maintain and debug.

2. **Handle errors gracefully**: Always provide clear error messages that help users understand what went wrong.

3. **Test thoroughly**: Test your validation hooks with various inputs to ensure they work as expected.

4. **Log validation failures**: Log validation failures to help diagnose issues.

5. **Use try-catch blocks**: Wrap your code in try-catch blocks to prevent hooks from crashing.

6. **Be careful with after-event hooks**: After-event hooks should not throw errors, as they can't prevent the operation from completing.

7. **Avoid heavy processing**: Validation hooks should be fast to avoid slowing down the API.

## Troubleshooting

If you encounter issues with your validation hooks, check the PocketBase logs for error messages. Common issues include:

- **Syntax errors**: Make sure your JavaScript syntax is correct.
- **Missing fields**: Make sure you're checking if fields exist before accessing them.
- **Infinite loops**: Be careful not to create infinite loops by triggering the same event from within a hook.
- **Performance issues**: If your hooks are slow, consider optimizing them or moving heavy processing to background tasks.

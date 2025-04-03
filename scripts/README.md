# PocketBase Collection Creator

This tool automatically creates collections in your PocketBase database without having to add them one by one through the admin UI.

## Prerequisites

- Node.js 14 or higher
- PocketBase admin credentials

## Installation

1. Navigate to the scripts directory:
   ```
   cd scripts
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Using the PocketBase SDK

This method uses the official PocketBase JavaScript SDK to create collections:

```
npm run create
```

### Using the REST API

This method uses direct REST API calls to create collections, which might be more reliable in some cases:

```
npm run create-api
```

## What the Script Does

1. Authenticates with your PocketBase instance using admin credentials
2. Updates the users collection with custom fields (name, avatar, location, userType, plan)
3. Creates the following collections if they don't already exist:
   - products
   - courses
   - userCourses
   - posts
   - comments
   - likes
   - cartItems
4. Optionally creates a test admin user

## Collection Schema

The script creates collections with the following schema:

### Products
- name (text, required)
- price (number, required, min: 0)
- description (text)
- seller (relation to users, required)
- sellerName (text, required)
- location (text, required)
- imageUrl (file)
- category (text, required)

### Courses
- title (text, required)
- description (text, required)
- lessons (number, required, min: 1)
- imageUrl (file)
- category (text, required)

### UserCourses
- user (relation to users, required)
- course (relation to courses, required)
- completedLessons (number, required, default: 0, min: 0)

### Posts
- author (relation to users, required)
- content (text, required)
- imageUrl (file)
- postType (select: general, question, marketplace, required, default: general)

### Comments
- post (relation to posts, required, cascadeDelete: true)
- author (relation to users, required)
- content (text, required)

### Likes
- post (relation to posts, required, cascadeDelete: true)
- user (relation to users, required)

### CartItems
- user (relation to users, required)
- product (relation to products, required, cascadeDelete: true)
- quantity (number, required, default: 1, min: 1)

## Customization

You can modify the collection configurations in the script files:
- `create-collections.js` - For the SDK method
- `create-collections-api.js` - For the REST API method

## Troubleshooting

If you encounter any issues:

1. Make sure your PocketBase instance is running and accessible
2. Verify that you're using the correct admin credentials
3. Check if the collections already exist in your database
4. Look for detailed error messages in the console output

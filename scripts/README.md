# PocketBase Setup for FataPlus

This tool automatically creates collections in your PocketBase database without having to add them one by one through the admin UI.

## Prerequisites

- Node.js 14 or higher
- PocketBase admin credentials (email: fenohery@fata.plus, password: 2025Fefe!)

## Installation

1. Navigate to the scripts directory:
   ```
   cd scripts
   ```

2. Install dependencies:
   ```
   npm install node-fetch
   ```

## Usage

### 1. Create Collections

Run the schema setup script to create all the necessary collections:

```bash
node pocketbase-schema.js
```

This script will create all the collections needed for the FataPlus application.

### 2. Seed Data

After creating the collections, you can populate them with sample data:

```bash
node pocketbase-seed.js
```

This will create:
- Categories for products
- Basic application settings

## What the Scripts Do

### pocketbase-schema.js
1. Authenticates with your PocketBase instance using admin credentials
2. Updates the users collection with custom fields (name, avatar, location, bio, role, isGuest)
3. Creates the following collections if they don't already exist:
   - products
   - orders
   - posts
   - comments
   - likes
   - notifications
   - categories
   - settings

### pocketbase-seed.js
1. Authenticates with your PocketBase instance using admin credentials
2. Seeds the categories collection with initial product categories
3. Seeds the settings collection with basic application settings

## Collection Schema

The script creates collections with the following schema:

### Users Collection
- name (text, required)
- avatar (file)
- location (text)
- bio (text)
- role (select: admin, farmer, buyer, seller)
- isGuest (boolean)

### Products Collection
- name (text, required)
- description (text, required)
- price (number, required)
- images (file, multiple)
- category (text, required)
- seller (relation to users, required)
- location (text)
- stock (number, required)
- isActive (boolean, required)

### Orders Collection
- user (relation to users, required)
- items (json, required)
- totalAmount (number, required)
- status (select: pending, processing, completed, cancelled, refunded)
- paymentMethod (text, required)
- shippingAddress (json, required)

### Posts Collection
- author (relation to users, required)
- content (text, required)
- imageUrl (file)
- postType (select: general, question, marketplace)
- likes (number)
- comments (number)

### Comments Collection
- post (relation to posts, required)
- author (relation to users, required)
- content (text, required)

### Likes Collection
- post (relation to posts, required)
- user (relation to users, required)

### Notifications Collection
- user (relation to users, required)
- type (select: post_like, post_comment, order_update, new_post, system)
- message (text, required)
- relatedId (text)
- isRead (boolean, required)

### Categories Collection
- name (text, required)
- description (text)
- icon (text)

### Settings Collection
- key (text, required)
- value (json, required)
- description (text)

## Customization

You can modify the collection configurations in the script files:
- `pocketbase-schema.js` - For creating the collections
- `pocketbase-seed.js` - For seeding initial data

## Troubleshooting

If you encounter any issues:

1. Make sure your PocketBase instance is running and accessible
2. Verify that you're using the correct admin credentials
3. Check if the collections already exist in your database
4. Look for detailed error messages in the console output

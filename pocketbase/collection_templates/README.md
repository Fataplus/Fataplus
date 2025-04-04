# PocketBase Collection Templates

This directory contains JSON templates for creating collections in PocketBase.

## How to Use

1. Log in to the PocketBase Admin UI at https://backend.fata.plus/_/
2. Go to Collections > New Collection
3. Click on "Import from JSON"
4. Copy and paste the content of the JSON file for the collection you want to create
5. Click "Create"

## Order of Creation

Create the collections in the following order to avoid relation field errors:

1. products.json
2. courses.json
3. posts.json
4. userCourses.json
5. comments.json
6. likes.json
7. cartItems.json

## Notes

- The "users" collection is already created by PocketBase as an auth collection
- Make sure to create the collections in the correct order to avoid relation field errors
- After creating all collections, you can start adding data to them

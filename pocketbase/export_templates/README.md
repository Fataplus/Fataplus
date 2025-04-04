# PocketBase Export-Compatible Collection Templates

These templates match the exact format of the export_compatible_schema.json file that worked for you. Each file contains a single collection definition in the export format.

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
4. userCourses.json (depends on courses)
5. comments.json (depends on posts)
6. likes.json (depends on posts)
7. cartItems.json (depends on products)

## Important Notes

- These templates follow the exact format of the export_compatible_schema.json file
- Each collection has the correct ID format and field definitions
- The relation fields reference the correct collection IDs
- Make sure to create the collections in the correct order to avoid relation field errors

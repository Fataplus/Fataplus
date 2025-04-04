#!/bin/bash

# This script helps set up Vercel for deployment

# Check if the Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if the user is logged in
if ! vercel whoami &> /dev/null; then
    echo "You need to log in to Vercel first:"
    echo "vercel login"
    exit 1
fi

# Link the project to Vercel
echo "Linking project to Vercel..."
vercel link

# Set up environment variables
echo "Setting up environment variables..."
echo "Please enter your Supabase URL (e.g., https://your-project-id.supabase.co):"
read SUPABASE_URL

echo "Please enter your Supabase Anon Key:"
read SUPABASE_ANON_KEY

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Get project information for GitHub Actions
echo "Getting project information for GitHub Actions..."
VERCEL_ORG_ID=$(vercel project ls --json | jq -r '.[0].orgId')
VERCEL_PROJECT_ID=$(vercel project ls --json | jq -r '.[0].id')

echo "Add these secrets to your GitHub repository for CI/CD:"
echo "VERCEL_TOKEN: <your-vercel-token>"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VITE_SUPABASE_URL: $SUPABASE_URL"
echo "VITE_SUPABASE_ANON_KEY: $SUPABASE_ANON_KEY"

echo "Vercel setup complete!"

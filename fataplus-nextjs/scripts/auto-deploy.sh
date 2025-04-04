#!/bin/bash

# Auto-deploy script for FataPlus
# This script automatically commits changes, pushes to GitHub, and deploys to Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting auto-deployment process for FataPlus...${NC}"

# 1. Check if there are any changes to commit
if [[ -z $(git status -s) ]]; then
  echo -e "${YELLOW}No changes to commit. Skipping deployment.${NC}"
  exit 0
fi

# 2. Add all changes to git
echo -e "${YELLOW}Adding changes to git...${NC}"
git add .

# 3. Commit changes with a timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo -e "${YELLOW}Committing changes with timestamp: $TIMESTAMP${NC}"
git commit -m "Auto-commit: $TIMESTAMP"

# 4. Push to GitHub
echo -e "${YELLOW}Pushing changes to GitHub...${NC}"
git push

# Check if push was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to push changes to GitHub. Aborting deployment.${NC}"
  exit 1
fi

echo -e "${GREEN}Successfully pushed changes to GitHub!${NC}"

# 5. Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

# Check if deployment was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to deploy to Vercel.${NC}"
  exit 1
fi

echo -e "${GREEN}Successfully deployed to Vercel!${NC}"
echo -e "${GREEN}Auto-deployment process completed successfully.${NC}"

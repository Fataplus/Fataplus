#!/bin/bash

# FataPlus Advanced Data Management Deployment Script
# This script helps deploy the advanced data management features to your PocketBase server

# Configuration
SERVER_HOST="backend.fata.plus"
SERVER_USER="your-username"
POCKETBASE_DIR="/path/to/pocketbase"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-password"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Function to prompt for configuration
configure() {
  read -p "Enter server hostname [${SERVER_HOST}]: " input
  SERVER_HOST=${input:-$SERVER_HOST}
  
  read -p "Enter server username [${SERVER_USER}]: " input
  SERVER_USER=${input:-$SERVER_USER}
  
  read -p "Enter PocketBase directory on server [${POCKETBASE_DIR}]: " input
  POCKETBASE_DIR=${input:-$POCKETBASE_DIR}
  
  read -p "Enter admin email [${ADMIN_EMAIL}]: " input
  ADMIN_EMAIL=${input:-$ADMIN_EMAIL}
  
  read -s -p "Enter admin password: " input
  echo
  ADMIN_PASSWORD=${input:-$ADMIN_PASSWORD}
  
  # Save configuration
  echo "SERVER_HOST=\"${SERVER_HOST}\"" > config.sh
  echo "SERVER_USER=\"${SERVER_USER}\"" >> config.sh
  echo "POCKETBASE_DIR=\"${POCKETBASE_DIR}\"" >> config.sh
  echo "ADMIN_EMAIL=\"${ADMIN_EMAIL}\"" >> config.sh
  echo "ADMIN_PASSWORD=\"${ADMIN_PASSWORD}\"" >> config.sh
  
  print_message "Configuration saved to config.sh"
}

# Function to deploy validation hooks
deploy_validation_hooks() {
  print_message "Deploying validation hooks..."
  
  # Create pb_hooks directory if it doesn't exist
  ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${POCKETBASE_DIR}/pb_hooks"
  
  # Copy validation hooks
  scp pb_hooks/validation-hooks.js ${SERVER_USER}@${SERVER_HOST}:${POCKETBASE_DIR}/pb_hooks/
  
  # Restart PocketBase
  ssh ${SERVER_USER}@${SERVER_HOST} "cd ${POCKETBASE_DIR} && ./pocketbase serve --restart"
  
  print_message "Validation hooks deployed successfully!"
}

# Function to deploy migration tools
deploy_migration_tools() {
  print_message "Deploying migration tools..."
  
  # Create migrations directory if it doesn't exist
  ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${POCKETBASE_DIR}/migrations"
  
  # Copy migration tools
  scp -r data-migration/* ${SERVER_USER}@${SERVER_HOST}:${POCKETBASE_DIR}/migrations/
  
  # Install dependencies
  ssh ${SERVER_USER}@${SERVER_HOST} "cd ${POCKETBASE_DIR}/migrations && npm install pocketbase"
  
  print_message "Migration tools deployed successfully!"
}

# Function to deploy archiving system
deploy_archiving_system() {
  print_message "Deploying archiving system..."
  
  # Create archiving directory if it doesn't exist
  ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${POCKETBASE_DIR}/archiving"
  
  # Copy archiving system
  scp -r data-archiving/* ${SERVER_USER}@${SERVER_HOST}:${POCKETBASE_DIR}/archiving/
  
  # Install dependencies
  ssh ${SERVER_USER}@${SERVER_HOST} "cd ${POCKETBASE_DIR}/archiving && npm install pocketbase"
  
  print_message "Archiving system deployed successfully!"
}

# Function to set up cron job for archiving
setup_archiving_cron() {
  print_message "Setting up cron job for archiving..."
  
  # Create cron job file
  echo "0 2 1 * * cd ${POCKETBASE_DIR}/archiving && node archiver.js run ${ADMIN_EMAIL} ${ADMIN_PASSWORD} >> archiver.log 2>&1" > archiving-cron
  
  # Copy cron job file to server
  scp archiving-cron ${SERVER_USER}@${SERVER_HOST}:/tmp/
  
  # Install cron job
  ssh ${SERVER_USER}@${SERVER_HOST} "crontab -l > /tmp/current-crontab || true"
  ssh ${SERVER_USER}@${SERVER_HOST} "cat /tmp/archiving-cron >> /tmp/current-crontab"
  ssh ${SERVER_USER}@${SERVER_HOST} "crontab /tmp/current-crontab"
  ssh ${SERVER_USER}@${SERVER_HOST} "rm /tmp/archiving-cron /tmp/current-crontab"
  
  # Remove local cron job file
  rm archiving-cron
  
  print_message "Cron job for archiving set up successfully!"
}

# Function to verify deployment
verify_deployment() {
  print_message "Verifying deployment..."
  
  # Check if validation hooks are installed
  ssh ${SERVER_USER}@${SERVER_HOST} "if [ -f ${POCKETBASE_DIR}/pb_hooks/validation-hooks.js ]; then echo 'Validation hooks: OK'; else echo 'Validation hooks: MISSING'; fi"
  
  # Check if migration tools are installed
  ssh ${SERVER_USER}@${SERVER_HOST} "if [ -f ${POCKETBASE_DIR}/migrations/migration-manager.js ]; then echo 'Migration tools: OK'; else echo 'Migration tools: MISSING'; fi"
  
  # Check if archiving system is installed
  ssh ${SERVER_USER}@${SERVER_HOST} "if [ -f ${POCKETBASE_DIR}/archiving/archiver.js ]; then echo 'Archiving system: OK'; else echo 'Archiving system: MISSING'; fi"
  
  # Check if cron job is installed
  ssh ${SERVER_USER}@${SERVER_HOST} "if crontab -l | grep -q 'archiver.js'; then echo 'Archiving cron job: OK'; else echo 'Archiving cron job: MISSING'; fi"
  
  print_message "Deployment verification completed!"
}

# Main function
main() {
  # Check if configuration exists
  if [ -f config.sh ]; then
    source config.sh
  else
    print_warning "Configuration not found. Please configure the deployment."
    configure
  fi
  
  # Display menu
  echo "FataPlus Advanced Data Management Deployment"
  echo "============================================"
  echo "1. Configure deployment"
  echo "2. Deploy validation hooks"
  echo "3. Deploy migration tools"
  echo "4. Deploy archiving system"
  echo "5. Set up archiving cron job"
  echo "6. Deploy all components"
  echo "7. Verify deployment"
  echo "8. Exit"
  echo
  
  read -p "Enter your choice [1-8]: " choice
  
  case $choice in
    1)
      configure
      main
      ;;
    2)
      deploy_validation_hooks
      main
      ;;
    3)
      deploy_migration_tools
      main
      ;;
    4)
      deploy_archiving_system
      main
      ;;
    5)
      setup_archiving_cron
      main
      ;;
    6)
      deploy_validation_hooks
      deploy_migration_tools
      deploy_archiving_system
      setup_archiving_cron
      verify_deployment
      main
      ;;
    7)
      verify_deployment
      main
      ;;
    8)
      print_message "Exiting deployment script."
      exit 0
      ;;
    *)
      print_error "Invalid choice. Please try again."
      main
      ;;
  esac
}

# Run the main function
main

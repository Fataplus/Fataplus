#!/bin/bash

# FastGPT Cloudron Deployment Script

echo "FastGPT Cloudron Deployment"
echo "=========================="

# Check if Cloudron CLI is installed
if ! command -v cloudron &> /dev/null
then
    echo "Cloudron CLI could not be found. Please install it first:"
    echo "npm install -g cloudron"
    exit 1
fi

# Login to Cloudron
echo "Logging in to Cloudron..."
cloudron login my.fata.plus

# Build the Docker image
echo "Building Docker image..."
cloudron build

# Install the app
echo "Installing FastGPT on Cloudron..."
cloudron install --image fenoh3ry/fastgpt:latest

echo "Deployment completed!"
echo "You can now access FastGPT at your configured domain (agribot.space)"
echo "Default login credentials:"
echo "  Username: root"
echo "  Password: 1234"
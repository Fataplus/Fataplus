#!/bin/bash

# Script to migrate the existing FataPlus project to Turborepo

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

# Check if the turbo-fataplus directory exists
if [ ! -d "turbo-fataplus" ]; then
  print_error "turbo-fataplus directory not found. Please run the setup script first."
  exit 1
fi

# Create necessary directories
print_message "Creating necessary directories..."
mkdir -p turbo-fataplus/apps/web/src
mkdir -p turbo-fataplus/apps/web/public

# Copy source files to the web app
print_message "Copying source files to the web app..."
cp -r src/* turbo-fataplus/apps/web/src/
cp -r public/* turbo-fataplus/apps/web/public/

# Copy configuration files
print_message "Copying configuration files..."
cp vite.config.ts turbo-fataplus/apps/web/
cp tsconfig.json turbo-fataplus/apps/web/
cp tsconfig.node.json turbo-fataplus/apps/web/
cp .eslintrc.cjs turbo-fataplus/apps/web/
cp postcss.config.js turbo-fataplus/apps/web/
cp tailwind.config.js turbo-fataplus/apps/web/
cp index.html turbo-fataplus/apps/web/

# Copy environment files
print_message "Copying environment files..."
cp .env* turbo-fataplus/apps/web/ 2>/dev/null || :

# Create UI package components
print_message "Setting up UI package..."
mkdir -p turbo-fataplus/packages/ui/components

# Copy UI components
cp -r src/components/ui/* turbo-fataplus/packages/ui/components/

# Create tsconfig for packages
print_message "Creating tsconfig for packages..."
cat > turbo-fataplus/packages/ui/tsconfig.json << EOL
{
  "extends": "../../tsconfig.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
EOL

cat > turbo-fataplus/packages/utils/tsconfig.json << EOL
{
  "extends": "../../tsconfig.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
EOL

cat > turbo-fataplus/packages/types/tsconfig.json << EOL
{
  "extends": "../../tsconfig.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
EOL

# Create root tsconfig
print_message "Creating root tsconfig..."
cat > turbo-fataplus/tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
EOL

print_message "Migration setup complete!"
print_message "Next steps:"
print_message "1. Review the migrated files in the turbo-fataplus directory"
print_message "2. Install dependencies: cd turbo-fataplus && npm install"
print_message "3. Start the development server: npm run dev"
print_message "4. Once everything is working, you can replace the original project with the Turborepo version"

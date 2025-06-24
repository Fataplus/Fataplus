#!/bin/bash

# =============================================================================
# Fataplus Quick Setup Script
# =============================================================================
# This script helps new developers get started with Fataplus development

echo "🌱 Fataplus - Digital Agriculture Platform Setup"
echo "=============================================="

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -ge 18 ] && [ "$node_version" -le 20 ]; then
    echo "✅ Node.js version compatible: $(node -v)"
else
    echo "⚠️  Warning: Node.js $(node -v) detected. Recommended: Node 18 or 20"
    echo "   For better-sqlite3 compatibility, consider using Node 18 or 20"
fi

# Check if .env exists
echo "�� Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your actual values."
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
if npm install --legacy-peer-deps; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if development server can start
echo "🚀 Testing development server..."
if timeout 10s npm run dev >/dev/null 2>&1; then
    echo "✅ Development server can start successfully"
else
    echo "⚠️  Development server test skipped (might need manual start)"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "   1. Update .env file with your actual configuration values"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Visit http://localhost:3000 to see your application"
echo "   4. Check PROGRESS_REPORT.md for detailed development roadmap"
echo ""
echo "📚 Available commands:"
echo "   npm run dev         - Start development server"
echo "   npm run build       - Build for production"
echo "   npm run lint        - Check code quality"
echo "   npm run format      - Format code"
echo "   npm test            - Run tests (when available)"
echo ""
echo "🌱 Happy coding with Fataplus!"

#!/bin/bash

# StacksYield Pro Build Script
# Builds the frontend for production

set -e

echo "🏗️  Building StacksYield Pro for production..."

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Run build
echo "📦 Building..."
npm run build

# Check build success
if [ -d "dist" ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📁 Output directory: frontend/dist"
    echo ""
    echo "To preview the build:"
    echo "  npm run preview"
else
    echo "❌ Build failed"
    exit 1
fi

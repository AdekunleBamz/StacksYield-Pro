#!/bin/bash

# StacksYield Pro Development Server Script
# Starts the frontend development server

set -e

echo "🚀 Starting StacksYield Pro development server..."

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server
echo "🌐 Starting Vite dev server..."
npm run dev

#!/bin/bash

# StacksYield Pro Development Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up StacksYield Pro development environment..."

# Check for required tools
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

if ! command -v clarinet &> /dev/null; then
    echo "⚠️  Clarinet is not installed. Install it for smart contract development"
    echo "   Visit: https://github.com/hirosystems/clarinet"
fi

echo "✅ Prerequisites check complete"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Copy environment file if it doesn't exist
if [ ! -f frontend/.env ]; then
    if [ -f frontend/.env.example ]; then
        cp frontend/.env.example frontend/.env
        echo "✅ Created .env file from .env.example"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start development:"
echo "  1. cd frontend && npm run dev"
echo "  2. Open http://localhost:5173"
echo ""
echo "To run contract tests:"
echo "  clarinet test"

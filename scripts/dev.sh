#!/bin/bash

# StacksYield Pro Development Server Script
# Optimized for a focused terminal experience

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info() { echo -e "${CYAN}${BOLD}[DEV-SERVER]${NC} $1"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"; }

set -e

info "Waking up StacksYield Pro environment..."

# Navigate to frontend directory relatively
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/../frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    info "Dependencies missing. Initiating synchronization..."
    npm install
    success "Environment ready."
fi

# Start development server
echo -e "${GREEN}${BOLD}>>> Starting Vite Engine...${NC}"
npm run dev

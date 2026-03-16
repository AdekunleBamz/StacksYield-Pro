#!/bin/bash

# StacksYield Pro Development Setup Script
# This script sets up the development environment with professional logging

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Logging functions
info() { echo -e "${CYAN}${BOLD}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"; }
error() { echo -e "${RED}${BOLD}[ERROR]${NC} $1"; exit 1; }

# ASCII Art Banner
echo -e "${CYAN}"
echo "   _____ _             _      __     __ _      _     _   _____                "
echo "  / ____| |           | |     \ \   / /(_)    | |   | | |  __ \               "
echo " | (___ | |_ __ _  ___| | _____ \_/ /  _  ___| | __| | | |__) | __ ___       "
echo "  \___ \| __/ _\` |/ __| |/ / __|\   /  | |/ _ \ |/ _\` | |  ___/ '__/ _ \      "
echo "  ____) | || (_| | (__|   <\__ \ | |   | |  __/ | (_| | | |   | | | (_) |     "
echo " |_____/ \__\__,_|\___|_|\_\___/ |_|   |_|\___|_|\__,_| |_|   |_|  \___/      "
echo -e "${NC}"
echo -e "${BOLD}Premium Yield Aggregator Development Suite${NC}"
echo "--------------------------------------------------"

set -e

info "Checking system prerequisites..."

if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18+ to proceed."
fi

if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install npm to proceed."
fi

if ! command -v clarinet &> /dev/null; then
    warn "Clarinet is not detected. Smart contract development will be restricted."
    echo "      Visit: https://github.com/hirosystems/clarinet"
else
    success "Clarinet found: $(clarinet --version)"
fi

# Install frontend dependencies
info "Initializing frontend environment..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
    cd ..
    success "Frontend dependencies synchronized."
else
    error "Frontend directory not found. Please run this script from the project root."
fi

# Copy environment file if it doesn't exist
if [ ! -f frontend/.env ]; then
    if [ -f frontend/.env.example ]; then
        cp frontend/.env.example frontend/.env
        success "Configuration: Created .env from template."
    else
        warn "Configuration: No .env.example found. Manual setup may be required."
    fi
fi

echo -e "\n${GREEN}${BOLD}✨ Setup validated and complete!${NC}\n"
info "To start development:"
echo -e "  1. ${BOLD}cd frontend && npm run dev${NC}"
echo -e "  2. Access: ${BOLD}http://localhost:5173${NC}"
echo ""
info "To run contract tests:"
echo -e "  ${BOLD}clarinet test${NC}"
echo "--------------------------------------------------"

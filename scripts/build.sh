#!/bin/bash

# StacksYield Pro Build Script
# Builds the frontend for production with detailed reporting

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

log_info() { echo -e "${BLUE}${BOLD}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}${BOLD}[ERROR]${NC} $1"; }

log_info "Starting StacksYield Pro production build..."
START_TIME=$(date +%s)

# Navigate to frontend directory
cd "$(dirname "$0")/../frontend"

# Clean previous build
if [ -d "dist" ]; then
    log_info "Cleaning previous build artifacts..."
    rm -rf dist
    log_success "Cleaned dist/ directory"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_warn "node_modules not found. Running npm ci..."
    npm ci
    log_success "Dependencies installed"
fi

# Run build
log_info "Compiling frontend assets..."
if npm run build; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    echo -e "\n${GREEN}${BOLD}✅ Build Successful in ${DURATION}s${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "${BOLD}📁 Output:${NC}  frontend/dist"
    echo -e "${BOLD}🕒 Time:${NC}    $(date)"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "\nTo preview the production build locally:"
    echo -e "  ${BOLD}npm run preview${NC}\n"
else
    log_error "Build failed! Check the logs above for details."
    exit 1
fi

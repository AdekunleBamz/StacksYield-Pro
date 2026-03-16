# StacksYield Pro Development Server Script
# Optimized for a focused terminal experience

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

info() { echo -e "${BLUE}${BOLD}[DEV-SERVER]${NC} $1"; }
success() { echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"; }
error() { echo -e "${RED}${BOLD}[ERROR]${NC} $1"; exit 1; }

set -e

info "Waking up StacksYield Pro environment..."

# Navigate to frontend directory relatively
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/../frontend"

# Pre-flight check: node_modules
if [ ! -d "node_modules" ]; then
    warn "Dependencies missing. Initiating synchronization..."
    npm install
    success "Environment ready."
fi

# Pre-flight check: .env
if [ ! -f ".env" ]; then
    error ".env file missing! Please run scripts/setup.sh first or create it manually."
fi

# Start development server
info "Launching Vite dev server..."
echo -e "${GREEN}${BOLD}>>> Starting Vite Engine...${NC}"
npm run dev

# Makefile for StacksYield Pro
# Common development commands

.PHONY: help install dev build test clean deploy

# Default target
help:
	@echo "StacksYield Pro - Available Commands"
	@echo ""
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make test       - Run all tests"
	@echo "  make lint       - Run linters"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make check      - Check contract syntax"
	@echo ""

# Install dependencies
install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Done!"

# Start development server
dev:
	@echo "Starting development server..."
	cd frontend && npm run dev

# Build for production
build:
	@echo "Building for production..."
	cd frontend && npm run build

# Run all tests
test:
	@echo "Running contract tests..."
	clarinet test
	@echo "Tests complete!"

# Run linters
lint:
	@echo "Running ESLint..."
	cd frontend && npm run lint
	@echo "Checking contract syntax..."
	clarinet check
	@echo "Linting complete!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.vite
	@echo "Clean complete!"

# Check contract syntax
check:
	@echo "Checking Clarity contracts..."
	clarinet check
	@echo "Check complete!"

# Format code
format:
	@echo "Formatting code..."
	cd frontend && npm run format
	@echo "Format complete!"

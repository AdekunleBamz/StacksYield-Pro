# StacksYield Pro Scripts

This directory contains utility scripts for development, deployment, and maintenance.

## Available Scripts

### Development

- `setup.sh` - Initial project setup
- `dev.sh` - Start development environment

### Deployment

- `deploy-testnet.sh` - Deploy contracts to testnet
- `deploy-mainnet.sh` - Deploy contracts to mainnet

### Maintenance

- `backup.sh` - Backup important configurations
- `cleanup.sh` - Clean build artifacts

## Usage

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

Run a script:
```bash
./scripts/setup.sh
```

## Notes

- Always review scripts before running
- Test on devnet/testnet before mainnet
- Keep sensitive data in environment variables

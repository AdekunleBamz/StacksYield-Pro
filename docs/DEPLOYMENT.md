# Deployment Guide

## Prerequisites

- Clarinet CLI installed
- Stacks wallet with STX for gas fees
- Node.js 18+ installed

## Smart Contract Deployment

### Testnet Deployment

1. Configure your testnet settings in `settings/Testnet.toml`

2. Deploy using Clarinet:
```bash
clarinet deployments apply --deployment-plan-path deployments/default.testnet-plan.yaml
```

3. Verify the deployment on the Stacks Explorer

### Mainnet Deployment

1. Ensure thorough testing on testnet first

2. Update `settings/Mainnet.toml` with production values

3. Deploy to mainnet:
```bash
clarinet deployments apply --deployment-plan-path deployments/default.mainnet-plan.yaml
```

4. Verify on mainnet explorer

## Frontend Deployment

### Build for Production

```bash
cd frontend
npm run build
```

### Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Self-Hosted
Upload the `dist` folder contents to your web server.

## Environment Variables

Create a `.env` file for production:

```
VITE_CONTRACT_ADDRESS=SP...
VITE_NETWORK=mainnet
```

## Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Frontend connecting to correct network
- [ ] Wallet integration working
- [ ] All vault functions operational
- [ ] Monitoring and alerts configured

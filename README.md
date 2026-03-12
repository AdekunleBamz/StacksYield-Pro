# 🚀 StacksYield Pro

[![Contracts CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml)
[![Frontend CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml)

**Yield Aggregator & Auto-Compounding Vault System on Stacks**

Built with **Stacks.js SDK** & **WalletConnect** for the Stacks Builder Challenge #3

![StacksYield Pro](https://img.shields.io/badge/Stacks-Blockchain-5546FF?style=for-the-badge)
![Stacks Connect](https://img.shields.io/badge/@stacks/connect-7.7.1-orange?style=for-the-badge)
![Stacks Transactions](https://img.shields.io/badge/@stacks/transactions-6.13.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📋 Overview

StacksYield Pro is a DeFi yield aggregator that allows users to deposit STX into different vault strategies:

- **Conservative Vault** - 5% APY, 1 week lock, minimum 1 STX
- **Balanced Vault** - 12% APY, 2 week lock, minimum 10 STX  
- **Aggressive Vault** - 25% APY, 4 week lock, minimum 50 STX

### Key Features

✅ Auto-compounding rewards  
✅ Multiple vault strategies  
✅ Referral program (0.25% bonus)  
✅ Emergency withdrawal option  
✅ WalletKit SDK integration  

## 🧩 Stacks SDK Usage

This project relies on the official Stacks.js libraries for wallet connectivity, transaction building, and network configuration:

- `@stacks/connect` — wallet connection and contract call signing
- `@stacks/transactions` — Clarity value encoding and post-conditions
- `@stacks/network` — network configuration and API targeting

Key integrations live in:

- Wallet & session setup: `frontend/src/context/WalletContext.jsx`
- Contract calls: `frontend/src/components/VaultList.jsx`, `frontend/src/components/ReferralSection.jsx`
- Read-only queries: `frontend/src/hooks/useContract.js`

## 🛠️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/AdekunleBamz/StacksYield-Pro.git
cd StacksYield-Pro

# Install root tooling and frontend dependencies
npm install
npm --prefix frontend install

# Start development server
npm run frontend:dev
```

## 🔌 WalletConnect (Reown) + Stacks

This app uses WalletConnect (via Reown AppKit UniversalConnector) to connect **mobile** Stacks wallets and sign transactions using Stacks JSON-RPC.

### What to expect

- Best UX is with **Xverse mobile** or **Leather mobile** (scan from inside the wallet’s WalletConnect scanner).
- Phone camera apps may not recognize `wc:` QR codes. Use the wallet’s scanner or open the WalletConnect web handoff link shown in the app.

### Setup checklist

1. Create a project in WalletConnect Cloud / Reown and copy the Project ID.
2. Add Allowed Origins:
	 - `http://localhost:5173`
	 - your Vercel origin (e.g. `https://your-app.vercel.app`)
3. Configure env var (local + Vercel):

Copy `frontend/.env.example` to `frontend/.env` and set:

```dotenv
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_WALLETCONNECT_RELAY_URL=wss://relay.walletconnect.com
```

### Technical notes (Stacks)

- Pairing is scoped to Stacks mainnet: `stacks:1`.
- Wallets may enforce WalletConnect v2 **required namespaces**. If a method isn’t declared as required, the wallet can refuse to prompt.
	- This app declares required methods including: `stx_getAddresses`, `stx_signTransaction`, and `stx_callContract`.
- After pairing, the app requests addresses with `stx_getAddresses` and signs/broadcasts using `stx_signTransaction` (with a safe fallback when needed).

### Quick troubleshooting

- **Blank QR**: usually invalid `VITE_WALLETCONNECT_PROJECT_ID`, missing allowlisted origin, invalid metadata/icons, or missing required namespaces.
- **Approved in wallet but stuck “Connecting…”**: wallet didn’t respond to `stx_getAddresses` quickly; retry, or check wallet supports the method.
- **No approval popup on Deposit**: wallet is rejecting an undeclared method; ensure `stx_callContract` is included in required namespace methods.

### Prerequisites

- Node.js 18+ 
- Clarinet (for smart contract development)
- A Stacks wallet (Leather, Xverse, etc.)

### Smart Contract Deployment

```bash
# Navigate to the project root
cd StacksYield-Pro

# Install Clarinet if not already installed
# macOS
brew install clarinet

# Check contract syntax
clarinet check

# Test the contract
clarinet test

# Deploy to testnet
clarinet deployments generate --testnet
clarinet deployments apply -p deployments/default.testnet-plan.yaml

# Deploy to mainnet
clarinet deployments generate --mainnet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

### Frontend Setup

```bash
# Install dependencies
npm install
npm --prefix frontend install

# Start development server
npm run frontend:dev

# Build for production
npm run frontend:build
```

## 📁 Project Structure

```
stacksyield-pro/
├── contracts/
│   └── stacksyield-pro.clar    # Main Clarity smart contract
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── VaultList.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── ReferralSection.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── Clarinet.toml
└── README.md
```

## 🔧 Configuration

After deploying the smart contract, update the contract address in `frontend/src/App.jsx`:

```javascript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'
const CONTRACT_NAME = 'stacksyield-pro'
```

## 📜 Smart Contract Functions

### User Functions

| Function | Description |
|----------|-------------|
| `register-user` | Register with optional referral code |
| `create-referral-code` | Create a unique referral code |
| `deposit` | Deposit STX into a vault |
| `withdraw` | Withdraw from a vault (after lock period) |
| `emergency-withdraw` | Emergency withdrawal with 5% penalty |
| `compound` | Compound pending rewards |

### Admin Functions

| Function | Description |
|----------|-------------|
| `create-vault` | Create a new vault |
| `update-vault-apy` | Update vault APY |
| `toggle-vault` | Pause/unpause a vault |
| `toggle-protocol` | Pause entire protocol |
| `withdraw-fees` | Withdraw collected fees |

## 💰 Fee Structure

| Fee Type | Amount |
|----------|--------|
| Deposit Fee | 0.5% |
| Withdrawal Fee | 0.5% |
| Emergency Withdrawal | 5% |
| Performance Fee | 10% |
| Referral Bonus | 0.25% |

## 🔗 Links

- **GitHub**: [github.com/AdekunleBamz](https://github.com/AdekunleBamz)
- **Twitter**: [@hrh_mckay](https://twitter.com/hrh_mckay)
- **Farcaster**: [@Bamzzz](https://warpcast.com/bamzzz)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for Stacks Builder Challenge #3

## 🔌 Stacks.js Integration Guide

This section documents how @stacks/connect and @stacks/transactions are used in StacksYield Pro.

### @stacks/connect - Wallet Connection

@stacks/connect is used for connecting to Stacks wallets (Leather, Xverse, etc.).

```javascript
import { connect } from '@stacks/connect'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const network = new StacksMainnet()
const appDetails = {
  name: 'StacksYield Pro',
  icon: window.location.origin + '/logo.svg'
}

// Connect wallet
const { authResponse } = await connect({
  appDetails,
  network,
  onFinish: (data) => {
    console.log('Wallet connected:', data)
  },
  onCancel: () => {
    console.log('User cancelled')
  }
})
```

### @stacks/transactions - Contract Calls

@stacks/transactions is used for building and signing Clarity smart contract calls.

```javascript
import { contractCallable, uintCV, stringAsciiCV, standardPrincipalCV } from '@stacks/transactions'
import { makeContractCall } from '@stacks/transactions'

// Deposit function call
const depositTx = await makeContractCall({
  contractAddress: CONTRACT_ADDRESS,
  contractName: 'stacksyield-pro',
  functionName: 'deposit',
  functionArgs: [
    uintCV(amount),           // amount in microSTX
    uintCV(strategyId)        // 1=Conservative, 2=Balanced, 3=Aggressive
  ],
  senderKey: privateKey,
  network: new StacksMainnet(),
  postConditions: []
})
```

### Key Files Using Stacks.js

| File | Purpose |
|------|---------|
| `frontend/src/context/WalletContext.jsx` | Wallet connection & session management |
| `frontend/src/components/VaultList.jsx` | Deposit/withdraw contract calls |
| `frontend/src/components/ReferralSection.jsx` | Referral code operations |
| `frontend/src/hooks/useContract.js` | Read-only contract queries |
| `frontend/src/utils/walletconnect.js` | WalletConnect integration |

### Network Configuration

```javascript
import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network'

// Mainnet
const mainnet = new StacksMainnet()

// Testnet  
const testnet = new StacksTestnet()

// Switch based on environment
const network = import.meta.env.VITE_NETWORK === 'mainnet' 
  ? new StacksMainnet() 
  : new StacksTestnet()
```

### Transaction Post-Conditions

Post-conditions ensure transactions behave as expected:

```javascript
import { createAssetInfo, standardPrincipalCV, assetInfoCVFromBools } from '@stacks/transactions'

const postConditions = [
  // Ensure sender receives at least X STX back
  makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.GreaterEqual,
    uintCV(minReturn)
  )
]
```

### Error Handling

```javascript
try {
  const tx = await makeContractCall({...})
  const result = await broadcastTransaction(tx, network)
  console.log('Transaction submitted:', result.txid)
} catch (error) {
  if (error.message.includes('Not enough balance')) {
    // Handle insufficient funds
  } else if (error.message.includes('User rejected')) {
    // Handle user rejection
  }
}
```

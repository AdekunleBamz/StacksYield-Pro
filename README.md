# 🚀 StacksYield Pro

**Yield Aggregator & Auto-Compounding Vault System on Stacks**

Built with **WalletKit SDK** for the Stacks Builder Challenge #3

![StacksYield Pro](https://img.shields.io/badge/Stacks-WalletKit-5546FF?style=for-the-badge)
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

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ 
- Clarinet (for smart contract development)
- A Stacks wallet (Leather, Xverse, etc.)

### Smart Contract Deployment

```bash
# Navigate to the project root
cd stacksyield-pro

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
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
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

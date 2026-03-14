# 🚀 StacksYield Pro

**The Premium Yield Aggregator & Auto-Compounding Suite for the Stacks ecosystem.**

[![Contracts CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml)
[![Frontend CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Stacks](https://img.shields.io/badge/Stacks-L2-5546FF?style=for-the-badge&logo=stacks)

---

## 💎 Premium UI/UX Experience

StacksYield Pro features a state-of-the-art interface designed for professional DeFi users.

- **🎨 Glassmorphic Aesthetic**: Deep shadows, backdrop blurs, and translucent layering.
- **✨ Micro-Interactions**: Custom spring easings, staggered grid reveals, and pulsating sync indicators.
- **📱 Mobile-First Native Feel**: Optimized for Xverse and Leather mobile via WalletConnect.
- **📊 Advanced Data Viz**: Premium Area and Pie charts with radial animations and interactive tooltips.
- **🛡️ Resilience Redefined**: Branded `ErrorBoundary` and elastic modal dynamics for a seamless experience.

---

## 🛠️ Quick Start

### Professional Suite setup
The easiest way to get started is using our optimized development scripts:

```bash
# 1. Setup the environment (Prerequisites & Deps)
./scripts/setup.sh

# 2. Launch the Development Engine
./scripts/dev.sh
```

### Manual Installation
```bash
# Clone repository
git clone https://github.com/AdekunleBamz/StacksYield-Pro.git
cd StacksYield-Pro

# Frontend setup
cd frontend
npm install
npm run dev
```

## 📋 Protocol Overview

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

## 🔌 WalletConnect (Reown) + Stacks

This app uses WalletConnect (via Reown AppKit UniversalConnector) to connect **mobile** Stacks wallets and sign transactions using Stacks JSON-RPC.

### What to expect

- Best UX is with **Xverse mobile** or **Leather mobile** (scan from inside the wallet’s WalletConnect scanner).
- Phone camera apps may not recognize `wc:` QR codes. Use the wallet’s scanner or open the WalletConnect web handoff link shown in the app.

---

Built with ❤️ for Stacks Builder Challenge #3


# 🚀 StacksYield Pro

<div align="center">
  <img src="frontend/public/logo.svg" alt="StacksYield Pro Logo" width="120" height="120" />
  <h3>Premium Yield Aggregator & Auto-Compounding Suite for the Stacks Ecosystem</h3>
  <p>Maximize your STX yields with institutional-grade security and a world-class user experience.</p>
  
  [![Contracts CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/contracts.yml)
  [![Frontend CI](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml/badge.svg)](https://github.com/AdekunleBamz/StacksYield-Pro/actions/workflows/frontend.yml)
  ![Stacks](https://img.shields.io/badge/Stacks-L2-5546FF?style=for-the-badge&logo=stacks)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

## 📋 Overview

StacksYield Pro is a high-performance DeFi yield aggregator built on the Stacks blockchain. It enables users to maximize their STX holdings through automated vault strategies with varying risk profiles and lock periods.

### ✨ Core Features

- 🔄 **Auto-Compounding** — Automated reward reinvestment for maximum APY.
- 🛡️ **Tiered Vaults** — Choose from Conservative, Balanced, or Aggressive strategies.
- 🤝 **Referral Engine** — Earn a 0.25% bonus for growing the ecosystem.
- 🆘 **Emergency Exit** — Instant liquidity access with a safety-first approach.
- 📱 **Mobile Ready** — Full WalletConnect support for Xverse and Leather mobile.

---

## 💎 Premium UI/UX Experience

- **🎨 Glassmorphic Aesthetic**: Deep shadows, backdrop blurs, and translucent layering.
- **✨ Micro-Interactions**: Custom spring easings, staggered grid reveals, and pulsating sync indicators.
- **📊 Advanced Data Viz**: Premium Area and Pie charts with radial animations and interactive tooltips.
- **🛡️ Resilience Redefined**: Branded `ErrorBoundary` and elastic modal dynamics for a seamless experience.

---

## 🧩 Stacks.js Integration

This project leverages the official **Stacks.js SDK** for a seamless Web3 experience:

- **`@stacks/connect`** — Secure wallet authentication and transaction signing.
- **`@stacks/transactions`** — Robust Clarity value encoding and post-condition safety.
- **`@stacks/network`** — Reliable network configuration for Mainnet and Testnet.

---

## 🛠️ Quick Start

### ⚡ Optimized Suite
The easiest way to get started is using our optimized productivity scripts:
```bash
./scripts/setup.sh    # Setup environment & dependencies
./scripts/dev.sh      # Launch the development engine
```

### 🔧 Manual Setup
```bash
git clone https://github.com/AdekunleBamz/StacksYield-Pro.git
cd StacksYield-Pro
./scripts/setup.sh    # Installs dependencies across the project
./scripts/dev.sh      # Starts the full Stacks development environment
```

Before opening a PR, run:
```bash
npm run check
```

---

## 🔌 WalletConnect (Reown)

StacksYield Pro uses **WalletConnect v2** (via Reown AppKit) to bridge the gap between desktop dApps and mobile Stacks wallets.

> [!TIP]
> For the best experience, use **Xverse** or **Leather** mobile wallets. Ensure your `VITE_WALLETCONNECT_PROJECT_ID` is correctly set in your `.env` file.

---

## 📁 Project Architecture

```bash
stacksyield-pro/
├── contracts/        # Clarity Smart Contracts
├── frontend/         # React + Vite + Tailwind UI
├── scripts/          # Automation & Dev Ops scripts
├── tests/            # Contract & Integration tests
└── deployments/      # Deployment plans & records
```

---

## 📜 Smart Contract Interface

### User Functions

| Function | Action |
|:---|:---|
| `register-user` | Join the protocol (optional referral) |
| `deposit` | Allocate STX to a specific strategy |
| `withdraw` | Release funds after lock period |
| `emergency-withdraw` | Instant withdrawal (5% penalty) |
| `compound` | Trigger manual reward auto-compounding |

---

## 🔗 Stay Connected

- **GitHub**: [@AdekunleBamz](https://github.com/AdekunleBamz)
- **Twitter**: [@hrh_mckay](https://twitter.com/hrh_mckay)
- **Farcaster**: [@Bamzzz](https://warpcast.com/bamzzz)

---

<div align="center">
  Built with ❤️ for <b>Stacks Builder Challenge #3</b>
</div>

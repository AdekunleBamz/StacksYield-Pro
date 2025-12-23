# StacksYield Pro Architecture

This document describes the high-level architecture of StacksYield Pro.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Header │  │  Hero   │  │  Stats  │  │  UserDashboard  │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │  VaultList  │  │ ReferralSection│  │     Footer      │   │
│  └─────────────┘  └────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Wallet Integration                        │
│              (Stacks Connect / Leather Wallet)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contracts (Clarity)                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  stacksyield-pro.clar                    ││
│  │  - Vault Management                                      ││
│  │  - Deposit/Withdraw                                      ││
│  │  - Reward Calculation                                    ││
│  │  - Referral System                                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stacks Blockchain                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Description

### Frontend Layer
- **React**: Main UI framework
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server

### Wallet Layer
- **Stacks Connect**: Wallet authentication
- **Transaction Signing**: Secure transaction handling

### Smart Contract Layer
- **Clarity**: Smart contract language
- **Clarinet**: Development and testing framework

### Blockchain Layer
- **Stacks**: Layer 2 Bitcoin blockchain
- **STX**: Native token for transactions

## Data Flow

1. User interacts with frontend
2. Frontend triggers wallet connection
3. User signs transaction
4. Transaction sent to Stacks blockchain
5. Smart contract executes
6. State updated on-chain
7. Frontend reflects updated state

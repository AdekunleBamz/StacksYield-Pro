# Developer Guide

## Building on StacksYield Pro

This guide is for developers who want to contribute to or integrate with StacksYield Pro.

## Project Structure

```
stacksyield-pro/
├── contracts/           # Clarity smart contracts
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   └── utils/      # Utility functions
├── tests/              # Contract test files
├── deployments/        # Deployment configurations
├── settings/           # Clarinet settings
└── docs/               # Documentation
```

## Development Environment Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Clarinet CLI
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/StacksYield-Pro.git
cd StacksYield-Pro

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Smart Contract Development

### Writing Clarity Contracts

Clarity is the smart contract language for Stacks. Key concepts:

```clarity
;; Define data variables
(define-data-var counter uint u0)

;; Define maps
(define-map balances principal uint)

;; Public functions
(define-public (increment)
  (ok (var-set counter (+ (var-get counter) u1))))

;; Read-only functions
(define-read-only (get-counter)
  (var-get counter))
```

### Testing Contracts

```bash
# Run all tests
clarinet test

# Check contract syntax
clarinet check

# Open Clarinet console
clarinet console
```

## Frontend Development

### Component Structure

```jsx
// Example component
import { useWallet } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';

export function VaultCard({ vault }) {
  const { isConnected } = useWallet();
  const { deposit } = useContract();
  
  // Component logic
}
```

### Custom Hooks

The `useContract` hook provides contract interaction methods:

```jsx
const { deposit, withdraw, claimRewards } = useContract();
```

### Styling with Tailwind

We use Tailwind CSS for styling:

```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-900">
    Vault Title
  </h2>
</div>
```

## API Integration

### Contract Calls

```javascript
import { callReadOnlyFunction, callContract } from '@stacks/transactions';

// Read-only call
const result = await callReadOnlyFunction({
  contractAddress,
  contractName: 'stacksyield-pro',
  functionName: 'get-vault-info',
  functionArgs: [uintCV(vaultId)],
  network,
});
```

## Best Practices

1. Write tests for all contract functions
2. Use meaningful variable names
3. Comment complex logic
4. Follow existing code patterns
5. Keep components small and focused
6. Use TypeScript for better type safety

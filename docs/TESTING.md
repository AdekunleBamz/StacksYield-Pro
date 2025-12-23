# Testing Guide

## Overview

This guide covers testing practices for StacksYield Pro smart contracts and frontend application.

## Smart Contract Testing

### Running Tests with Clarinet

```bash
# Run all tests
clarinet test

# Run specific test file
clarinet test tests/stacksyield-pro_test.ts

# Run with coverage
clarinet test --coverage
```

### Test Structure

```clarity
;; Example test structure
(define-public (test-deposit)
  (let (
    (result (contract-call? .stacksyield-pro deposit u1 u1000000))
  )
    (asserts! (is-ok result) (err u1))
    (ok true)
  )
)
```

### Testing Best Practices

1. Test all public functions
2. Test edge cases and error conditions
3. Test with different user principals
4. Verify state changes
5. Check event emissions

## Frontend Testing

### Unit Tests

```bash
cd frontend
npm run test
```

### Component Testing

Test individual components in isolation:

- Header component
- VaultList component
- UserDashboard component
- Wallet connection flow

### Integration Tests

Test full user flows:

1. Connect wallet
2. View available vaults
3. Make deposit
4. Check balance
5. Claim rewards
6. Withdraw funds

## Test Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Smart Contracts | 90%+ |
| React Components | 80%+ |
| Utility Functions | 95%+ |
| Hooks | 85%+ |

## Continuous Integration

Tests run automatically on:
- Pull request creation
- Push to main branch
- Scheduled daily builds

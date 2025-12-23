# StacksYield Pro Tests

This directory contains test files for the StacksYield Pro smart contracts.

## Test Structure

```
tests/
├── stacksyield-pro_test.ts    # Main contract tests
├── helpers/                    # Test helper functions
│   └── test-utils.ts
└── README.md                   # This file
```

## Running Tests

### Run All Tests
```bash
clarinet test
```

### Run Specific Test File
```bash
clarinet test tests/stacksyield-pro_test.ts
```

### Run with Coverage
```bash
clarinet test --coverage
```

### Run with Verbose Output
```bash
clarinet test --verbose
```

## Writing Tests

### Test Structure

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet/index.ts';

Clarinet.test({
    name: "Test name",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Arrange
        const deployer = accounts.get('deployer')!;
        
        // Act
        let block = chain.mineBlock([
            Tx.contractCall('stacksyield-pro', 'function-name', [args], deployer.address)
        ]);
        
        // Assert
        block.receipts[0].result.expectOk();
    }
});
```

## Test Categories

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test function interactions
3. **Edge Cases** - Test boundary conditions
4. **Error Cases** - Test error handling

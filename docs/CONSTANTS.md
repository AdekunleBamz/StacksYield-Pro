# Contract Constants Reference

This document defines the constants used in StacksYield Pro smart contracts.

## Error Codes

| Constant | Value | Description |
|----------|-------|-------------|
| ERR-NOT-AUTHORIZED | u100 | Caller is not authorized |
| ERR-VAULT-NOT-FOUND | u101 | Vault does not exist |
| ERR-INSUFFICIENT-BALANCE | u102 | User has insufficient balance |
| ERR-INVALID-AMOUNT | u103 | Invalid amount specified |
| ERR-VAULT-PAUSED | u104 | Vault is currently paused |
| ERR-MIN-DEPOSIT | u105 | Minimum deposit not met |
| ERR-ALREADY-EXISTS | u106 | Resource already exists |
| ERR-TRANSFER-FAILED | u107 | Token transfer failed |
| ERR-ZERO-AMOUNT | u108 | Amount cannot be zero |
| ERR-LOCK-PERIOD | u109 | Lock period not elapsed |

## Protocol Constants

| Constant | Value | Description |
|----------|-------|-------------|
| CONTRACT-OWNER | tx-sender | Contract deployer address |
| PROTOCOL-FEE | u100 | Protocol fee in basis points (1%) |
| MAX-APY | u10000 | Maximum APY (100%) |
| MIN-DEPOSIT-DEFAULT | u1000000 | Default min deposit (1 STX) |
| BLOCKS-PER-YEAR | u52560 | Approximate blocks per year |

## Basis Points Reference

Basis points are used for percentages:
- 1 basis point = 0.01%
- 100 basis points = 1%
- 1000 basis points = 10%
- 10000 basis points = 100%

## Block Time Reference

Stacks block time is approximately 10 minutes:
- 1 hour ≈ 6 blocks
- 1 day ≈ 144 blocks
- 1 week ≈ 1008 blocks
- 1 year ≈ 52560 blocks

## STX Units

STX uses 6 decimal places:
- 1 STX = 1,000,000 micro-STX
- 0.1 STX = 100,000 micro-STX
- 0.01 STX = 10,000 micro-STX
- 0.001 STX = 1,000 micro-STX

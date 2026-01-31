# Smart Contracts

This directory contains the Clarity smart contracts for StacksYield Pro.

## Contracts

### stacksyield-pro.clar

The main vault contract implementing:

- **Vault Management**: Three vault strategies (Conservative, Balanced, Aggressive)
- **Deposits/Withdrawals**: STX deposit and withdrawal logic
- **Auto-Compounding**: Reward calculation and compounding
- **Referral System**: User registration and referral tracking
- **Emergency Functions**: Emergency withdrawal for locked positions

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| u1001 | NOT_AUTHORIZED | Caller lacks permission |
| u1002 | INVALID_VAULT | Vault does not exist |
| u1003 | VAULT_PAUSED | Vault is currently paused |
| u1004 | INSUFFICIENT_BALANCE | Not enough balance |
| u1005 | LOCK_PERIOD_ACTIVE | Funds still locked |
| u1006 | MIN_DEPOSIT_NOT_MET | Below minimum deposit |
| u1007 | INVALID_AMOUNT | Invalid deposit/withdraw amount |
| u1008 | ALREADY_REGISTERED | User already registered |
| u1009 | INVALID_REFERRAL | Invalid referral code |

## Development

```bash
# Check contract syntax
clarinet check

# Run tests
clarinet test

# Console interaction
clarinet console
```

## Deployment

See [Clarinet documentation](https://docs.hiro.so/clarinet) for deployment instructions.

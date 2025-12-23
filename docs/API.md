# API Reference

## Smart Contract Functions

### Public Functions

#### `deposit`
Deposit STX into a yield vault.

**Parameters:**
- `vault-id`: (uint) - The ID of the vault to deposit into
- `amount`: (uint) - The amount of STX to deposit

**Returns:** (response bool uint)

---

#### `withdraw`
Withdraw STX from a yield vault.

**Parameters:**
- `vault-id`: (uint) - The ID of the vault to withdraw from
- `amount`: (uint) - The amount of STX to withdraw

**Returns:** (response bool uint)

---

#### `claim-rewards`
Claim accumulated rewards from a vault.

**Parameters:**
- `vault-id`: (uint) - The ID of the vault to claim rewards from

**Returns:** (response uint uint)

---

### Read-Only Functions

#### `get-vault-info`
Get information about a specific vault.

**Parameters:**
- `vault-id`: (uint) - The ID of the vault

**Returns:** (optional {name, apy, total-staked, min-deposit})

---

#### `get-user-balance`
Get user's balance in a specific vault.

**Parameters:**
- `user`: (principal) - The user's address
- `vault-id`: (uint) - The ID of the vault

**Returns:** (optional uint)

---

#### `get-pending-rewards`
Get user's pending rewards in a specific vault.

**Parameters:**
- `user`: (principal) - The user's address
- `vault-id`: (uint) - The ID of the vault

**Returns:** (optional uint)

---

## Error Codes

| Code | Description |
|------|-------------|
| u100 | Vault not found |
| u101 | Insufficient balance |
| u102 | Invalid amount |
| u103 | Unauthorized |
| u104 | Vault is paused |
| u105 | Minimum deposit not met |

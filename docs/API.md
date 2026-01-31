# API Reference

## Smart Contract Functions

### Public Functions

#### `register-user`
Register a user with an optional referral code.

**Parameters:**
- `referral-code`: (optional (string-ascii 20))
**Returns:** (response bool uint)

---

#### `create-referral-code`
Create a unique referral code for the caller.

**Parameters:**
- `code`: (string-ascii 20)
**Returns:** (response bool uint)

---

#### `deposit`
Deposit STX into a yield vault.

**Parameters:**
- `vault-id`: (uint)
- `amount`: (uint) — in micro-STX
**Returns:** (response bool uint)

---

#### `withdraw`
Withdraw STX from a yield vault.

**Parameters:**
- `vault-id`: (uint)
- `amount`: (uint) — in shares
**Returns:** (response bool uint)

---

#### `emergency-withdraw`
Withdraw immediately with a penalty.

**Parameters:**
- `vault-id`: (uint)
**Returns:** (response bool uint)

---

#### `compound`
Compound pending rewards for a vault position.

**Parameters:**
- `vault-id`: (uint)
**Returns:** (response bool uint)

---

### Read-Only Functions

#### `get-vault`
Get vault configuration and state.

**Parameters:**
- `vault-id`: (uint)
**Returns:** (optional {name, strategy, total-deposits, total-shares, apy, min-deposit, lock-period, is-active, created-at})

---

#### `get-user-deposit`
Get a user’s deposit for a vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (optional {shares, deposit-amount, deposit-time, last-compound, pending-rewards})

---

#### `get-user-stats`
Get aggregate stats for a user.

**Parameters:**
- `user`: (principal)
**Returns:** {total-deposited, total-withdrawn, total-rewards, referral-earnings, referrer, referral-count, is-registered}

---

#### `get-total-tvl`
Get total value locked.

**Returns:** (uint)

---

#### `get-total-users`
Get total number of registered users.

**Returns:** (uint)

---

#### `get-total-fees`
Get total fees collected.

**Returns:** (uint)

---

#### `calculate-pending-rewards`
Calculate pending rewards for a user in a vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

## Error Codes

| Code | Description |
|------|-------------|
| u1001 | Not authorized |
| u1002 | Invalid amount |
| u1003 | Insufficient balance |
| u1004 | Vault not found |
| u1005 | Vault paused |
| u1006 | Withdrawal locked |
| u1007 | Invalid strategy |
| u1008 | Self-referral |
| u1009 | Already registered |# API Reference

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

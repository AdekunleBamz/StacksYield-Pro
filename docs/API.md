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
**Returns:** (response {shares: uint, net-amount: uint, fee: uint} uint)

---

#### `withdraw`
Withdraw STX from a yield vault.

**Parameters:**
- `vault-id`: (uint)
- `shares`: (uint) — number of vault shares
**Returns:** (response {withdrawn-shares: uint, gross-amount: uint, fee: uint, net-amount: uint} uint)

---

#### `emergency-withdraw`
Withdraw immediately with a penalty.

**Parameters:**
- `vault-id`: (uint)
**Returns:** (response {gross-amount: uint, fee: uint, net-amount: uint} uint)

---

#### `compound`
Compound pending rewards for a vault position.

**Parameters:**
- `vault-id`: (uint)
**Returns:** (response {rewards: uint, reward-shares: uint} uint)

---

#### `set-protocol-paused`
Toggle protocol pause status (owner only).

**Parameters:**
- `paused`: (bool)
**Returns:** (response bool uint)

---

#### `set-treasury`
Update treasury principal (owner only).

**Parameters:**
- `new-treasury`: (principal)
**Returns:** (response principal uint)

---

#### `create-vault`
Create a new vault configuration (owner only).

**Parameters:**
- `name`: (string-ascii 50)
- `strategy`: (uint)
- `apy`: (uint)
- `min-deposit`: (uint)
- `lock-period`: (uint)
**Returns:** (response uint uint)

---

#### `set-vault-apy`
Update APY for a vault (owner only).

**Parameters:**
- `vault-id`: (uint)
- `new-apy`: (uint)
**Returns:** (response uint uint)

---

#### `set-vault-active`
Toggle a vault active flag (owner only).

**Parameters:**
- `vault-id`: (uint)
- `is-active`: (bool)
**Returns:** (response bool uint)

---

#### `set-vault-min-deposit`
Update minimum deposit requirement (owner only).

**Parameters:**
- `vault-id`: (uint)
- `new-min-deposit`: (uint)
**Returns:** (response uint uint)

---

#### `set-vault-lock-period`
Update lock period for a vault (owner only).

**Parameters:**
- `vault-id`: (uint)
- `new-lock-period`: (uint)
**Returns:** (response uint uint)

---

#### `schedule-admin-action`
Queue an admin action behind timelock (owner only).

**Parameters:**
- `action-name`: (string-ascii 50)
- `params`: (string-ascii 100)
**Returns:** (response bool uint)

---

#### `execute-admin-action`
Execute the scheduled timelocked admin action (owner only).

**Parameters:**
- none
**Returns:** (response (string-ascii 50) uint)

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

#### `get-protocol-paused`
Check whether protocol operations are paused.

**Returns:** (bool)

---

#### `get-treasury`
Get treasury principal for fee accounting.

**Returns:** (principal)

---

#### `get-next-vault-id`
Get the next vault ID that will be assigned by `create-vault`.

**Returns:** (uint)

---

#### `get-admin-timelock`
Get block height when the current timelock was scheduled.

**Returns:** (uint)

---

#### `get-pending-admin-action`
Get currently queued timelock action payload.

**Returns:** (optional {action-name, params})

---

#### `get-blocks-until-admin-action`
Get number of blocks remaining before execution is allowed.

**Returns:** (uint)

---

#### `has-pending-admin-action`
Check whether any admin action is currently queued.

**Returns:** (bool)

---

#### `get-admin-timelock-status`
Get combined timelock state snapshot.

**Returns:** {has-pending-action, timelock-start, blocks-remaining}

---

#### `calculate-pending-rewards`
Calculate pending rewards for a user in a vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `get-protocol-metrics`
Get aggregated protocol metrics.

**Returns:** {total-tvl, total-users, total-fees-collected, protocol-paused}

---

#### `get-contract-owner`
Get deployer/owner principal captured by the contract.

**Returns:** (principal)

---

#### `get-deposit-fee-bps`
Get protocol deposit fee in basis points.

**Returns:** (uint)

---

#### `get-withdrawal-fee-bps`
Get protocol withdrawal fee in basis points.

**Returns:** (uint)

---

#### `get-performance-fee-bps`
Get performance fee in basis points.

**Returns:** (uint)

---

#### `get-emergency-fee-bps`
Get emergency withdrawal fee in basis points.

**Returns:** (uint)

---

#### `get-referral-bonus-bps`
Get referral bonus percentage in basis points.

**Returns:** (uint)

---

#### `get-bps-denominator`
Get basis-points denominator constant.

**Returns:** (uint)

---

#### `get-blocks-per-year`
Get annualized block-count constant used in APY math.

**Returns:** (uint)

---

#### `get-max-apy`
Get maximum APY value accepted by admin setters.

**Returns:** (uint)

---

#### `get-timelock-duration`
Get admin timelock duration in blocks.

**Returns:** (uint)

---

#### `get-user-shares`
Get user share balance for a vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `get-user-deposit-amount`
Get user tracked deposit amount for a vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `get-user-last-compound`
Get last compound block height for a position.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `get-user-deposit-time`
Get initial deposit block height for a position.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `get-user-cached-pending-rewards`
Get cached pending rewards from user deposit map.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (uint)

---

#### `has-user-position`
Check if a user has an active position in vault.

**Parameters:**
- `user`: (principal)
- `vault-id`: (uint)
**Returns:** (bool)

---

#### `get-user-referrer`
Get user referrer principal if configured.

**Parameters:**
- `user`: (principal)
**Returns:** (optional principal)

---

#### `has-user-referrer`
Check whether user has referrer configured.

**Parameters:**
- `user`: (principal)
**Returns:** (bool)

---

#### `get-user-referral-count`
Get number of referrals attributed to user.

**Parameters:**
- `user`: (principal)
**Returns:** (uint)

---

#### `get-user-referral-earnings`
Get cumulative referral earnings for a user.

**Parameters:**
- `user`: (principal)
**Returns:** (uint)

---

#### `get-user-referral-summary`
Get combined referral metrics for a user.

**Parameters:**
- `user`: (principal)
**Returns:** {referrer, referral-count, referral-earnings}

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
| u1009 | Already registered |

# StacksYield Pro Scripts

This directory contains utility scripts for development, deployment, and wallet automation.

## Available Scripts

### Development

- `setup.sh` - Initial project setup
- `dev.sh` - Start development environment

### Wallet Automation (Mainnet)

- `create-mainnet-vault.mjs` - Creates a new vault (owner-only), useful for setting min-deposit to `0.01 STX`
- `fund-test-wallets.mjs` - Creates 30 wallets if needed, then funds wallets `#2-#30` from wallet `#1`
- `trigger-wallet-interactions.mjs` - Runs at least 5 confirmed contract interactions per wallet
- `check-wallet-balances.mjs` - Prints STX balances for all generated wallets

Run from project root:
```bash
npm run vault:create
npm run wallets:fund
npm run wallets:interact
npm run wallets:balances
```

Wallets are stored in:
```bash
scripts/.generated/test-wallets.mainnet.json
```

### Key Defaults

- Network: `mainnet`
- API URL: `https://api.mainnet.hiro.so`
- Contract: `SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N.stacksyield-pro`
- Wallet count: `30`
- Fee per tx: `1000 uSTX` (`0.001 STX`)
- Interactions per wallet: `5`
- Funding wallet: wallet `#1`

### Useful Environment Variables

- `WALLETS_FILE` - Override wallet file path
- `WALLET_COUNT` - Override number of wallets (default `30`)
- `TX_FEE_USTX` - Tx fee in micro-STX (default `1000`)
- `INTERACTIONS_PER_WALLET` - Number of interactions (default `5`)
- `OWNER_MNEMONIC` - Preferred for `vault:create` (contract owner mnemonic)
- `OWNER_ACCOUNT_INDEX` - Account index for mnemonic derivation (default `0`)
- `OWNER_PRIVATE_KEY` - Fallback only if mnemonic is not used
- `CONTRACT_ADDRESS` - Override contract address
- `CONTRACT_NAME` - Override contract name
- `STACKS_API_URL` - Override mainnet API endpoint
- `VAULT_ID` - Force a specific vault id for funding/interactions
- `MIN_DEPOSIT_USTX` - `vault:create` min deposit (default `10000` = `0.01 STX`)
- `VAULT_NAME`, `VAULT_STRATEGY`, `VAULT_APY_BPS`, `VAULT_LOCK_PERIOD` - Optional `vault:create` params
- `FUND_AMOUNT_USTX` / `FUND_AMOUNT_STX` - Explicit target balance per recipient wallet
- `DEPOSIT_AMOUNT_USTX` / `DEPOSIT_AMOUNT_STX` - Explicit deposit amount per interaction
- `FUND_BUFFER_USTX` - Optional extra buffer added per recipient on top of computed requirement (default `0`)
- `REGENERATE_WALLETS=true` - Regenerate wallet file from scratch in funding script

## Safety Notes

- The interaction script waits for on-chain confirmation and prints `✅ Confirmed` after every transaction.
- Tx hash is printed before waiting for confirmation.
- Scripts run prechecks for vault availability, protocol pause state, nonce, and balances to reduce failed transactions.
- Funding defaults to dynamic per-wallet top-up (based on registration state, deposit amount, interaction count, and fees) to minimize overfunding.
- Never share `scripts/.generated/test-wallets.mainnet.json` (it contains private keys).

/**
 * Network configuration for Stacks
 */
export const NETWORKS = {
  MAINNET: {
    address: 'SP3C1163TTC6A6KGK05V6GNRV8B3M1P8878B3S869',
    name: 'stacksyield-pro',
    label: 'Mainnet'
  },
  TESTNET: {
    address: 'ST3C1163TTC6A6KGK05V6GNRV8B3M1P8878B3S869',
    name: 'stacksyield-pro',
    label: 'Testnet'
  }
}

/**
 * Vault Strategy Details
 */
export const VAULT_STRATEGIES = [
  { id: 1, name: 'Conservative', apy: 5, minDeposit: 1, lockPeriod: 7, risk: 'low', color: 'blue' },
  { id: 2, name: 'Balanced', apy: 12, minDeposit: 10, lockPeriod: 14, risk: 'medium', color: 'purple' },
  { id: 3, name: 'Aggressive', apy: 25, minDeposit: 50, lockPeriod: 28, risk: 'high', color: 'orange' }
]

/**
 * Protocol Fee Structure (Basis Points)
 */
export const FEE_BPS = {
  DEPOSIT: 50,
  WITHDRAWAL: 50,
  EMERGENCY: 500,
  PERFORMANCE: 1000,
  REFERRAL: 25
}

/**
 * Transaction and Application State
 */
export const STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}

/**
 * Local Storage Persistence Keys
 */
export const KEYS = {
  AUTH: 'stx_auth_session',
  THEME: 'stx_app_theme',
  REF: 'stx_referral_code',
  NETWORK: 'stx_active_network'
}

/**
 * Common Error Messages
 */
export const ERRORS = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_FUNDS: 'Insufficient STX balance in your wallet',
  TX_REJECTED: 'Transaction was rejected by user',
  VAULT_LOCKED: 'Funds are still within the lock period'
}

/**
 * Application Constants
 */

export const CONTRACT_CONFIG = {
  mainnet: {
    address: 'SP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    name: 'stacksyield-pro'
  },
  testnet: {
    address: 'ST1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    name: 'stacksyield-pro'
  }
}

export const VAULT_STRATEGIES = [
  { id: 1, name: 'Conservative', apy: 5, minDeposit: 1, lockPeriod: 7, risk: 'low' },
  { id: 2, name: 'Balanced', apy: 12, minDeposit: 10, lockPeriod: 14, risk: 'medium' },
  { id: 3, name: 'Aggressive', apy: 25, minDeposit: 50, lockPeriod: 28, risk: 'high' }
]

export const FEE_RATES = {
  deposit: 0.5,
  withdrawal: 0.5,
  emergencyWithdrawal: 5,
  performance: 10,
  referral: 0.25
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const STORAGE_KEYS = {
  wallet: 'stx_wallet',
  network: 'stx_network',
  referral: 'stx_referral'
}

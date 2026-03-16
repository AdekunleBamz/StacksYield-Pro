/**
 * Formats a microSTX amount into a human-readable STX string.
 * @param {number|string} microSTX - The amount in microSTX.
 * @returns {string} The formatted STX amount.
 */
export const formatSTX = (microSTX) => {
  if (microSTX === undefined || microSTX === null) return '0.00'
  const stx = Number(microSTX) / 1000000
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })
}

/**
 * Converts an STX amount to microSTX.
 * @param {number|string} stx - The amount in STX.
 * @returns {number} The amount in microSTX.
 */
export const toMicroSTX = (stx) => {
  if (!stx) return 0
  return Math.floor(parseFloat(stx) * 1000000)
}

/**
 * Converts a microSTX amount to STX.
 * @param {number|string} microSTX - The amount in microSTX.
 * @returns {number} The amount in STX.
 */
export const fromMicroSTX = (microSTX) => {
  if (!microSTX) return 0
  return Number(microSTX) / 1000000
}

/**
 * Truncates a Stacks address for display.
 * @param {string} address - The full Stacks address.
 * @param {number} start - Number of characters to show at the start.
 * @param {number} end - Number of characters to show at the end.
 * @returns {string} The truncated address.
 */
export const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

/**
 * Formats large numbers into compact strings (e.g., 1.2M, 5.4K).
 * @param {number|string} num - The number to format.
 * @returns {string} The formatted number.
 */
export const formatNumber = (num) => {
  const n = Number(num)
  if (isNaN(n)) return '0'
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)}B`
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

/**
 * Formats a number as a percentage string.
 * @param {number} value - The numerical value.
 * @param {number} decimals - Number of decimal places.
 * @returns {string} The formatted percentage.
 */
export const formatPercent = (value, decimals = 2) => {
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Formats a timestamp into a localized date string.
 * @param {number|string|Date} timestamp - The timestamp or date object.
 * @returns {string} The formatted date.
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Formats a timestamp into a relative time string (e.g., "2d 4h").
 * @param {number} timestamp - The target timestamp.
 * @returns {string} The relative time string.
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = timestamp - now
  
  if (diff <= 0) return 'Now'
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

/**
 * Converts block heights to an approximate human-readable time duration.
 * @param {number} blocks - The number of blocks.
 * @returns {string} The approximate duration.
 */
export const blocksToTime = (blocks) => {
  const minutes = blocks * 10
  const hours = minutes / 60
  const days = hours / 24
  const weeks = days / 7
  
  if (weeks >= 1) return `${Math.round(weeks)} week${weeks >= 2 ? 's' : ''}`
  if (days >= 1) return `${Math.round(days)} day${days >= 2 ? 's' : ''}`
  if (hours >= 1) return `${Math.round(hours)} hour${hours >= 2 ? 's' : ''}`
  return `${Math.round(minutes)} min`
}

export const STRATEGY_NAMES = {
  1: 'Conservative',
  2: 'Balanced',
  3: 'Aggressive'
}

export const STRATEGY_COLORS = {
  1: 'vault-conservative',
  2: 'vault-balanced',
  3: 'vault-aggressive'
}

/**
 * Gets the display name for a vault strategy.
 * @param {number|string} strategyId - The ID of the strategy.
 * @returns {string} The strategy name.
 */
export const getStrategyName = (strategyId) => {
  return STRATEGY_NAMES[strategyId] || 'Unknown'
}

/**
 * Gets the color class associated with a vault strategy.
 * @param {number|string} strategyId - The ID of the strategy.
 * @returns {string} The CSS class name.
 */
export const getStrategyColor = (strategyId) => {
  return STRATEGY_COLORS[strategyId] || 'stacks-purple'
}

/**
 * Calculates the compounded APY.
 * @param {number} baseAPY - The base annual percentage yield.
 * @param {number} compoundFrequency - Compound periods per year.
 * @returns {number} The effective APY.
 */
export const calculateCompoundAPY = (baseAPY, compoundFrequency = 365) => {
  const rate = baseAPY / 100
  const compoundedRate = Math.pow(1 + rate / compoundFrequency, compoundFrequency) - 1
  return compoundedRate * 100
}

/**
 * Validates a numerical amount within limits.
 * @param {number|string} amount - The amount to validate.
 * @param {number} min - Minimum allowed amount.
 * @param {number} max - Maximum allowed amount.
 * @returns {Object} Validation result {valid, error}.
 */
export const validateAmount = (amount, min = 0, max = Infinity) => {
  const num = parseFloat(amount)
  if (isNaN(num)) return { valid: false, error: 'Invalid amount' }
  if (num < min) return { valid: false, error: `Minimum is ${min} STX` }
  if (num > max) return { valid: false, error: `Maximum is ${max} STX` }
  return { valid: true, error: null }
}

export const FEES = {
  DEPOSIT: 50,      // 0.5%
  WITHDRAWAL: 50,   // 0.5%
  EMERGENCY: 500,   // 5%
  PERFORMANCE: 1000, // 10%
  REFERRAL: 25      // 0.25%
}

/**
 * Calculates a fee amount for a given transaction.
 * @param {number} amount - The transaction amount.
 * @param {string} feeType - The type of fee (DEPOSIT, WITHDRAWAL, etc).
 * @returns {number} The calculated fee.
 */
export const calculateFee = (amount, feeType) => {
  const feeBps = FEES[feeType] || 0
  return (amount * feeBps) / 10000
}

/**
 * Calculates the net amount after fee deduction.
 */
export const calculateNetAmount = (amount, feeType) => {
  const fee = calculateFee(amount, feeType)
  return amount - fee
}

/**
 * Generates a referral URL for a given code.
 */
export const generateReferralURL = (code) => {
  const baseURL = window.location.origin
  return `${baseURL}?ref=${encodeURIComponent(code)}`
}

/**
 * Parses the referral code from the current URL.
 */
export const parseReferralFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}

/**
 * Safely copies text to the system clipboard.
 * @param {string} text - The text to copy.
 * @returns {Promise<boolean>} True if successful.
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    return false
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * Local storage abstraction with safe JSON parsing and error handling.
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item)
    } catch (e) {
      console.warn(`Local storage GET error for key "${key}":`, e)
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error(`Local storage SET error for key "${key}":`, e)
      return false
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error(`Local storage REMOVE error for key "${key}":`, e)
      return false
    }
  }
}

/**
 * Debounces a function call.
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Validates a Stacks wallet address format.
 */
export const isValidStacksAddress = (address) => {
  if (!address) return false
  const mainnetRegex = /^SP[0-9A-HJ-NP-Za-km-z]{38}$/
  const testnetRegex = /^ST[0-9A-HJ-NP-Za-km-z]{38}$/
  return mainnetRegex.test(address) || testnetRegex.test(address)
}

/**
 * Validates an email address format.
 */
export const isValidEmail = (email) => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a referral code format.
 */
export const isValidReferralCode = (code) => {
  if (!code) return false
  const codeRegex = /^[a-zA-Z0-9_-]{3,30}$/
  return codeRegex.test(code)
}

/**
 * Sanitizes an input string to prevent basic XSS or injection.
 */
export const sanitizeInput = (input) => {
  if (!input) return ''
  return input.replace(/[<>"']/g, '')
}

/**
 * Parses readable error messages from complex error objects.
 */
export const parseTransactionError = (error) => {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error
  if (error.message) return error.message
  if (error.reason) return error.reason
  return 'Transaction failed'
}


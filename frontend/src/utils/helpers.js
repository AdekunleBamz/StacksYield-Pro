// Format STX amount from microSTX
export const formatSTX = (microSTX) => {
  const stx = microSTX / 1000000
  return stx.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })
}

// Convert STX to microSTX
export const toMicroSTX = (stx) => {
  return Math.floor(parseFloat(stx) * 1000000)
}

// Convert microSTX to STX
export const fromMicroSTX = (microSTX) => {
  return microSTX / 1000000
}

// Truncate address for display
export const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

// Format large numbers (TVL, etc.)
export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

// Format percentage
export const formatPercent = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`
}

// Format date from timestamp
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format relative time
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

// Convert blocks to approximate time (assuming ~10 min per block on Stacks)
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

// Strategy names
export const STRATEGY_NAMES = {
  1: 'Conservative',
  2: 'Balanced',
  3: 'Aggressive'
}

// Strategy colors
export const STRATEGY_COLORS = {
  1: 'vault-conservative',
  2: 'vault-balanced',
  3: 'vault-aggressive'
}

// Get strategy name
export const getStrategyName = (strategyId) => {
  return STRATEGY_NAMES[strategyId] || 'Unknown'
}

// Get strategy color class
export const getStrategyColor = (strategyId) => {
  return STRATEGY_COLORS[strategyId] || 'stacks-purple'
}

// Calculate APY with compound interest
export const calculateCompoundAPY = (baseAPY, compoundFrequency = 365) => {
  const rate = baseAPY / 100
  const compoundedRate = Math.pow(1 + rate / compoundFrequency, compoundFrequency) - 1
  return compoundedRate * 100
}

// Validate STX amount
export const validateAmount = (amount, min = 0, max = Infinity) => {
  const num = parseFloat(amount)
  if (isNaN(num)) return { valid: false, error: 'Invalid amount' }
  if (num < min) return { valid: false, error: `Minimum is ${min} STX` }
  if (num > max) return { valid: false, error: `Maximum is ${max} STX` }
  return { valid: true, error: null }
}

// Fee calculations (basis points)
export const FEES = {
  DEPOSIT: 50,      // 0.5%
  WITHDRAWAL: 50,   // 0.5%
  EMERGENCY: 500,   // 5%
  PERFORMANCE: 1000, // 10%
  REFERRAL: 25      // 0.25%
}

// Calculate fee amount
export const calculateFee = (amount, feeType) => {
  const feeBps = FEES[feeType] || 0
  return (amount * feeBps) / 10000
}

// Calculate net amount after fee
export const calculateNetAmount = (amount, feeType) => {
  const fee = calculateFee(amount, feeType)
  return amount - fee
}

// Generate share URL with referral code
export const generateReferralURL = (code) => {
  const baseURL = window.location.origin
  return `${baseURL}?ref=${encodeURIComponent(code)}`
}

// Parse referral code from URL
export const parseReferralFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('ref')
}

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage error:', e)
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Storage error:', e)
    }
  }
}

// Debounce function
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

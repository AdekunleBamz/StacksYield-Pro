/**
 * APY Calculator Utilities
 * For calculating yield projections
 */

/**
 * Calculate simple interest
 */
export const calculateSimpleInterest = (principal, rate, time) => {
  return principal * (1 + rate * time)
}

/**
 * Calculate compound interest (APY)
 */
export const calculateCompoundInterest = (principal, apy, periods = 12) => {
  return principal * Math.pow(1 + apy / 100 / periods, periods)
}

/**
 * Calculate daily yield
 */
export const calculateDailyYield = (principal, apy) => {
  return (principal * apy / 100) / 365
}

/**
 * Calculate monthly yield
 */
export const calculateMonthlyYield = (principal, apy) => {
  return (principal * apy / 100) / 12
}

/**
 * Calculate yearly yield
 */
export const calculateYearlyYield = (principal, apy) => {
  return principal * apy / 100
}

/**
 * Calculate lock period multiplier
 */
export const getLockPeriodMultiplier = (days) => {
  const multipliers = {
    7: 1.0,
    14: 1.2,
    30: 1.5
  }
  return multipliers[days] || 1.0
}

/**
 * Calculate referral bonus
 */
export const calculateReferralBonus = (amount, bonusRate = 0.25) => {
  return amount * bonusRate / 100
}

/**
 * Calculate early withdrawal penalty
 */
export const calculateEarlyWithdrawalPenalty = (amount, penaltyRate = 5) => {
  return amount * penaltyRate / 100
}

/**
 * Format APY display
 */
export const formatAPY = (apy) => {
  return `${apy.toFixed(2)}%`
}

/**
 * Analytics tracking for StacksYield Pro
 * Tracks user interactions and transaction events
 */

const ANALYTICS_ENDPOINT = '/api/analytics'

export const trackEvent = async (eventName, properties = {}) => {
  const event = {
    name: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }
  }
  
  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })
  } catch (e) {
    console.warn('Analytics tracking failed:', e)
  }
}

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page: pageName })
}

export const trackWalletConnect = (walletType) => {
  trackEvent('wallet_connected', { wallet: walletType })
}

export const trackDeposit = (amount, strategy) => {
  trackEvent('deposit', { amount, strategy })
}

export const trackWithdraw = (amount, strategy) => {
  trackEvent('withdraw', { amount, strategy })
}

export const trackReferral = (code) => {
  trackEvent('referral_used', { code })
}

export const trackError = (errorType, message) => {
  trackEvent('error', { type: errorType, message })
}

/**
 * Pure WalletConnect v2 implementation using @walletconnect/universal-provider
 * No Reown/AppKit abstractions - direct WalletConnect for Stacks
 */
import UniversalProvider from '@walletconnect/universal-provider'

const PROJECT_ID = String(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '').trim()
const RELAY_URL = import.meta.env.VITE_WALLETCONNECT_RELAY_URL || 'wss://relay.walletconnect.com'
const WC_DEBUG = String(import.meta.env.VITE_DEBUG || '').toLowerCase() === 'true' || import.meta.env.DEV

if (!PROJECT_ID) {
  console.error('Missing VITE_WALLETCONNECT_PROJECT_ID in environment variables')
}

// CAIP-2 chain identifier for Stacks Mainnet
const STACKS_CHAIN_ID = 'stacks:1'

// Stacks JSON-RPC methods supported by wallets
const STACKS_METHODS = [
  'stx_getAddresses',
  'stx_signTransaction',
  'stx_signMessage',
  'stx_callContract',
  'stx_transferStx',
  'stx_signStructuredMessage',
]

// Stacks events
const STACKS_EVENTS = ['stx_accountsChanged', 'chainChanged']

// Singleton provider instance
let provider = null
let currentSession = null

/**
 * Initialize and get the UniversalProvider instance
 */
export async function getProvider() {
  if (provider) return provider

  if (!PROJECT_ID) {
    throw new Error('WalletConnect Project ID is required. Set VITE_WALLETCONNECT_PROJECT_ID in .env')
  }

  const appUrl = window.location.origin
  const iconUrl = `${appUrl}/logo.svg`

  if (WC_DEBUG) {
    console.debug('[WalletConnect] Initializing UniversalProvider...', { projectId: PROJECT_ID.slice(0, 8) + '...' })
  }

  provider = await UniversalProvider.init({
    projectId: PROJECT_ID,
    relayUrl: RELAY_URL,
    metadata: {
      name: 'StacksYield Pro',
      description: 'Yield Aggregator & Auto-Compounding Vault System on Stacks',
      url: appUrl,
      icons: [iconUrl],
    },
  })

  // Listen for session events
  provider.on('session_delete', () => {
    if (WC_DEBUG) console.debug('[WalletConnect] Session deleted')
    currentSession = null
  })

  provider.on('session_expire', () => {
    if (WC_DEBUG) console.debug('[WalletConnect] Session expired')
    currentSession = null
  })

  provider.on('display_uri', (uri) => {
    if (WC_DEBUG) console.debug('[WalletConnect] Display URI:', uri)
  })

  if (WC_DEBUG) {
    console.debug('[WalletConnect] UniversalProvider initialized successfully')
  }

  return provider
}

/**
 * Subscribe to display_uri event to show QR code
 */
export async function wcOnDisplayUri(callback) {
  const p = await getProvider()
  
  const handler = (uri) => {
    if (WC_DEBUG) console.debug('[WalletConnect] URI received:', uri?.slice(0, 50) + '...')
    callback(uri)
  }
  
  p.on('display_uri', handler)
  
  return () => {
    p.off('display_uri', handler)
  }
}

/**
 * Connect to a Stacks wallet via WalletConnect
 * Uses requiredNamespaces as per the guide to ensure QR is not blank
 */
export async function wcConnect() {
  const p = await getProvider()

  if (WC_DEBUG) {
    console.debug('[WalletConnect] Connecting with REQUIRED namespaces for Stacks...')
  }

  try {
    // Connect with REQUIRED Stacks namespace (not optional)
    // Per guide: optional-only negotiation causes "modal opens, QR blank"
    currentSession = await p.connect({
      requiredNamespaces: {
        stacks: {
          methods: STACKS_METHODS,
          chains: [STACKS_CHAIN_ID],
          events: STACKS_EVENTS,
        },
      },
    })

    if (!currentSession) {
      throw new Error('Failed to establish WalletConnect session')
    }

    if (WC_DEBUG) {
      console.debug('[WalletConnect] Session established:', {
        topic: currentSession.topic,
        accounts: currentSession.namespaces?.stacks?.accounts,
      })
    }

    return { session: currentSession }
  } catch (error) {
    console.error('[WalletConnect] Connection failed:', error)
    throw error
  }
}

/**
 * Get Stacks address from session
 */
export function getStacksAddressFromSession(session) {
  const s = session || currentSession
  if (!s?.namespaces?.stacks?.accounts?.length) return null
  
  // Account format: stacks:1:SP... or stacks:mainnet:SP...
  const account = s.namespaces.stacks.accounts[0]
  const parts = account.split(':')
  return parts.length >= 3 ? parts[2] : parts[parts.length - 1]
}

/**
 * Check if there's an active session
 */
export async function wcHasActiveSession() {
  const p = await getProvider()
  return !!p.session
}

/**
 * Get current session
 */
export async function wcGetSession() {
  const p = await getProvider()
  return p.session || currentSession
}

/**
 * Make a JSON-RPC request to the connected wallet
 */
export async function wcRequest(method, params = {}) {
  const p = await getProvider()
  
  if (!p.session) {
    throw new Error('No active WalletConnect session. Please connect your wallet first.')
  }

  if (WC_DEBUG) {
    console.debug(`[WalletConnect] Request: ${method}`, params)
  }

  try {
    const result = await p.request({
      method,
      params,
    }, STACKS_CHAIN_ID)

    if (WC_DEBUG) {
      console.debug(`[WalletConnect] Response:`, result)
    }

    return result
  } catch (error) {
    console.error(`[WalletConnect] Request failed: ${method}`, error)
    throw error
  }
}

/**
 * Get wallet addresses
 */
export async function wcGetAddresses() {
  const result = await wcRequest('stx_getAddresses', {})
  return result?.addresses || []
}

/**
 * Call a smart contract
 */
export async function wcCallContract(payload) {
  return wcRequest('stx_callContract', payload)
}

/**
 * Sign a transaction
 */
export async function wcSignTransaction(payload) {
  return wcRequest('stx_signTransaction', payload)
}

/**
 * Transfer STX
 */
export async function wcTransferStx(payload) {
  return wcRequest('stx_transferStx', payload)
}

/**
 * Sign a message
 */
export async function wcSignMessage(payload) {
  return wcRequest('stx_signMessage', payload)
}

/**
 * Disconnect the current session
 */
export async function wcDisconnect() {
  const p = await getProvider()
  
  if (p.session) {
    try {
      await p.disconnect()
      if (WC_DEBUG) console.debug('[WalletConnect] Disconnected')
    } catch (error) {
      console.error('[WalletConnect] Disconnect error:', error)
    }
  }
  
  currentSession = null
}

export { STACKS_CHAIN_ID, STACKS_METHODS }

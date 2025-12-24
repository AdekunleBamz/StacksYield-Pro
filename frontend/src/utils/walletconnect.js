import { UniversalConnector } from '@reown/appkit-universal-connector'

const PROJECT_ID = String(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '').trim()
const WC_DEBUG = String(import.meta.env.VITE_DEBUG || '').toLowerCase() === 'true' || import.meta.env.DEV

// CRITICAL: Use CAIP-2 chain ID format - 'stacks:mainnet'
const STACKS_CHAIN = 'stacks:mainnet'

const DEFAULT_REQUEST_TIMEOUT_MS = 60_000

// ALL methods we need - defined ONCE and used ONLY in connect()
const STACKS_METHODS = [
  'stx_getAddresses',
  'stx_signTransaction',
  'stx_signMessage',
  'stx_callContract',
  'stx_transferStx',
  'stx_signStructuredMessage',
]

// Events we listen to
const STACKS_EVENTS = ['stx_accountsChanged']

// Singleton - NEVER recreate on each render
let universalConnectorInstance = null
let initPromise = null

export async function getUniversalConnector() {
  if (!PROJECT_ID) {
    throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID')
  }

  // Return existing instance if available
  if (universalConnectorInstance) {
    return universalConnectorInstance
  }

  // Prevent multiple simultaneous initializations
  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    if (WC_DEBUG) {
      console.debug('[WalletConnect] Initializing...', {
        origin: window.location.origin,
        projectIdPrefix: `${PROJECT_ID.slice(0, 6)}…`,
      })
    }

    // CRITICAL: Metadata must be valid HTTPS URLs
    const appUrl = window.location.origin
    const iconUrl = `${appUrl}/logo.svg`

    // CRITICAL: networks is REQUIRED for UniversalConnector bootstrapping
    // BUT it must use CAIP strings and MATCH connect() namespaces EXACTLY
    universalConnectorInstance = await UniversalConnector.init({
      projectId: PROJECT_ID,
      metadata: {
        name: 'StacksYield Pro',
        description: 'Yield Aggregator & Auto-Compounding Vault System',
        url: appUrl,
        icons: [iconUrl],
      },
      // REQUIRED: Must match requiredNamespaces in connect() EXACTLY
      networks: [
        {
          namespace: 'stacks',
          chains: [STACKS_CHAIN],    // CAIP string: 'stacks:mainnet'
          methods: STACKS_METHODS,   // Same methods as connect()
          events: STACKS_EVENTS,     // Same events as connect()
        },
      ],
    })

    if (WC_DEBUG) {
      console.debug('[WalletConnect] Initialized successfully')
    }

    return universalConnectorInstance
  })()

  return initPromise
}

export function getStacksAddressFromSession(session) {
  const account = session?.namespaces?.stacks?.accounts?.[0]
  // CAIP-25 format: stacks:mainnet:SP....
  if (!account) return null
  const parts = account.split(':')
  return parts.length >= 3 ? parts[2] : parts[parts.length - 1]
}

/**
 * Verify that a session has the required Stacks namespace
 */
export function isValidStacksSession(session) {
  if (!session) return false
  const stacksNs = session?.namespaces?.stacks
  if (!stacksNs) {
    console.warn('[WalletConnect] Session missing stacks namespace:', session)
    return false
  }
  if (!stacksNs.accounts?.length) {
    console.warn('[WalletConnect] Session has no stacks accounts:', stacksNs)
    return false
  }
  return true
}

export async function wcConnect() {
  const connector = await getUniversalConnector()

  // CRITICAL: This is the ONLY place namespaces are defined
  // Must use CAIP chain strings, not objects
  const requiredNamespaces = {
    stacks: {
      methods: STACKS_METHODS,
      chains: [STACKS_CHAIN], // 'stacks:mainnet'
      events: STACKS_EVENTS,  // ['stx_accountsChanged']
    },
  }

  if (WC_DEBUG) {
    console.debug('[WalletConnect] Connecting with namespaces:', requiredNamespaces)
  }

  // CRITICAL: await the connect call
  const result = await connector.connect({ requiredNamespaces })
  const { session } = result

  // Verify session was actually established
  if (!isValidStacksSession(session)) {
    console.error('[WalletConnect] Session not valid after connect:', session)
    throw new Error('WalletConnect session was not established. Please try again.')
  }

  if (WC_DEBUG) {
    console.debug('[WalletConnect] Session established:', {
      topic: session?.topic,
      namespaces: Object.keys(session?.namespaces || {}),
      accounts: session?.namespaces?.stacks?.accounts,
    })
  }

  return { connector, session }
}

export async function wcOnDisplayUri(callback) {
  const connector = await getUniversalConnector()

  let stopped = false
  let unsubscribe = () => {}

  const trySubscribe = () => {
    const provider = connector?.provider
    const on = provider?.on?.bind(provider)
    const off = provider?.off?.bind(provider)

    if (!on || stopped) return false

    const handler = (uri) => {
      if (WC_DEBUG) {
        // eslint-disable-next-line no-console
        console.debug('[WalletConnect] display_uri received')
      }
      callback(uri)
    }

    on('display_uri', handler)
    unsubscribe = () => {
      stopped = true
      if (off) off('display_uri', handler)
    }
    return true
  }

  // Provider may not be fully ready at the moment this is called.
  if (!trySubscribe()) {
    const startedAt = Date.now()
    const interval = setInterval(() => {
      if (stopped) {
        clearInterval(interval)
        return
      }
      if (trySubscribe() || Date.now() - startedAt > 3000) {
        clearInterval(interval)
      }
    }, 50)

    unsubscribe = () => {
      stopped = true
      clearInterval(interval)
    }
  }

  return () => unsubscribe()
}

export async function wcDisconnect() {
  const connector = await getUniversalConnector()
  await connector.disconnect()
}

/**
 * Check if there's an active WalletConnect session
 */
export async function wcHasActiveSession() {
  try {
    const connector = await getUniversalConnector()
    // UniversalConnector exposes session info via provider or getSession
    const session = connector?.provider?.session || connector?.session
    return !!session?.topic
  } catch {
    return false
  }
}

/**
 * Get the current session topic (needed for some operations)
 */
export async function wcGetSession() {
  const connector = await getUniversalConnector()
  return connector?.provider?.session || connector?.session || null
}

export async function wcRequest(method, params = {}) {
  const connector = await getUniversalConnector()
  if (!connector?.request) {
    throw new Error('WalletConnect provider not initialized')
  }

  // Check if session is still active before making request
  const hasSession = await wcHasActiveSession()
  if (!hasSession) {
    throw new Error('WalletConnect session expired. Please reconnect your wallet.')
  }

  if (WC_DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(`[WalletConnect] Sending ${method}`, params)
  }

  return connector.request({ method, params }, STACKS_CHAIN)
}

export async function wcRequestWithTimeout(method, params = {}, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  let timeoutId
  try {
    return await Promise.race([
      wcRequest(method, params),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${method} timed out`)), timeoutMs)
      }),
    ])
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function wcGetAddresses() {
  const res = await wcRequestWithTimeout('stx_getAddresses', {}, 15_000)
  // Some wallets may include extra fields like publicKey; preserve them.
  return res?.addresses || []
}

export async function wcCallContract({ contract, functionName, functionArgs }) {
  return wcRequestWithTimeout('stx_callContract', { contract, functionName, functionArgs })
}

export async function wcSignTransaction({ transaction, broadcast = false, network = 'mainnet' }) {
  return wcRequestWithTimeout('stx_signTransaction', { transaction, broadcast, network })
}

export async function wcTransferStx({ sender, recipient, amount, memo = '', network = 'mainnet' }) {
  return wcRequestWithTimeout('stx_transferStx', { sender, recipient, amount, memo, network })
}

import UniversalProvider from '@walletconnect/universal-provider'

/* ============================================================================
 * ENV
 * ========================================================================== */

const PROJECT_ID = String(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '').trim()
const RELAY_URL = String(import.meta.env.VITE_WALLETCONNECT_RELAY_URL || '').trim()
const DEBUG = import.meta.env.DEV

if (!PROJECT_ID) {
  throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID')
}

/* ============================================================================
 * CONSTANTS
 * ========================================================================== */

// CAIP-2 chain id for Stacks Mainnet
const STACKS_CHAIN_ID = 'stacks:1'

// WalletConnect Stacks RPC methods
const STACKS_METHODS = [
  'stx_getAddresses',
  'stx_signTransaction',
  'stx_signMessage',
  'stx_signStructuredMessage',
  'stx_callContract',
  'stx_transferStx',
]

// WalletConnect Stacks events
const STACKS_EVENTS = ['stx_accountsChanged']

/* ============================================================================
 * SINGLETON
 * ========================================================================== */

let provider: UniversalProvider | null = null
let initPromise: Promise<UniversalProvider> | null = null

async function initProvider(): Promise<UniversalProvider> {
  if (provider) return provider
  if (initPromise) return initPromise

  initPromise = (async () => {
    const appUrl = window.location.origin
    const iconUrl = `${appUrl}/logo.svg`

    if (DEBUG) console.log('[WC] Initializing provider')

    provider = await UniversalProvider.init({
      projectId: PROJECT_ID,
      relayUrl: RELAY_URL || undefined,
      metadata: {
        name: 'StacksYield Pro',
        description: 'Yield Aggregator & Auto-Compounding Vault System',
        url: appUrl,
        icons: [iconUrl],
      },
    })

    if (DEBUG) console.log('[WC] Provider ready')

    return provider
  })()

  return initPromise
}

/* ============================================================================
 * SESSION HELPERS
 * ========================================================================== */

export async function wcGetSession() {
  const p = await initProvider()
  return p.session ?? null
}

export function getStacksAddressFromSession(session: any): string | null {
  const account = session?.namespaces?.stacks?.accounts?.[0]
  if (!account) return null
  // CAIP-25: stacks:1:SPxxxx
  return account.split(':')[2] ?? null
}

export function isValidStacksSession(session: any): boolean {
  return Boolean(session?.namespaces?.stacks?.accounts?.length)
}

/* ============================================================================
 * CONNECT / DISCONNECT
 * ========================================================================== */

export async function wcConnect() {
  const p = await initProvider()

  if (DEBUG) console.log('[WC] Connecting...')

  const { session } = await p.connect({
    optionalNamespaces: {
      stacks: {
        chains: [STACKS_CHAIN_ID],
        methods: STACKS_METHODS,
        events: STACKS_EVENTS,
      },
    },
  })

  if (!isValidStacksSession(session)) {
    throw new Error('WalletConnect session invalid or rejected')
  }

  if (DEBUG) {
    console.log('[WC] Connected', {
      topic: session.topic,
      accounts: session.namespaces.stacks.accounts,
    })
  }

  return {
    session,
    address: getStacksAddressFromSession(session),
  }
}

export async function wcDisconnect() {
  const p = await initProvider()
  if (p.session) {
    await p.disconnect()
    if (DEBUG) console.log('[WC] Disconnected')
  }
}

/* ============================================================================
 * REQUESTS (CORE)
 * ========================================================================== */

async function wcRequest(method: string, params: any = {}) {
  const p = await initProvider()
  const session = p.session

  if (!session?.topic) {
    throw new Error('No active WalletConnect session')
  }

  if (DEBUG) console.log(`[WC] Request → ${method}`, params)

  return p.request({
    topic: session.topic,
    chainId: STACKS_CHAIN_ID,
    request: {
      method,
      params,
    },
  })
}

/* ============================================================================
 * STACKS API
 * ========================================================================== */

export async function wcGetAddresses() {
  const res = await wcRequest('stx_getAddresses')
  return res?.addresses ?? []
}

export async function wcSignMessage(message: string) {
  return wcRequest('stx_signMessage', { message })
}

export async function wcSignTransaction(transaction: string, broadcast = false) {
  return wcRequest('stx_signTransaction', {
    transaction,
    broadcast,
    network: 'mainnet',
  })
}

export async function wcTransferStx({
  sender,
  recipient,
  amount,
  memo = '',
}: {
  sender: string
  recipient: string
  amount: string
  memo?: string
}) {
  return wcRequest('stx_transferStx', {
    sender,
    recipient,
    amount,
    memo,
    network: 'mainnet',
  })
}

export async function wcCallContract({
  contract,
  functionName,
  functionArgs,
}: {
  contract: string
  functionName: string
  functionArgs: any[]
}) {
  return wcRequest('stx_callContract', {
    contract,
    functionName,
    functionArgs,
  })
}

/* ============================================================================
 * DISPLAY URI (QR CODE)
 * ========================================================================== */

export async function wcOnDisplayUri(callback: (uri: string) => void) {
  const p = await initProvider()

  const handler = (uri: string) => {
    if (DEBUG) console.log('[WC] display_uri')
    callback(uri)
  }

  p.on('display_uri', handler)

  return () => {
    p.off('display_uri', handler)
  }
}

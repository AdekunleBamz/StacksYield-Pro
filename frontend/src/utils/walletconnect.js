import { UniversalConnector } from '@reown/appkit-universal-connector'

const PROJECT_ID = String(import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '').trim()
const WC_DEBUG = String(import.meta.env.VITE_DEBUG || '').toLowerCase() === 'true' || import.meta.env.DEV

const stacksMainnet = {
  id: 'stacks-mainnet',
  chainNamespace: 'stacks',
  caipNetworkId: 'stacks:1',
  name: 'Stacks Mainnet',
  nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
  rpcUrls: { default: { http: ['https://stacks-node-api.mainnet.stacks.co'] } },
}

const STACKS_CHAIN = 'stacks:1'

// WalletConnect v2 sessions can be restrictive: some wallets will only allow
// requests that were declared in `requiredNamespaces`.
// Include the methods we might call during normal app usage.
const REQUIRED_METHODS = ['stx_getAddresses', 'stx_signTransaction', 'stx_callContract', 'stx_transferStx']

let universalConnectorPromise = null

export async function getUniversalConnector() {
  if (!PROJECT_ID) {
    throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID')
  }

  if (!universalConnectorPromise) {
    if (WC_DEBUG) {
      // eslint-disable-next-line no-console
      console.debug('[WalletConnect] init', {
        origin: window.location.origin,
        projectIdPrefix: `${PROJECT_ID.slice(0, 6)}…`,
        chain: STACKS_CHAIN,
      })
    }

    universalConnectorPromise = UniversalConnector.init({
      projectId: PROJECT_ID,
      metadata: {
        name: 'StacksYield Pro',
        description: 'Connect to StacksYield Pro with WalletConnect',
        url: window.location.origin,
        icons: [new URL('/logo.svg', window.location.origin).toString()],
      },
      networks: [
        {
          namespace: 'stacks',
          chains: [stacksMainnet],
          methods: [
            'stx_getAddresses',
            'stx_transferStx',
            'stx_signTransaction',
            'stx_signMessage',
            'stx_signStructuredMessage',
            'stx_callContract',
          ],
          events: ['stx_chainChanged', 'stx_accountsChanged'],
        },
      ],
    })
  }

  return universalConnectorPromise
}

export function getStacksAddressFromSession(session) {
  const account = session?.namespaces?.stacks?.accounts?.[0]
  // CAIP-25 format: stacks:1:SP....
  return account ? account.split(':')[2] : null
}

export async function wcConnect() {
  const connector = await getUniversalConnector()
  // Stacks wallets commonly require a REQUIRED namespace to be present.
  const requiredNamespaces = {
    stacks: {
      methods: REQUIRED_METHODS,
      chains: [STACKS_CHAIN],
      events: [],
    },
  }

  const { session } = await connector.connect({ requiredNamespaces })
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

export async function wcRequest(method, params = {}) {
  const connector = await getUniversalConnector()
  if (!connector?.request) {
    throw new Error('WalletConnect provider not initialized')
  }
  return connector.request({ method, params }, STACKS_CHAIN)
}

export async function wcGetAddresses() {
  const res = await wcRequest('stx_getAddresses', {})
  // Some wallets may include extra fields like publicKey; preserve them.
  return res?.addresses || []
}

export async function wcCallContract({ contract, functionName, functionArgs }) {
  return wcRequest('stx_callContract', { contract, functionName, functionArgs })
}

export async function wcSignTransaction({ transaction, broadcast = true, network = 'mainnet' }) {
  return wcRequest('stx_signTransaction', { transaction, broadcast, network })
}

export async function wcTransferStx({ sender, recipient, amount, memo = '', network = 'mainnet' }) {
  return wcRequest('stx_transferStx', { sender, recipient, amount, memo, network })
}

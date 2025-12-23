import { UniversalConnector } from '@reown/appkit-universal-connector'

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const stacksMainnet = {
  id: 'stacks-mainnet',
  chainNamespace: 'stacks',
  caipNetworkId: 'stacks:1',
  name: 'Stacks Mainnet',
  nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
  rpcUrls: { default: { http: ['https://stacks-node-api.mainnet.stacks.co'] } },
}

let universalConnectorPromise = null

export async function getUniversalConnector() {
  if (!PROJECT_ID) {
    throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID')
  }

  if (!universalConnectorPromise) {
    universalConnectorPromise = UniversalConnector.init({
      projectId: PROJECT_ID,
      metadata: {
        name: 'StacksYield Pro',
        description: 'Connect to StacksYield Pro with WalletConnect',
        url: window.location.origin,
        icons: [`${window.location.origin}/logo.svg`],
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
  const { session } = await connector.connect()
  return { connector, session }
}

export async function wcOnDisplayUri(callback) {
  const connector = await getUniversalConnector()

  const provider = connector?.provider
  const on = provider?.on?.bind(provider)
  const off = provider?.off?.bind(provider)

  if (!on) {
    return () => {}
  }

  const handler = (uri) => callback(uri)
  on('display_uri', handler)
  return () => {
    if (off) off('display_uri', handler)
  }
}

export async function wcDisconnect() {
  const connector = await getUniversalConnector()
  await connector.disconnect()
}

export async function wcRequest(method, params = {}) {
  const connector = await getUniversalConnector()
  if (!connector?.provider?.request) {
    throw new Error('WalletConnect provider not initialized')
  }
  return connector.provider.request({ method, params })
}

export async function wcGetAddresses() {
  const res = await wcRequest('stx_getAddresses', {})
  return res?.addresses || []
}

export async function wcCallContract({ contract, functionName, functionArgs }) {
  return wcRequest('stx_callContract', { contract, functionName, functionArgs })
}

export async function wcTransferStx({ sender, recipient, amount, memo = '', network = 'mainnet' }) {
  return wcRequest('stx_transferStx', { sender, recipient, amount, memo, network })
}

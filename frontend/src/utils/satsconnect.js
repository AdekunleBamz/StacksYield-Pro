/**
 * Sats Connect integration for Xverse wallet
 * This is Xverse's official library and works better than generic WalletConnect
 */
import { request, AddressPurpose, RpcErrorCode } from 'sats-connect'

const DEBUG = import.meta.env.DEV

/**
 * Get wallet addresses (Stacks + Bitcoin)
 */
export async function getAccounts() {
  try {
    const response = await request('getAccounts', {
      purposes: [AddressPurpose.Stacks, AddressPurpose.Payment],
      message: 'StacksYield Pro needs access to your wallet',
    })

    if (DEBUG) console.log('[SatsConnect] getAccounts response:', response)

    if (response.status === 'success') {
      return response.result
    }

    throw new Error(response.error?.message || 'Failed to get accounts')
  } catch (err) {
    console.error('[SatsConnect] getAccounts error:', err)
    throw err
  }
}

/**
 * Call a Stacks smart contract
 */
export async function callContract({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  postConditions = [],
  postConditionMode = 'deny',
  network = 'mainnet',
}) {
  try {
    if (DEBUG) {
      console.log('[SatsConnect] callContract:', {
        contractAddress,
        contractName,
        functionName,
        functionArgs,
      })
    }

    const response = await request('stx_callContract', {
      contract: `${contractAddress}.${contractName}`,
      functionName,
      arguments: functionArgs, // Should be hex-encoded Clarity values
      network,
      postConditions,
      postConditionMode,
    })

    if (DEBUG) console.log('[SatsConnect] callContract response:', response)

    if (response.status === 'success') {
      return response.result
    }

    // Handle user rejection
    if (response.error?.code === RpcErrorCode.USER_REJECTION) {
      throw new Error('Transaction cancelled by user')
    }

    throw new Error(response.error?.message || 'Contract call failed')
  } catch (err) {
    console.error('[SatsConnect] callContract error:', err)
    throw err
  }
}

/**
 * Sign a transaction
 */
export async function signTransaction({
  transaction,
  broadcast = true,
  network = 'mainnet',
}) {
  try {
    if (DEBUG) console.log('[SatsConnect] signTransaction:', { broadcast, network })

    const response = await request('stx_signTransaction', {
      transaction,
      broadcast,
      network,
    })

    if (DEBUG) console.log('[SatsConnect] signTransaction response:', response)

    if (response.status === 'success') {
      return response.result
    }

    if (response.error?.code === RpcErrorCode.USER_REJECTION) {
      throw new Error('Transaction cancelled by user')
    }

    throw new Error(response.error?.message || 'Transaction signing failed')
  } catch (err) {
    console.error('[SatsConnect] signTransaction error:', err)
    throw err
  }
}

/**
 * Transfer STX
 */
export async function transferStx({
  recipient,
  amount,
  memo = '',
  network = 'mainnet',
}) {
  try {
    if (DEBUG) console.log('[SatsConnect] transferStx:', { recipient, amount, memo })

    const response = await request('stx_transferStx', {
      recipient,
      amount: String(amount),
      memo,
      network,
    })

    if (DEBUG) console.log('[SatsConnect] transferStx response:', response)

    if (response.status === 'success') {
      return response.result
    }

    if (response.error?.code === RpcErrorCode.USER_REJECTION) {
      throw new Error('Transfer cancelled by user')
    }

    throw new Error(response.error?.message || 'STX transfer failed')
  } catch (err) {
    console.error('[SatsConnect] transferStx error:', err)
    throw err
  }
}

/**
 * Check if Sats Connect is available
 */
export function isSatsConnectAvailable() {
  return typeof window !== 'undefined' && !!window.XverseProviders?.StacksProvider
}

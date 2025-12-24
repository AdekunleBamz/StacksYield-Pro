import React, { useState } from 'react'
import { 
  HiShieldCheck, 
  HiScale, 
  HiFire, 
  HiArrowDown, 
  HiArrowUp,
  HiInformationCircle,
  HiLockClosed,
  HiClock,
  HiCurrencyDollar,
  HiSparkles
} from 'react-icons/hi2'
import { 
  serializeCV,
  uintCV,
  makeUnsignedContractCall,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  AnchorMode,
} from '@stacks/transactions'
import { openContractCall } from '@stacks/connect'
import toast from 'react-hot-toast'
import { useVaults, CONTRACT_ADDRESS, CONTRACT_NAME } from '../hooks/useContract'
import { useWallet } from '../context/WalletContext'
import { toMicroSTX, blocksToTime, formatNumber } from '../utils/helpers'
import { wcCallContract, wcSignTransaction, wcHasActiveSession } from '../utils/walletconnect'
import { callContract as satsCallContract, isSatsConnectAvailable } from '../utils/satsconnect'

const VaultList = () => {
  const { isConnected, connectWallet, address, publicKey, network, wcSession } = useWallet()
  const [selectedVault, setSelectedVault] = useState(null)
  const [actionType, setActionType] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Check if connected via WalletConnect (vs browser extension)
  const isWalletConnectSession = !!wcSession

  const { vaults: contractVaults, loading: vaultsLoading, refetch } = useVaults()

  // Vault metadata (icons, colors, descriptions)
  const vaultMeta = {
    1: {
      icon: HiShieldCheck,
      color: 'conservative',
      bgGradient: 'from-green-500/20 to-green-600/10',
      description: 'Low risk, steady returns. Perfect for long-term holders.',
      features: ['Low volatility', 'Weekly compounds', 'Early exit allowed']
    },
    2: {
      icon: HiScale,
      color: 'balanced',
      bgGradient: 'from-amber-500/20 to-amber-600/10',
      description: 'Moderate risk with optimized returns. Best for most users.',
      features: ['Balanced strategy', 'Bi-weekly compounds', 'Referral bonuses']
    },
    3: {
      icon: HiFire,
      color: 'aggressive',
      bgGradient: 'from-red-500/20 to-red-600/10',
      description: 'High risk, high reward. For experienced DeFi users.',
      features: ['Maximum returns', 'Auto-compound', 'Performance fees']
    }
  }

  // Fallback vaults if contract vaults not initialized yet
  const defaultVaults = [
    {
      id: 1,
      name: 'Conservative Vault',
      strategy: 1,
      apy: 5,
      totalDeposits: 0,
      minDeposit: 1,
      lockPeriod: 1008,
      isActive: true
    },
    {
      id: 2,
      name: 'Balanced Vault',
      strategy: 2,
      apy: 12,
      totalDeposits: 0,
      minDeposit: 10,
      lockPeriod: 2016,
      isActive: true
    },
    {
      id: 3,
      name: 'Aggressive Vault',
      strategy: 3,
      apy: 25,
      totalDeposits: 0,
      minDeposit: 50,
      lockPeriod: 4032,
      isActive: true
    }
  ]

  const vaults = contractVaults.length > 0 ? contractVaults : defaultVaults

  const bytesToHex = (bytes) =>
    Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

  const cvToWcArg = (cv) => `0x${bytesToHex(serializeCV(cv))}`

  const txToHex = (tx) => `0x${bytesToHex(tx.serialize())}`

  const contractId = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`
  // Use Hiro API (browser-compatible with proper CORS and SSL)
  const STACKS_NODE_RPC = 'https://api.mainnet.hiro.so'

  const canBuildAndSign = !!publicKey && !!address

  const withTimeout = async (promise, ms, message) => {
    let timeoutId
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error(message || 'Timed out')), ms)
        }),
      ])
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const strip0x = (hex) => (typeof hex === 'string' && hex.startsWith('0x') ? hex.slice(2) : hex)

  const hexToBytes = (hex) => {
    const clean = strip0x(hex)
    if (!clean || clean.length % 2 !== 0) throw new Error('Invalid hex string')
    const bytes = new Uint8Array(clean.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
    }
    return bytes
  }

  const normalizeSignedTxHex = (result) => {
    if (!result) return null
    if (typeof result === 'string') return result
    return (
      result.transaction ||
      result.txHex ||
      result.signedTx ||
      result.signedTransaction ||
      result.result?.transaction ||
      result.result?.txHex ||
      null
    )
  }

  const normalizeTxId = (result) => {
    if (!result) return null
    if (typeof result === 'string') {
      const clean = strip0x(result)
      return /^[0-9a-fA-F]{64}$/.test(clean) ? clean : null
    }
    return result.txid || result.txId || result.transactionId || null
  }

  const broadcastSignedTx = async (signedTxHex) => {
    const body = hexToBytes(signedTxHex)
    const res = await fetch(`${STACKS_NODE_RPC}/v2/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body,
    })

    const text = await res.text()
    if (!res.ok) {
      throw new Error(text || 'Broadcast failed')
    }

    // stacks-node typically returns the txid as a quoted or raw string
    const txid = (text || '').replace(/(^\s*")|("\s*$)/g, '').trim()
    if (!txid) throw new Error('Broadcast did not return a txid')
    return txid
  }

  /**
   * Route transaction based on connection type:
   * 1. Try Sats Connect (Xverse's native library) - works with WalletConnect
   * 2. Fall back to Stacks Connect for browser extensions
   * 3. Fall back to raw WalletConnect RPC
   */
  const signAndBroadcastOrFallback = async ({ functionName, functionArgs, postConditions, postConditionMode }) => {
    // First try Sats Connect - this is Xverse's official library
    // It handles WalletConnect internally and is much more reliable
    if (isWalletConnectSession || isSatsConnectAvailable()) {
      try {
        console.log('[SatsConnect] Attempting contract call via sats-connect...')
        toast.loading('📱 Opening wallet for approval...', { id: 'wallet-prompt' })

        const result = await satsCallContract({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName,
          functionArgs: functionArgs.map(cvToWcArg),
          postConditionMode: postConditionMode === PostConditionMode.Deny ? 'deny' : 'allow',
        })

        toast.dismiss('wallet-prompt')
        console.log('[SatsConnect] Contract call result:', result)

        // Result should contain txid
        const txid = result?.txid || result?.txId || result
        return { txid: typeof txid === 'string' ? txid : JSON.stringify(txid) }
      } catch (err) {
        toast.dismiss('wallet-prompt')
        console.warn('[SatsConnect] Contract call failed:', err.message)

        // If user cancelled, don't try fallback
        if (err.message?.includes('cancelled') || err.message?.includes('rejected')) {
          throw err
        }

        // Fall through to WalletConnect RPC
        console.log('[SatsConnect] Falling back to WalletConnect RPC...')
      }
    }

    // If connected via WalletConnect, try direct RPC
    if (isWalletConnectSession) {
      return tryWalletConnect({ functionName, functionArgs, postConditions, postConditionMode })
    }

    // Try Stacks Connect for browser extension users
    return new Promise((resolve, reject) => {
      let resolved = false

      const onFinish = (data) => {
        if (resolved) return
        resolved = true
        toast.dismiss('wallet-prompt')
        resolve({ txid: data.txId })
      }

      const onCancel = () => {
        if (resolved) return
        resolved = true
        toast.dismiss('wallet-prompt')
        reject(new Error('Transaction cancelled by user'))
      }

      toast.loading('Opening wallet for approval...', { id: 'wallet-prompt' })

      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        postConditions,
        postConditionMode,
        network,
        appDetails: {
          name: 'StacksYield Pro',
          icon: new URL('/logo.svg', window.location.origin).toString(),
        },
        onFinish,
        onCancel,
      }).catch((err) => {
        if (resolved) return
        resolved = true
        toast.dismiss('wallet-prompt')
        console.warn('Stacks Connect failed, trying WalletConnect...', err)
        
        // Fall back to WalletConnect if Stacks Connect fails (no extension installed)
        tryWalletConnect({ functionName, functionArgs, postConditions, postConditionMode })
          .then(resolve)
          .catch(reject)
      })

      // Timeout after 120 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          toast.dismiss('wallet-prompt')
          reject(new Error('WALLET_TIMEOUT'))
        }
      }, 120_000)
    })
  }

  /**
   * Build Xverse deep link URL for contract call
   * This opens Xverse app directly, bypassing unreliable WalletConnect relay
   */
  const buildXverseDeepLink = ({ functionName, functionArgs }) => {
    // Xverse uses a specific URL scheme for contract calls
    // Format: xverse://contract-call?...
    const params = new URLSearchParams({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      // Arguments need to be hex-encoded Clarity values
      arguments: JSON.stringify(functionArgs.map(cvToWcArg)),
      network: 'mainnet',
      // Return URL for after signing
      returnUrl: window.location.href,
    })
    return `https://app.xverse.app/contract-call?${params.toString()}`
  }

  /**
   * Try Xverse deep link first, then fall back to WalletConnect RPC
   */
  const tryWalletConnect = async ({ functionName, functionArgs, postConditions, postConditionMode }) => {
    const hasSession = await wcHasActiveSession()
    if (!hasSession) {
      throw new Error('WALLET_SESSION_EXPIRED')
    }

    // First, try WalletConnect RPC (give it a short timeout)
    // Show instruction for mobile wallet users
    toast.loading(
      '📱 Sending request to your wallet...',
      { id: 'wallet-prompt', duration: 30_000 }
    )

    console.log('[WalletConnect] Attempting WalletConnect RPC first...')

    // Try WalletConnect RPC with a shorter timeout first
    try {
      if (canBuildAndSign) {
        console.log('[WalletConnect] Building unsigned transaction...')
        const unsignedTx = await withTimeout(
          makeUnsignedContractCall({
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName,
            functionArgs,
            network,
            anchorMode: AnchorMode.Any,
            postConditions,
            postConditionMode,
            publicKey,
          }),
          20_000,
          'Building transaction timed out'
        )

        console.log('[WalletConnect] Requesting signature via stx_signTransaction...')
        const res = await withTimeout(
          wcSignTransaction({
            transaction: txToHex(unsignedTx),
            broadcast: false,
            network: 'mainnet',
          }),
          30_000, // Shorter timeout - if WC works, it should respond quickly
          'WC_TIMEOUT'
        )

        console.log('[WalletConnect] Got response:', res)
        toast.dismiss('wallet-prompt')

        const maybeTxid = normalizeTxId(res)
        if (maybeTxid) return { txid: maybeTxid }

        const signedTxHex = normalizeSignedTxHex(res)
        if (!signedTxHex) throw new Error('Wallet returned an unexpected signing response')

        const txid = await withTimeout(broadcastSignedTx(signedTxHex), 60_000, 'Broadcast timed out')
        return { txid }
      }

      // Try stx_callContract if we don't have public key
      console.log('[WalletConnect] Trying stx_callContract...')
      const callRes = await withTimeout(
        wcCallContract({
          contract: contractId,
          functionName,
          functionArgs: functionArgs.map(cvToWcArg),
        }),
        30_000,
        'WC_TIMEOUT'
      )
      console.log('[WalletConnect] stx_callContract response:', callRes)
      toast.dismiss('wallet-prompt')
      const txid = normalizeTxId(callRes)
      return txid ? { txid } : callRes

    } catch (e) {
      toast.dismiss('wallet-prompt')
      console.warn('[WalletConnect] RPC failed:', e.message)

      // If WalletConnect timed out, offer to open Xverse directly
      if (e.message === 'WC_TIMEOUT' || e.message?.includes('timed out')) {
        const shouldOpenXverse = window.confirm(
          '📱 WalletConnect is not responding.\n\n' +
          'Would you like to open Xverse wallet directly?\n\n' +
          '(Make sure Xverse is installed on your device)'
        )

        if (shouldOpenXverse) {
          // Open Xverse deep link
          const deepLink = buildXverseDeepLink({ functionName, functionArgs })
          console.log('[Xverse] Opening deep link:', deepLink)
          
          // For mobile, try to open the app
          window.location.href = deepLink
          
          // Return a pending state - user will complete in wallet
          return new Promise((resolve, reject) => {
            toast.success('Opening Xverse wallet...', { duration: 3000 })
            // Give user time to complete in wallet, then they'll return
            setTimeout(() => {
              reject(new Error('Complete the transaction in Xverse and return to this page'))
            }, 5000)
          })
        } else {
          throw new Error('WALLET_TIMEOUT')
        }
      }

      throw e
    }
  }

  const handleDeposit = async (vault) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!amount || parseFloat(amount) < vault.minDeposit) {
      toast.error(`Minimum deposit is ${vault.minDeposit} STX`)
      return
    }

    setIsLoading(true)

    try {
      const amountInMicroSTX = BigInt(toMicroSTX(amount))

      const postConditions = [
        makeStandardSTXPostCondition(address, FungibleConditionCode.LessEqual, amountInMicroSTX)
      ]

      const res = await signAndBroadcastOrFallback({
        functionName: 'deposit',
        functionArgs: [uintCV(vault.id), uintCV(amountInMicroSTX)],
        postConditionMode: PostConditionMode.Deny,
        postConditions,
      })

      toast.success(`Deposit submitted${res?.txid ? `: ${res.txid}` : ''}`)
      setAmount('')
      setSelectedVault(null)
      setTimeout(() => refetch(), 5000)
    } catch (error) {
      console.error('Deposit error:', error)
      
      // Handle specific error cases with user-friendly messages
      if (error?.message === 'WALLET_SESSION_EXPIRED') {
        toast.error('Wallet session expired. Please disconnect and reconnect your wallet.')
      } else if (error?.message === 'WALLET_TIMEOUT') {
        toast.error(
          'Wallet did not respond. Please open your wallet app and try again.',
          { duration: 5000 }
        )
      } else if (error?.message?.includes('session expired')) {
        toast.error('Session expired. Please reconnect your wallet.')
      } else {
        toast.error(error?.message || 'Failed to initiate deposit')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async (vault) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)

    try {
      const sharesAmount = BigInt(toMicroSTX(amount))

      const res = await signAndBroadcastOrFallback({
        functionName: 'withdraw',
        functionArgs: [uintCV(vault.id), uintCV(sharesAmount)],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
      })

      toast.success(`Withdrawal submitted${res?.txid ? `: ${res.txid}` : ''}`)
      setAmount('')
      setSelectedVault(null)
      setTimeout(() => refetch(), 5000)
    } catch (error) {
      console.error('Withdraw error:', error)
      
      if (error?.message === 'WALLET_SESSION_EXPIRED') {
        toast.error('Wallet session expired. Please disconnect and reconnect your wallet.')
      } else if (error?.message === 'WALLET_TIMEOUT') {
        toast.error('Wallet did not respond. Please open your wallet app and try again.', { duration: 5000 })
      } else {
        toast.error(error?.message || 'Failed to initiate withdrawal')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyWithdraw = async (vault) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!window.confirm('Emergency withdrawal incurs a 5% penalty. Are you sure?')) {
      return
    }

    setIsLoading(true)

    try {
      const res = await signAndBroadcastOrFallback({
        functionName: 'emergency-withdraw',
        functionArgs: [uintCV(vault.id)],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
      })

      toast.success(`Emergency withdrawal submitted${res?.txid ? `: ${res.txid}` : ''}`)
      setSelectedVault(null)
      setTimeout(() => refetch(), 5000)
    } catch (error) {
      console.error('Emergency withdraw error:', error)
      
      if (error?.message === 'WALLET_SESSION_EXPIRED') {
        toast.error('Wallet session expired. Please disconnect and reconnect your wallet.')
      } else if (error?.message === 'WALLET_TIMEOUT') {
        toast.error('Wallet did not respond. Please open your wallet app and try again.', { duration: 5000 })
      } else {
        toast.error(error?.message || 'Failed to initiate emergency withdrawal')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompound = async (vault) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setIsLoading(true)

    try {
      const res = await signAndBroadcastOrFallback({
        functionName: 'compound',
        functionArgs: [uintCV(vault.id)],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
      })

      toast.success(`Compound submitted${res?.txid ? `: ${res.txid}` : ''}`)
      setTimeout(() => refetch(), 5000)
    } catch (error) {
      console.error('Compound error:', error)
      toast.error('Failed to initiate compound')
    } finally {
      setIsLoading(false)
    }
  }

  if (vaultsLoading) {
    return (
      <section id="vaults" className="py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-400">Loading vaults...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="vaults" className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display mb-2">
          <span className="gradient-text">Choose Your Vault</span>
        </h2>
        <p className="text-gray-400">
          Select a strategy that matches your risk tolerance and start earning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => {
          const meta = vaultMeta[vault.id] || vaultMeta[1]
          const IconComponent = meta.icon
          
          return (
            <div
              key={vault.id}
              className={`glass-card rounded-2xl overflow-hidden vault-card-${meta.color}`}
            >
              {/* Vault Header */}
              <div className={`p-6 bg-gradient-to-r ${meta.bgGradient}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-vault-${meta.color}/30 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-vault-${meta.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">APY</p>
                    <p className={`text-2xl font-bold text-vault-${meta.color}`}>{vault.apy}%</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{vault.name}</h3>
                <p className="text-sm text-gray-400">{meta.description}</p>
              </div>

              {/* Vault Stats */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <HiCurrencyDollar className="w-4 h-4" /> TVL
                  </span>
                  <span className="font-medium">{formatNumber(vault.totalDeposits)} STX</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <HiLockClosed className="w-4 h-4" /> Min Deposit
                  </span>
                  <span className="font-medium">{vault.minDeposit} STX</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <HiClock className="w-4 h-4" /> Lock Period
                  </span>
                  <span className="font-medium">{blocksToTime(vault.lockPeriod)}</span>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-stacks-gray">
                  <p className="text-xs text-gray-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {meta.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-stacks-gray text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vault Status */}
                {!vault.isActive && (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-red-400 text-center">Vault is currently paused</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  {selectedVault === vault.id ? (
                    <div className="space-y-3">
                      {/* Action Type Toggle */}
                      <div className="flex rounded-xl overflow-hidden border border-stacks-gray">
                        <button
                          onClick={() => setActionType('deposit')}
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            actionType === 'deposit' 
                              ? 'bg-stacks-purple text-white' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Deposit
                        </button>
                        <button
                          onClick={() => setActionType('withdraw')}
                          className={`flex-1 py-2 text-sm font-medium transition-colors ${
                            actionType === 'withdraw' 
                              ? 'bg-stacks-purple text-white' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Withdraw
                        </button>
                      </div>

                      {/* Amount Input */}
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`Amount in ${actionType === 'deposit' ? 'STX' : 'shares'}`}
                          className="input-field w-full px-4 py-3 rounded-xl text-white placeholder-gray-500"
                          min={actionType === 'deposit' ? vault.minDeposit : 0}
                          step="0.000001"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {actionType === 'deposit' ? 'STX' : 'Shares'}
                        </span>
                      </div>

                      {/* Fee Info */}
                      {actionType === 'deposit' && amount && parseFloat(amount) > 0 && (
                        <div className="text-xs text-gray-400 px-2">
                          Fee: {(parseFloat(amount) * 0.005).toFixed(6)} STX (0.5%) • 
                          Net: {(parseFloat(amount) * 0.995).toFixed(6)} STX
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (actionType === 'deposit') {
                              handleDeposit(vault)
                            } else {
                              handleWithdraw(vault)
                            }
                          }}
                          disabled={isLoading || !vault.isActive}
                          className="flex-1 btn-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="spinner w-5 h-5" />
                          ) : actionType === 'deposit' ? (
                            <>
                              <HiArrowDown className="w-4 h-4" />
                              Deposit
                            </>
                          ) : (
                            <>
                              <HiArrowUp className="w-4 h-4" />
                              Withdraw
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVault(null)
                            setAmount('')
                          }}
                          className="btn-secondary px-4 py-3 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Quick Actions */}
                      {isConnected && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleCompound(vault)}
                            disabled={isLoading}
                            className="flex-1 text-xs py-2 rounded-lg bg-vault-conservative/20 text-vault-conservative hover:bg-vault-conservative/30 transition-colors disabled:opacity-50"
                          >
                            <HiSparkles className="w-3 h-3 inline mr-1" />
                            Compound
                          </button>
                          <button
                            onClick={() => handleEmergencyWithdraw(vault)}
                            disabled={isLoading}
                            className="flex-1 text-xs py-2 rounded-lg bg-vault-aggressive/20 text-vault-aggressive hover:bg-vault-aggressive/30 transition-colors disabled:opacity-50"
                          >
                            Emergency Exit
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isConnected) {
                          connectWallet()
                        } else {
                          setSelectedVault(vault.id)
                          setActionType('deposit')
                        }
                      }}
                      disabled={!vault.isActive}
                      className="w-full btn-primary py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {isConnected ? 'Select Vault' : 'Connect to Deposit'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Section */}
      <div className="mt-8 glass-card p-6 rounded-2xl">
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-6 h-6 text-stacks-purple flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">How Vaults Work</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• <strong>Deposit Fee:</strong> 0.5% on all deposits</li>
              <li>• <strong>Withdrawal Fee:</strong> 0.5% on normal withdrawals</li>
              <li>• <strong>Emergency Withdrawal:</strong> 5% penalty (bypasses lock period)</li>
              <li>• <strong>Performance Fee:</strong> 10% on compound rewards</li>
              <li>• <strong>Referral Bonus:</strong> 0.25% of referee's deposit fees</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VaultList

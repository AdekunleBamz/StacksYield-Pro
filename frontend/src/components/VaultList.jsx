import React, { useState, useEffect } from 'react'
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
  uintCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions'
import { openContractCall } from '@stacks/connect'
import toast from 'react-hot-toast'
import { useVaults, CONTRACT_ADDRESS, CONTRACT_NAME } from '../hooks/useContract'
import { useWallet } from '../context/WalletContext'
import { toMicroSTX, blocksToTime, formatNumber } from '../utils/helpers'

// Check if Stacks wallet extension is installed (Leather, Xverse, or Hiro Wallet)
const isExtensionInstalled = () => {
  // Check multiple possible provider names
  const hasProvider = !!(
    window.StacksProvider || 
    window.LeatherProvider || 
    window.HiroWalletProvider ||
    window.XverseProviders?.StacksProvider ||
    window.btc // Xverse injects this
  )
  return hasProvider
}

const VaultList = () => {
  const { isConnected, connectWallet, address, network, wcSession } = useWallet()
  const [selectedVault, setSelectedVault] = useState(null)
  const [actionType, setActionType] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [hasExtension, setHasExtension] = useState(false)
  
  // Check for extension after component mounts (window object available)
  useEffect(() => {
    // Small delay to let extensions inject their providers
    const timer = setTimeout(() => {
      setHasExtension(isExtensionInstalled())
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  const [isLoading, setIsLoading] = useState(false)

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

  // Check if connected via WalletConnect (mobile) vs extension
  const isWalletConnectOnly = !!wcSession && !isExtensionInstalled()

  /**
   * HYBRID APPROACH:
   * - WalletConnect is used for wallet connection/identity only
   * - All transactions are signed via browser extension (openContractCall)
   * - If no extension is available, show helpful message
   */
  const signAndBroadcast = async ({ functionName, functionArgs, postConditions, postConditionMode }) => {
    // Check if extension is available
    if (!isExtensionInstalled()) {
      throw new Error(
        'To sign transactions, please install the Leather or Xverse browser extension. ' +
        'WalletConnect connection provides your wallet address, but transactions require a browser extension.'
      )
    }

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

      toast.loading('Opening wallet extension for approval...', { id: 'wallet-prompt' })

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
        console.error('Stacks Connect failed:', err)
        // Check if the error is about missing provider
        if (err?.message?.includes('provider') || err?.message?.includes('install')) {
          reject(new Error('No wallet extension detected. Please install Leather or Xverse browser extension.'))
        } else {
          reject(err)
        }
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

      const res = await signAndBroadcast({
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
      
      if (error?.message === 'WALLET_TIMEOUT') {
        toast.error('Wallet did not respond. Please try again.', { duration: 5000 })
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

      const res = await signAndBroadcast({
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
      
      if (error?.message === 'WALLET_TIMEOUT') {
        toast.error('Wallet did not respond. Please try again.', { duration: 5000 })
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
      const res = await signAndBroadcast({
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
      
      if (error?.message === 'WALLET_TIMEOUT') {
        toast.error('Wallet did not respond. Please try again.', { duration: 5000 })
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
      const res = await signAndBroadcast({
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

                {/* Extension Required Warning */}
                {isConnected && isWalletConnectOnly && (
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-xs text-amber-400 text-center">
                      ⚠️ Browser extension required to sign transactions. 
                      <a 
                        href="https://leather.io" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline ml-1"
                      >
                        Install Leather
                      </a>
                    </p>
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

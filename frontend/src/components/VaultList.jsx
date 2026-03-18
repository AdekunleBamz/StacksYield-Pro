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
  HiSparkles,
  HiExclamationTriangle,
  HiMagnifyingGlass,
  HiFunnel,
  HiArrowPath
} from 'react-icons/hi2'
import Skeleton from './Skeleton'
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
import EmptyState from './EmptyState'
import ConfirmationModal from './ConfirmationModal'
import Sparkline from './Sparkline'
import TransactionStepper from './TransactionStepper'
import { HiArrowPath } from 'react-icons/hi2'

const RefreshIndicator = ({ isLoading }) => (
  <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out overflow-hidden ${
    isLoading ? 'h-24 opacity-100 scale-100' : 'h-0 opacity-0 scale-95'
  }`}>
    <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-stacks-purple/10 border border-stacks-purple/20 text-stacks-purple shadow-xl shadow-stacks-purple/5">
      <div className="relative">
        <HiArrowPath className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-stacks-purple rounded-full animate-ping" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing</span>
        <span className="text-[10px] font-bold opacity-60">Updating vault state on-chain...</span>
      </div>
    </div>
  </div>
)

const Description = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = text.length > 100
  
  return (
    <div>
      <p className={`text-gray-400 text-sm leading-relaxed ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-stacks-purple text-xs font-bold mt-2 py-2 px-1 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  )
}

const VaultList = () => {
  const { isConnected, connectWallet, address, network, wcSession } = useWallet()
  const [selectedVault, setSelectedVault] = useState(null)
  const [actionType, setActionType] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [vaultToEmergency, setVaultToEmergency] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [txStep, setTxStep] = useState(0)

  const { vaults: contractVaults, loading: vaultsLoading, refetch } = useVaults()
  const isWalletConnectSession = !!wcSession

  // Vault metadata (icons, colors, descriptions)
  const vaultMeta = {
    1: {
      icon: HiShieldCheck,
      color: 'conservative',
      bgGradient: 'from-green-500/20 to-green-600/10',
      description: 'Low risk, steady returns. Perfect for long-term holders.',
      features: ['Low volatility', 'Weekly compounds', 'Early exit allowed'],
      apyHistory: [4.8, 5.0, 4.9, 5.1, 5.0, 5.2, 5.0]
    },
    2: {
      icon: HiScale,
      color: 'balanced',
      bgGradient: 'from-amber-500/20 to-amber-600/10',
      description: 'Moderate risk with optimized returns. Best for most users.',
      features: ['Balanced strategy', 'Bi-weekly compounds', 'Referral bonuses'],
      apyHistory: [10.5, 11.2, 12.0, 11.8, 12.5, 12.0, 12.0]
    },
    3: {
      icon: HiFire,
      color: 'aggressive',
      bgGradient: 'from-red-500/20 to-red-600/10',
      description: 'High risk, high reward. For experienced DeFi users.',
      features: ['Maximum returns', 'Auto-compound', 'Performance fees'],
      apyHistory: [20.0, 22.5, 25.0, 24.0, 26.0, 25.0, 25.0]
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

  /**
   * Sign and broadcast transaction using browser extension
   */
  const signAndBroadcast = async ({ functionName, functionArgs, postConditions, postConditionMode }) => {
    return new Promise((resolve, reject) => {
      let resolved = false

      const onFinish = (data) => {
        if (resolved) return
        resolved = true
        toast.dismiss('wallet-prompt')
        setTxStep(2) // Step 2: Broadcasting
        resolve({ txid: data.txId })
      }

      const onCancel = () => {
        if (resolved) return
        resolved = true
        toast.dismiss('wallet-prompt')
        reject(new Error('Transaction cancelled by user'))
      }

      toast.loading('Opening wallet for approval...', { id: 'wallet-prompt' })
      setTxStep(1) // Step 1: Wallet Approval

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
        console.error('Transaction failed:', err)
        reject(err)
      })

      // Timeout after 120 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          toast.dismiss('wallet-prompt')
          reject(new Error('Transaction timed out. Please try again.'))
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

    toast.error('Emergency withdraw is not available in the current contract version')
  }

  const confirmEmergencyWithdraw = async () => {
    setIsConfirmOpen(false)
    setVaultToEmergency(null)
    toast.error('Emergency withdraw is not available in the current contract version')
  }

  const handleCompound = async (vault) => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    toast.error('Compound is not available in the current contract version')
  }

  const filteredVaults = vaults.filter(vault => {
    const meta = vaultMeta[vault.id] || vaultMeta[1]
    const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = filterRisk === 'all' || meta.color === filterRisk
    return matchesSearch && matchesRisk
  })

  if (vaultsLoading) {
    return (
      <section id="vaults" className="py-16">
        <RefreshIndicator isLoading={vaultsLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/5 bg-white/5">
              <div className="p-6 space-y-4 bg-white/5">
                <div className="flex justify-between">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2 flex flex-col items-end">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="pt-4 border-t border-white/5">
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="vaults" className="py-16 relative" aria-labelledby="vaults-heading">
      <RefreshIndicator isLoading={vaultsLoading} />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 id="vaults-heading" className="text-3xl font-bold font-display mb-2">
            <span className="gradient-text">Choose Your Vault</span>
          </h2>
          <p className="text-gray-400">
            Select a strategy that matches your risk tolerance and start earning
          </p>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={vaultsLoading}
          className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white active:scale-90 transition-all md:hidden"
          aria-label="Refresh vaults"
        >
          <HiArrowPath className={`w-6 h-6 ${vaultsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vaults by name..."
            className="input-field w-full pl-12 pr-4 py-4 md:py-3 rounded-xl border border-white/5 focus:border-stacks-purple/50 bg-[#1A1A1C] text-base md:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSearchQuery('')
              }
            }}
            aria-label="Search vaults by name"
          />
        </div>
        <div className="flex gap-2 p-1 bg-[#1A1A1C] rounded-xl border border-white/5 overflow-x-auto">
          {['all', 'conservative', 'balanced', 'aggressive'].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              aria-pressed={filterRisk === risk}
              className={`px-8 md:px-6 py-4 md:py-2 rounded-lg text-base md:text-sm font-bold capitalize whitespace-nowrap transition-all active:scale-95 ${
                filterRisk === risk 
                  ? 'bg-stacks-purple text-white shadow-lg shadow-stacks-purple/20' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400" role="status" aria-live="polite">
        <span>
          Showing {filteredVaults.length} of {vaults.length} vault{vaults.length === 1 ? '' : 's'}
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </span>
        {(searchQuery || filterRisk !== 'all') && (
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-white/10 hover:border-stacks-purple/40 text-gray-300 hover:text-white transition-colors"
            onClick={() => {
              setSearchQuery('')
              setFilterRisk('all')
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {filteredVaults.length === 0 && !vaultsLoading ? (
        <EmptyState 
          title={searchQuery || filterRisk !== 'all' ? "No Vaults Found" : "No Vaults Available"}
          message={searchQuery || filterRisk !== 'all' 
            ? "Try adjusting your search or filters to find what you're looking for." 
            : "We couldn't find any active vaults. Please check back later or connect your wallet."}
          icon={searchQuery || filterRisk !== 'all' ? HiMagnifyingGlass : HiExclamationTriangle}
          action={searchQuery || filterRisk !== 'all' ? {
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('')
              setFilterRisk('all')
            }
          } : {
            label: 'Try Re-fetching',
            onClick: () => refetch()
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => {
            const meta = vaultMeta[vault.id] || vaultMeta[1]
            const IconComponent = meta.icon
            const amountValue = parseFloat(amount)
            const isDeposit = actionType === 'deposit'
            const isAmountInvalid =
              !amount || Number.isNaN(amountValue) || (isDeposit ? amountValue < vault.minDeposit : amountValue <= 0)

            return (
              <div
                key={vault.id}
                className={`glass-card rounded-2xl overflow-hidden vault-card transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-stacks-purple/20 focus-within:ring-2 focus-within:ring-stacks-purple/50 vault-card-${meta.color} animate-fade-in-up opacity-0`}
                style={{ 
                  animationDelay: `${(vault.id - 1) * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {/* Vault Header */}
                <div className={`p-5 md:p-6 bg-gradient-to-r ${meta.bgGradient}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-vault-${meta.color}/30 flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 md:w-6 md:h-6 text-vault-${meta.color}`} />
                    </div>
                    <div className="text-right flex flex-col items-end tooltip cursor-help" data-tooltip="Annual Percentage Yield: The projected return over one year, including the effect of compounding.">
                      <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wider">APY</p>
                      <p className={`text-xl md:text-2xl font-bold text-vault-${meta.color}`}>{vault.apy}%</p>
                      <div className="mt-1 opacity-60 scale-90 md:scale-100 origin-right">
                        <Sparkline 
                          data={meta.apyHistory} 
                          color={meta.color === 'conservative' ? '#22C55E' : meta.color === 'balanced' ? '#F59E0B' : '#EF4444'} 
                          width={60} 
                          height={20} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold font-display text-white mb-2">{vault.name}</h3>
                    <Description text={vault.description} />
                  </div>
                </div>

                {/* Vault Stats */}
                <div className="p-5 md:p-6 space-y-4">
                  <div className="grid grid-cols-2 md:block gap-4 md:space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0 text-sm tooltip cursor-help" data-tooltip="Total Value Locked: The total amount of STX deposited in this vault by all users.">
                      <span className="text-gray-500 md:text-gray-400 flex items-center gap-1 text-[10px] md:text-sm font-bold md:font-normal uppercase md:capitalize">
                        <HiCurrencyDollar className="w-3.5 h-3.5 md:w-4 md:h-4" /> TVL
                      </span>
                      <span className="font-bold md:font-medium text-xs md:text-sm">{formatNumber(vault.totalDeposits)} STX</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0 text-sm tooltip cursor-help" data-tooltip="The minimum amount of STX required to open a position in this vault.">
                      <span className="text-gray-500 md:text-gray-400 flex items-center gap-1 text-[10px] md:text-sm font-bold md:font-normal uppercase md:capitalize">
                        <HiLockClosed className="w-3.5 h-3.5 md:w-4 md:h-4" /> Min Deposit
                      </span>
                      <span className="font-bold md:font-medium text-xs md:text-sm">{vault.minDeposit} STX</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm tooltip cursor-help" data-tooltip="The period during which your deposited STX is locked and cannot be withdrawn without a penalty.">
                    <span className="text-gray-400 flex items-center gap-1">
                      <HiClock className="w-4 h-4" /> Lock Period
                    </span>
                    <span className="font-medium text-xs md:text-sm">{blocksToTime(vault.lockPeriod)}</span>
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

                  {/* WalletConnect info */}
                  {isConnected && isWalletConnectSession && (
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-xs text-green-400 text-center">
                        📱 Connected via WalletConnect - transactions will be signed in your mobile wallet
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
                            className={`flex-1 py-4 md:py-2 text-base md:text-sm font-bold transition-all active:scale-95 ${actionType === 'deposit'
                                ? 'bg-stacks-purple text-white'
                                : 'text-gray-400 hover:text-white'
                              }`}
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => setActionType('withdraw')}
                            className={`flex-1 py-4 md:py-2 text-base md:text-sm font-bold transition-all active:scale-95 ${actionType === 'withdraw'
                                ? 'bg-stacks-purple text-white'
                                : 'text-gray-400 hover:text-white'
                              }`}
                          >
                            Withdraw
                          </button>
                        </div>

                        {/* Amount Input */}
                        <div className="relative">
                          <label className="sr-only" htmlFor="vault-amount">Amount</label>
                          <input id="vault-amount"
                            type="number"
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Amount in ${actionType === 'deposit' ? 'STX' : 'shares'}`}
                            className="input-field w-full px-4 py-4 md:py-3 rounded-xl text-white placeholder-gray-500 text-base"
                            min={actionType === 'deposit' ? vault.minDeposit : 0}
                            step="0.000001"
                            aria-invalid={selectedVault === vault.id && isAmountInvalid}
                            aria-describedby={`amount-help-${vault.id}`}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            {actionType === 'deposit' ? 'STX' : 'Shares'}
                          </span>
                        </div>
                        <div id={`amount-help-${vault.id}`} className="text-xs px-2 text-gray-400">
                          {selectedVault === vault.id && isAmountInvalid ? (
                            actionType === 'deposit'
                              ? `Minimum deposit is ${vault.minDeposit} STX`
                              : 'Enter a positive share amount'
                          ) : (
                            actionType === 'deposit'
                              ? `Minimum deposit: ${vault.minDeposit} STX`
                              : 'Enter the number of shares to withdraw'
                          )}
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
                            disabled={isLoading || !vault.isActive || isAmountInvalid}
                            className="flex-1 btn-primary py-3 rounded-xl font-medium flex-col items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden"
                          >
                            {isLoading ? (
                              <div className="w-full">
                                <TransactionStepper 
                                  currentStep={txStep} 
                                  steps={[
                                    { label: 'Confirm', description: 'Sign in wallet' },
                                    { label: 'Broadcast', description: 'Sending to mempool' },
                                    { label: 'Finalize', description: 'Confirming on-chain' }
                                  ]} 
                                />
                              </div>
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
                              className="flex-1 text-[11px] font-bold uppercase tracking-wider py-4 md:py-2 rounded-xl bg-vault-conservative/20 text-vault-conservative hover:bg-vault-conservative/30 transition-all active:scale-95 disabled:opacity-50"
                            >
                              <HiSparkles className="w-3.5 h-3.5 inline mr-1" />
                              Compound
                            </button>
                            <button
                              onClick={() => handleEmergencyWithdraw(vault)}
                              disabled={isLoading}
                              className="flex-1 text-[11px] font-bold uppercase tracking-wider py-4 md:py-2 rounded-xl bg-vault-aggressive/20 text-vault-aggressive hover:bg-vault-aggressive/30 transition-all active:scale-95 disabled:opacity-50"
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
                        className="w-full btn-primary py-5 md:py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all active:scale-[0.98] disabled:opacity-50"
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
      )}

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

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setVaultToEmergency(null);
        }}
        onConfirm={confirmEmergencyWithdraw}
        title="Emergency Withdrawal"
        message={`Warning: Emergency withdrawals incur a 5% penalty and bypass the lock period. Are you sure you want to withdraw from ${vaultToEmergency?.name}?`}
        confirmLabel="Emergency Exit"
        variant="danger"
        isLoading={isLoading}
      />
    </section>
  )
}

export default VaultList

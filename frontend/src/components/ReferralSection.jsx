import React, { useState, useEffect } from 'react'
import { ReferralCard } from './ReferralCard'
import { HiLink, HiClipboardDocument, HiCheckCircle, HiUserPlus, HiGift, HiShare, HiClock, HiSparkles } from 'react-icons/hi2'
import { Card } from './Card'
import { Button } from './Button'
import { openContractCall } from '@stacks/connect'
import { stringAsciiCV, optionalCVOf, noneCV, PostConditionMode } from '@stacks/transactions'
import toast from 'react-hot-toast'
import { useUserStats, CONTRACT_ADDRESS, CONTRACT_NAME } from '../hooks/useContract'
import { useWallet } from '../context/WalletContext'
import { generateReferralURL, parseReferralFromURL, formatNumber } from '../utils/helpers'

export const ReferralSection = () => {
  const { address, network } = useWallet()
  const [newCode, setNewCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [copied, setCopied] = useState(false)
  const [referralFromURL, setReferralFromURL] = useState(null)
  
  const { stats: userStats, loading, refetch } = useUserStats(address)

  // Check for referral code in URL on mount
  useEffect(() => {
    const refCode = parseReferralFromURL()
    if (refCode) {
      setReferralFromURL(refCode)
    }
  }, [])

  // Generate a default code based on address
  const defaultCode = address ? `YIELD${address.slice(-6).toUpperCase()}` : ''

  const handleRegister = async () => {
    setIsRegistering(true)

    try {
      const referralArg = referralFromURL 
        ? optionalCVOf(stringAsciiCV(referralFromURL))
        : noneCV()

      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'register-user',
        functionArgs: [referralArg],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          toast.success('Registration successful!')
          setTimeout(() => refetch(), 5000)
        },
        onCancel: () => {
          toast.error('Transaction cancelled')
        }
      })
    } catch (error) {
      console.error('Register error:', error)
      toast.error('Failed to register')
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCreateCode = async () => {
    if (!newCode || newCode.length < 3 || newCode.length > 20) {
      toast.error('Code must be 3-20 characters')
      return
    }

    setIsCreating(true)

    try {
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-referral-code',
        functionArgs: [stringAsciiCV(newCode.toUpperCase())],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          toast.success('Referral code created successfully!')
          setNewCode('')
          setTimeout(() => refetch(), 5000)
        },
        onCancel: () => {
          toast.error('Transaction cancelled')
        }
      })
    } catch (error) {
      console.error('Create code error:', error)
      toast.error('Failed to create referral code')
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    const code = defaultCode
    const shareText = `Join me on StacksYield Pro and earn up to 25% APY on your STX! Use my referral code: ${code}\n\n${generateReferralURL(code)}`
    
    if (navigator.share) {
      navigator.share({
        title: 'StacksYield Pro Referral',
        text: shareText
      })
    } else {
      copyToClipboard(shareText)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading referral data...</p>
        </div>
      </div>
    )
  }

  const stats = userStats || {
    referralCount: 0,
    referralEarnings: 0,
    isRegistered: false
  }

  return (
    <section className="py-8 animate-fade-in-up" aria-labelledby="referral-heading">
      <div className="mb-8">
        <h2 id="referral-heading" className="text-3xl font-bold font-display mb-2">
          <span className="gradient-text">Referral Program</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base font-medium opacity-80 mb-8">
          Invite friends and earn <span className="text-stacks-purple font-black">0.25%</span> of their deposit fees forever
        </p>
      </div>

      {/* Registration Required Notice */}
      {!stats.isRegistered && (
        <div className="mb-10 glass-card p-8 rounded-3xl border border-stacks-purple/30 bg-stacks-purple/5 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-stacks-purple/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-stacks-purple/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <HiUserPlus className="w-8 h-8 text-stacks-purple" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-black text-xl mb-2 tracking-tight">Unlock Referral Rewards</h3>
              <p className="text-gray-400 text-sm max-w-xl">
                Register your account to create unique referral codes and earn 0.25% of all fees. 
                {referralFromURL && (
                  <span className="block mt-2 text-stacks-purple font-bold"> 
                    <HiCheckCircle className="inline w-4 h-4 mr-1" />
                    Referred by: {referralFromURL}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="btn-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs animate-pulse-glow whitespace-nowrap active:scale-95 transition-all shadow-xl shadow-stacks-purple/20"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing
                </div>
              ) : (
                "Register Now"
              )}
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-8 rounded-3xl text-center animate-fade-in-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="w-16 h-16 rounded-2xl bg-stacks-purple/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-stacks-purple/5 border border-stacks-purple/20">
            <span className="text-2xl font-black text-stacks-purple">1</span>
          </div>
          <h3 className="font-black text-xl mb-3 tracking-tight">Create Code</h3>
          <p className="text-sm text-gray-400 font-bold leading-relaxed opacity-70">
            Generate a custom code that reflects your brand or identity.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl text-center animate-fade-in-up opacity-0" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <div className="w-16 h-16 rounded-2xl bg-vault-balanced/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-vault-balanced/5 border border-vault-balanced/20">
            <span className="text-2xl font-black text-vault-balanced">2</span>
          </div>
          <h3 className="font-black text-xl mb-3 tracking-tight">Share & Invite</h3>
          <p className="text-sm text-gray-400 font-bold leading-relaxed opacity-70">
            Invite your network to join the highest-yielding STX vaults.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl text-center animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="w-16 h-16 rounded-2xl bg-vault-conservative/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-vault-conservative/5 border border-vault-conservative/20">
            <span className="text-2xl font-black text-vault-conservative">3</span>
          </div>
          <h3 className="font-black text-xl mb-3 tracking-tight">Earn Forever</h3>
          <p className="text-sm text-gray-400 font-bold leading-relaxed opacity-70">
            Collect rewards automatically on every deposit they make.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Code Section */}
        <div className="glass-card p-8 rounded-3xl animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-stacks-purple/10 flex items-center justify-center">
              <HiLink className="w-5 h-5 text-stacks-purple" />
            </div>
            Referral Portal
          </h3>

          {stats.isRegistered ? (
            <div className="space-y-6">
              <div className="bg-[#0C0C0D] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiSparkles className="w-5 h-5 text-stacks-purple animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Your Custom Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black font-display text-white tracking-widest leading-none">
                    {defaultCode}
                  </p>
                  <button
                    onClick={() => copyToClipboard(defaultCode)}
                    className="p-3 rounded-xl bg-stacks-purple text-white hover:bg-stacks-purple-light transition-all active:scale-90 shadow-lg shadow-stacks-purple/20"
                    aria-label="Copy referral code"
                  >
                    {copied ? (
                      <HiCheckCircle className="w-5 h-5" />
                    ) : (
                      <HiClipboardDocument className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#0C0C0D] p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Referral Link</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={generateReferralURL(defaultCode)}
                    readOnly
                    className="flex-1 bg-transparent text-sm font-bold text-gray-400 outline-none truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(generateReferralURL(defaultCode))}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-90"
                    aria-label="Copy referral link"
                  >
                    <HiClipboardDocument className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={shareReferral}
                className="w-full bg-white/5 border border-white/5 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98] transition-all"
                aria-label="Share referral link"
              >
                <HiShare className="w-5 h-5 text-stacks-purple" />
                Launch Share Menu
              </button>

              {/* Create Custom Code */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Custom Branding</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="ENTER_YOUR_CODE"
                    maxLength={20}
                    className="flex-1 bg-[#0C0C0D] border border-white/5 px-6 py-3 rounded-xl uppercase text-xs font-black tracking-widest text-white focus:border-stacks-purple/50 transition-colors"
                    aria-label="Custom referral code"
                  />
                  <button
                    onClick={handleCreateCode}
                    disabled={isCreating || !newCode || newCode.length < 3}
                    className="bg-stacks-purple px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-stacks-purple/20"
                  >
                    {isCreating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-[#0C0C0D] rounded-2xl border border-white/5 border-dashed">
              <HiLink className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-40" />
              <p className="text-white font-black uppercase tracking-widest text-xs mb-2">Unauthorized</p>
              <p className="text-gray-500 text-xs font-bold max-w-[200px] mx-auto opacity-60">
                Complete your registration to unlock the referral portal.
              </p>
            </div>
          )}
        </div>

        {/* Referral Stats */}
        <div className="glass-card p-8 rounded-3xl animate-fade-in-up opacity-0" style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}>
          <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-vault-balanced/10 flex items-center justify-center">
              <HiGift className="w-5 h-5 text-vault-balanced" />
            </div>
            Revenue Share
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-[#0C0C0D] rounded-2xl border border-white/5 hover:border-stacks-purple/20 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stacks-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiUserPlus className="w-6 h-6 text-stacks-purple" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Total Network</p>
                  <p className="text-2xl font-black text-white leading-none">{stats.referralCount}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#0C0C0D] rounded-2xl border border-white/5 hover:border-vault-conservative/20 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-vault-conservative/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiGift className="w-6 h-6 text-vault-conservative" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Yield Earned</p>
                  <p className="text-2xl font-black text-vault-conservative leading-none">{formatNumber(stats.referralEarnings)} <span className="text-xs opacity-40 ml-1 tracking-normal font-bold">STX</span></p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#0C0C0D] rounded-2xl border border-white/5 hover:border-vault-balanced/20 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-vault-balanced/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiClock className="w-6 h-6 text-vault-balanced" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Account Status</p>
                  <p className={`text-sm font-black uppercase tracking-widest ${stats.isRegistered ? 'text-vault-conservative' : 'text-gray-500'}`}>
                    {stats.isRegistered ? 'Active Operator' : 'Standby'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Tiers Info */}
          <div className="mt-8 p-6 bg-gradient-to-br from-stacks-purple/20 via-stacks-purple/5 to-transparent rounded-2xl border border-white/5 shadow-inner">
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-stacks-orange" />
              Passive Income
            </h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed opacity-60">
              Receive 0.25% of all deposit fees generated by your network. 
              Payouts are instant and settled directly on the Stacks blockchain.
            </p>
          </div>

          {/* Referrer Info */}
          {stats.referrer && (
            <div className="mt-6 p-4 bg-[#0C0C0D]/50 rounded-xl border border-white/[0.02]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 underline decoration-stacks-purple/30">Network Parent</p>
              <p className="text-[10px] font-black font-mono text-gray-500 truncate">{stats.referrer}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


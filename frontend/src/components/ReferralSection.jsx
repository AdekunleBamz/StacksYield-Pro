import React, { useState, useEffect } from 'react'
import { 
  HiLink, 
  HiClipboardDocument, 
  HiCheckCircle,
  HiUserPlus,
  HiGift,
  HiShare,
  HiClock
} from 'react-icons/hi2'
import { openContractCall } from '@stacks/connect'
import { stringAsciiCV, optionalCVOf, noneCV, PostConditionMode } from '@stacks/transactions'
import toast from 'react-hot-toast'
import { useUserStats } from '../hooks/useContract'
import { generateReferralURL, parseReferralFromURL, formatNumber } from '../utils/helpers'

const ReferralSection = ({ userAddress, network, contractAddress, contractName }) => {
  const [newCode, setNewCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [copied, setCopied] = useState(false)
  const [referralFromURL, setReferralFromURL] = useState(null)
  
  const { stats: userStats, loading, refetch } = useUserStats(userAddress)

  // Check for referral code in URL on mount
  useEffect(() => {
    const refCode = parseReferralFromURL()
    if (refCode) {
      setReferralFromURL(refCode)
    }
  }, [])

  // Generate a default code based on address
  const defaultCode = userAddress ? `YIELD${userAddress.slice(-6).toUpperCase()}` : ''

  const handleRegister = async () => {
    setIsRegistering(true)

    try {
      const referralArg = referralFromURL 
        ? optionalCVOf(stringAsciiCV(referralFromURL))
        : noneCV()

      await openContractCall({
        network,
        contractAddress,
        contractName,
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
        contractAddress,
        contractName,
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
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display mb-2">
          <span className="gradient-text">Referral Program</span>
        </h2>
        <p className="text-gray-400">
          Invite friends and earn 0.25% of their deposit fees forever
        </p>
      </div>

      {/* Registration Required Notice */}
      {!stats.isRegistered && (
        <div className="mb-8 glass-card p-6 rounded-2xl border border-stacks-purple/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-stacks-purple/20 flex items-center justify-center flex-shrink-0">
              <HiUserPlus className="w-6 h-6 text-stacks-purple" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Register to Unlock Referrals</h3>
              <p className="text-gray-400 text-sm mb-4">
                Register your account to create referral codes and start earning. 
                {referralFromURL && (
                  <span className="text-stacks-purple"> Using referral code: <strong>{referralFromURL}</strong></span>
                )}
              </p>
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="btn-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <div className="spinner w-4 h-4" />
                    Registering...
                  </>
                ) : (
                  <>
                    <HiUserPlus className="w-4 h-4" />
                    Register Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-stacks-purple/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-stacks-purple">1</span>
          </div>
          <h3 className="font-semibold mb-2">Create Your Code</h3>
          <p className="text-sm text-gray-400">
            Generate a unique referral code to share with friends
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-vault-balanced/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-vault-balanced">2</span>
          </div>
          <h3 className="font-semibold mb-2">Share & Invite</h3>
          <p className="text-sm text-gray-400">
            Share your code on social media or with friends
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-vault-conservative/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-vault-conservative">3</span>
          </div>
          <h3 className="font-semibold mb-2">Earn Forever</h3>
          <p className="text-sm text-gray-400">
            Get 0.25% of every deposit your referrals make
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Code Section */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HiLink className="w-5 h-5 text-stacks-purple" />
            Your Referral Code
          </h3>

          {stats.isRegistered ? (
            <div className="space-y-4">
              <div className="bg-stacks-dark p-4 rounded-xl border border-stacks-purple/30">
                <p className="text-sm text-gray-400 mb-2">Your Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold font-mono text-stacks-purple">
                    {defaultCode}
                  </p>
                  <button
                    onClick={() => copyToClipboard(defaultCode)}
                    className="p-2 rounded-lg bg-stacks-purple/20 hover:bg-stacks-purple/30 transition-colors"
                  >
                    {copied ? (
                      <HiCheckCircle className="w-5 h-5 text-vault-conservative" />
                    ) : (
                      <HiClipboardDocument className="w-5 h-5 text-stacks-purple" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-stacks-dark p-4 rounded-xl border border-stacks-gray">
                <p className="text-sm text-gray-400 mb-2">Referral Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generateReferralURL(defaultCode)}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-300 outline-none truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(generateReferralURL(defaultCode))}
                    className="p-2 rounded-lg bg-stacks-gray hover:bg-stacks-purple/20 transition-colors"
                  >
                    <HiClipboardDocument className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={shareReferral}
                className="w-full btn-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <HiShare className="w-5 h-5" />
                Share Referral Link
              </button>

              {/* Create Custom Code */}
              <div className="pt-4 border-t border-stacks-gray">
                <p className="text-sm text-gray-400 mb-3">Or create a custom code:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="MYCODE"
                    maxLength={20}
                    className="input-field flex-1 px-4 py-2 rounded-xl uppercase text-sm"
                  />
                  <button
                    onClick={handleCreateCode}
                    disabled={isCreating || !newCode || newCode.length < 3}
                    className="btn-secondary px-4 py-2 rounded-xl text-sm disabled:opacity-50"
                  >
                    {isCreating ? (
                      <div className="spinner w-4 h-4" />
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <HiLink className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Register to get your referral code</p>
              <p className="text-sm text-gray-500">
                Once registered, you can create custom codes and share with friends
              </p>
            </div>
          )}
        </div>

        {/* Referral Stats */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HiGift className="w-5 h-5 text-vault-balanced" />
            Your Referral Stats
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-stacks-dark rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stacks-purple/20 flex items-center justify-center">
                  <HiUserPlus className="w-5 h-5 text-stacks-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Referrals</p>
                  <p className="font-semibold">{stats.referralCount}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-stacks-dark rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vault-conservative/20 flex items-center justify-center">
                  <HiGift className="w-5 h-5 text-vault-conservative" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <p className="font-semibold text-vault-conservative">{formatNumber(stats.referralEarnings)} STX</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-stacks-dark rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vault-balanced/20 flex items-center justify-center">
                  <HiClock className="w-5 h-5 text-vault-balanced" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`font-semibold ${stats.isRegistered ? 'text-vault-conservative' : 'text-gray-400'}`}>
                    {stats.isRegistered ? 'Active' : 'Not Registered'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Tiers Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-stacks-purple/10 to-stacks-orange/10 rounded-xl border border-stacks-purple/20">
            <p className="text-sm font-medium mb-2">💎 Referral Bonus Structure</p>
            <p className="text-xs text-gray-400">
              Earn 0.25% of the deposit fees paid by anyone who uses your referral code. 
              Rewards are automatically credited to your account when your referrals deposit.
            </p>
          </div>

          {/* Referrer Info */}
          {stats.referrer && (
            <div className="mt-4 p-3 bg-stacks-dark rounded-xl">
              <p className="text-xs text-gray-400">You were referred by:</p>
              <p className="text-sm font-mono text-stacks-purple truncate">{stats.referrer}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ReferralSection

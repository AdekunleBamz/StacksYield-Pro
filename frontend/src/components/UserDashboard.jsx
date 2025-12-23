import React, { useState, useEffect } from 'react'
import { 
  HiCurrencyDollar, 
  HiArrowTrendingUp, 
  HiGift,
  HiClock,
  HiCheckCircle,
  HiExclamationTriangle,
  HiUsers
} from 'react-icons/hi2'
import { useUserStats, useVaults, useUserDeposit, usePendingRewards } from '../hooks/useContract'
import { useWallet } from '../context/WalletContext'
import { formatNumber, blocksToTime, formatDate } from '../utils/helpers'

const UserDashboard = () => {
  const { userAddress } = useWallet()
  const { stats: userStats, loading: statsLoading } = useUserStats(userAddress)
  const { vaults, loading: vaultsLoading } = useVaults()
  const [deposits, setDeposits] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user deposits for each vault
  useEffect(() => {
    const fetchDeposits = async () => {
      if (!userAddress || vaultsLoading || vaults.length === 0) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const userDeposits = []

      for (const vault of vaults) {
        try {
          // We'll use the hook data structure - in real implementation fetch from contract
          // For now, create placeholder based on user stats
          if (userStats && userStats.totalDeposited > 0) {
            // This is a simplified view - real implementation would fetch each deposit
            userDeposits.push({
              vaultId: vault.id,
              vaultName: vault.name,
              shares: 0, // Would come from contract
              depositAmount: 0,
              depositTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
              pendingRewards: 0,
              status: 'unlocked',
              apy: vault.apy
            })
          }
        } catch (err) {
          console.error(`Error fetching deposit for vault ${vault.id}:`, err)
        }
      }

      setDeposits(userDeposits)
      setIsLoading(false)
    }

    fetchDeposits()
  }, [userAddress, vaults, vaultsLoading, userStats])

  const getTimeUntilUnlock = (unlockTime) => {
    const diff = unlockTime - Date.now()
    if (diff <= 0) return 'Unlocked'
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    return `${days}d ${hours}h`
  }

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = userStats || {
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalRewards: 0,
    referralEarnings: 0,
    referralCount: 0,
    isRegistered: false
  }

  return (
    <section className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display mb-2">
          <span className="gradient-text">My Dashboard</span>
        </h2>
        <p className="text-gray-400">
          Track your deposits, rewards, and portfolio performance
        </p>
      </div>

      {/* Registration Status */}
      {!stats.isRegistered && (
        <div className="mb-6 p-4 bg-stacks-purple/10 rounded-xl border border-stacks-purple/20">
          <p className="text-sm text-gray-300">
            💡 <strong>Tip:</strong> Register your account to unlock referral features and track your stats on-chain.
          </p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-stacks-purple/20 flex items-center justify-center mb-3">
            <HiCurrencyDollar className="w-5 h-5 text-stacks-purple" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Deposited</p>
          <p className="text-2xl font-bold text-stacks-purple">
            {formatNumber(stats.totalDeposited)} STX
          </p>
        </div>

        <div className="stat-card glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-vault-conservative/20 flex items-center justify-center mb-3">
            <HiArrowTrendingUp className="w-5 h-5 text-vault-conservative" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Rewards</p>
          <p className="text-2xl font-bold text-vault-conservative">
            {formatNumber(stats.totalRewards)} STX
          </p>
        </div>

        <div className="stat-card glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-vault-balanced/20 flex items-center justify-center mb-3">
            <HiGift className="w-5 h-5 text-vault-balanced" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Referral Earnings</p>
          <p className="text-2xl font-bold text-vault-balanced">
            {formatNumber(stats.referralEarnings)} STX
          </p>
        </div>

        <div className="stat-card glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-stacks-orange/20 flex items-center justify-center mb-3">
            <HiUsers className="w-5 h-5 text-stacks-orange" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Referrals</p>
          <p className="text-2xl font-bold text-stacks-orange">
            {stats.referralCount}
          </p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm text-gray-400 mb-2">Total Withdrawn</p>
          <p className="text-xl font-bold">{formatNumber(stats.totalWithdrawn)} STX</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm text-gray-400 mb-2">Net Position</p>
          <p className={`text-xl font-bold ${stats.totalDeposited - stats.totalWithdrawn >= 0 ? 'text-vault-conservative' : 'text-vault-aggressive'}`}>
            {formatNumber(stats.totalDeposited - stats.totalWithdrawn)} STX
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-sm text-gray-400 mb-2">Total Earnings</p>
          <p className="text-xl font-bold text-vault-conservative">
            +{formatNumber(stats.totalRewards + stats.referralEarnings)} STX
          </p>
        </div>
      </div>

      {/* Active Deposits */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-stacks-gray">
          <h3 className="text-xl font-bold">Active Vaults</h3>
        </div>

        {vaults.length > 0 ? (
          <div className="divide-y divide-stacks-gray">
            {vaults.map((vault) => (
              <div key={vault.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{vault.name}</h4>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        vault.isActive 
                          ? 'bg-vault-conservative/20 text-vault-conservative'
                          : 'bg-vault-aggressive/20 text-vault-aggressive'
                      }`}>
                        {vault.isActive ? (
                          <>
                            <HiCheckCircle className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <HiExclamationTriangle className="w-3 h-3" />
                            Paused
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Lock period: {blocksToTime(vault.lockPeriod)} • {vault.apy}% APY
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">TVL</p>
                      <p className="font-semibold">{formatNumber(vault.totalDeposits)} STX</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Min Deposit</p>
                      <p className="font-semibold">{vault.minDeposit} STX</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">APY</p>
                      <p className="font-semibold text-vault-conservative">{vault.apy}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <HiExclamationTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Vaults Found</h4>
            <p className="text-gray-400 mb-4">
              Vaults have not been initialized yet.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl overflow-hidden mt-6">
        <div className="p-6 border-b border-stacks-gray">
          <h3 className="text-xl font-bold">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="#vaults"
              className="p-4 bg-stacks-purple/10 rounded-xl border border-stacks-purple/20 hover:bg-stacks-purple/20 transition-colors text-center"
            >
              <HiCurrencyDollar className="w-8 h-8 mx-auto mb-2 text-stacks-purple" />
              <p className="font-medium">Deposit More</p>
              <p className="text-xs text-gray-400">Add to your positions</p>
            </a>
            <a 
              href="#referrals"
              className="p-4 bg-vault-balanced/10 rounded-xl border border-vault-balanced/20 hover:bg-vault-balanced/20 transition-colors text-center"
            >
              <HiGift className="w-8 h-8 mx-auto mb-2 text-vault-balanced" />
              <p className="font-medium">Invite Friends</p>
              <p className="text-xs text-gray-400">Earn referral rewards</p>
            </a>
            <a 
              href="#vaults"
              className="p-4 bg-vault-conservative/10 rounded-xl border border-vault-conservative/20 hover:bg-vault-conservative/20 transition-colors text-center"
            >
              <HiArrowTrendingUp className="w-8 h-8 mx-auto mb-2 text-vault-conservative" />
              <p className="font-medium">Compound</p>
              <p className="text-xs text-gray-400">Reinvest your rewards</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserDashboard

import React, { useState, useEffect } from 'react'
import { 
  HiCurrencyDollar, 
  HiArrowTrendingUp, 
  HiGift,
  HiClock,
  HiCheckCircle,
  HiExclamationTriangle,
  HiUsers,
  HiWallet,
  HiArrowsRightLeft,
  HiShieldCheck
} from 'react-icons/hi2'
import { useUserStats, useVaults, useUserDeposit, usePendingRewards, useTransactions } from '../hooks/useContract'
import { useWallet } from '../context/WalletContext'
import { formatNumber, blocksToTime, formatDate, formatSTX } from '../utils/helpers'
import { EmptyState } from './EmptyState'
import { AreaChart } from './AreaChart'
import { PieChart } from './PieChart'
import { Stats } from './Stats'
import { TransactionHistory } from './TransactionHistory'
import { Tabs } from './Tabs'
import { ReferralSection } from './ReferralSection'

export const UserDashboard = () => {
  const { address } = useWallet()
  const { stats: userStats, loading: statsLoading } = useUserStats(address)
  const { vaults, loading: vaultsLoading } = useVaults()
  const [deposits, setDeposits] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user deposits for each vault
  useEffect(() => {
    const fetchDeposits = async () => {
      if (!address || vaultsLoading || vaults.length === 0) {
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
  }, [address, vaults, vaultsLoading, userStats])

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 mt-4">
        <div className="stat-card glass-card p-4 md:p-6 rounded-2xl border-l-4 border-stacks-purple">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-stacks-purple/20 flex items-center justify-center mb-3">
            <HiCurrencyDollar className="w-4 h-4 md:w-5 md:h-5 text-stacks-purple" />
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 font-black uppercase tracking-widest mb-1">Total Deposited</p>
          <p className="text-xl md:text-2xl font-black text-white">
            {formatNumber(stats.totalDeposited)} <span className="text-xs text-gray-500">STX</span>
          </p>
        </div>

        <div className="stat-card glass-card p-4 md:p-6 rounded-2xl border-l-4 border-green-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
            <HiArrowTrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 font-black uppercase tracking-widest mb-1">Total Rewards</p>
          <p className="text-xl md:text-2xl font-black text-white">
            {formatNumber(stats.totalRewards)} <span className="text-xs text-gray-500">STX</span>
          </p>
        </div>

        <div className="stat-card glass-card p-4 md:p-6 rounded-2xl border-l-4 border-amber-500">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
            <HiGift className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 font-black uppercase tracking-widest mb-1">Referral Rewards</p>
          <p className="text-xl md:text-2xl font-black text-white">
            {formatNumber(stats.referralEarnings)} <span className="text-xs text-gray-500">STX</span>
          </p>
        </div>

        <div className="stat-card glass-card p-4 md:p-6 rounded-2xl border-l-4 border-stacks-orange">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-stacks-orange/20 flex items-center justify-center mb-3">
            <HiUsers className="w-4 h-4 md:w-5 md:h-5 text-stacks-orange" />
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 font-black uppercase tracking-widest mb-1">Total Referrals</p>
          <p className="text-xl md:text-2xl font-black text-white">
            {stats.referralCount} <span className="text-xs text-gray-500">Users</span>
          </p>
        </div>
      </div>

      {/* Performance & Allocation */}
      {stats.totalDeposited > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <HiArrowTrendingUp className="w-24 h-24 text-stacks-purple" />
            </div>
            <AreaChart 
              label="Portfolio TVL"
              color="#5546FF"
              height={200}
              data={[
                { label: 'Jan', value: 1200 },
                { label: 'Feb', value: 1500 },
                { label: 'Mar', value: 2200 },
                { label: 'Apr', value: 1800 },
                { label: 'May', value: 2500 },
                { label: 'Jun', value: 3200 },
                { label: 'Jul', value: stats.totalDeposited }
              ]}
            />
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 w-full">Asset Allocation</h4>
            <PieChart 
              size={180}
              data={[
                { label: 'Conservative', value: 40, color: '#22C55E' },
                { label: 'Balanced', value: 35, color: '#F59E0B' },
                { label: 'Aggressive', value: 25, color: '#EF4444' }
              ]}
            />
          </div>
        </div>
      )}

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

        {stats.totalDeposited === 0 && (
          <EmptyState 
            title="No Deposits Yet"
            message="You haven't deposited any STX into our vaults. Start earning today with up to 25% APY!"
            icon={HiCurrencyDollar}
            action={{
              label: 'Explore Vaults',
              onClick: () => { window.location.hash = '#vaults'; }
            }}
          />
        )}

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

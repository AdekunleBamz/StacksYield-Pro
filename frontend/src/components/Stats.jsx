import React, { useState, useEffect } from 'react'
import { HiCurrencyDollar, HiUsers, HiArrowTrendingUp, HiLockClosed } from 'react-icons/hi2'
import { useProtocolStats, useVaults } from '../hooks/useContract'
import { formatNumber } from '../utils/helpers'
import Skeleton from './Skeleton'
import StatsCard from './StatsCard'

const Stats = () => {
  const { stats: protocolStats, loading: protocolLoading } = useProtocolStats()
  const { vaults, loading: vaultsLoading } = useVaults()
  
  const [displayStats, setDisplayStats] = useState({
    tvl: 0,
    users: 0,
    apy: 0,
    vaults: 0
  })

  // Animate stats when data loads
  useEffect(() => {
    const targetStats = {
      tvl: protocolStats?.tvl || 0,
      users: protocolStats?.users || 0,
      apy: vaults.length > 0 ? Math.max(...vaults.map(v => v.apy)) : 25,
      vaults: vaults.length || 3
    }

    // If still loading, show animated placeholders
    if (protocolLoading || vaultsLoading) {
      const placeholderStats = { tvl: 125000, users: 847, apy: 25, vaults: 3 }
      animateStats(placeholderStats)
    } else {
      animateStats(targetStats)
    }
  }, [protocolStats, vaults, protocolLoading, vaultsLoading])

  const animateStats = (targetStats) => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const startStats = { ...displayStats }
    
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplayStats({
        tvl: Math.round(startStats.tvl + (targetStats.tvl - startStats.tvl) * easeOut),
        users: Math.round(startStats.users + (targetStats.users - startStats.users) * easeOut),
        apy: Math.round(startStats.apy + (targetStats.apy - startStats.apy) * easeOut),
        vaults: Math.round(startStats.vaults + (targetStats.vaults - startStats.vaults) * easeOut)
      })

      if (step >= steps) {
        clearInterval(timer)
        setDisplayStats(targetStats)
      }
    }, interval)

    return () => clearInterval(timer)
  }

  const statCards = [
    {
      icon: <HiCurrencyDollar className="w-6 h-6 text-stacks-purple" />,
      label: 'Total Value Locked',
      value: `${formatNumber(displayStats.tvl)} STX`,
      color: '#5546FF',
      trend: 12.5,
      sparklineData: [450000, 480000, 460000, 510000, 530000, 520000, 535000],
      tooltip: 'The total value of all assets currently deposited in StacksYield Pro vaults.'
    },
    {
      icon: <HiUsers className="w-6 h-6 text-stacks-orange" />,
      label: 'Active Users',
      value: formatNumber(displayStats.users),
      color: '#F48E2F',
      trend: 8.2,
      sparklineData: [120, 150, 180, 210, 240, 280, 310],
      tooltip: 'Individual wallets that have interacted with the protocol.'
    },
    {
      icon: <HiArrowTrendingUp className="w-6 h-6 text-vault-aggressive" />,
      label: 'Max APY',
      value: `${displayStats.apy}%`,
      color: '#EF4444',
      trend: 2.1,
      sparklineData: [18, 20, 19, 22, 25, 24, 25],
      tooltip: 'The highest annual percentage yield currently offered across all vaults.'
    },
    {
      icon: <HiLockClosed className="w-6 h-6 text-vault-conservative" />,
      label: 'Active Vaults',
      value: displayStats.vaults,
      color: '#22C55E',
      trend: 0,
      sparklineData: [3, 3, 3, 3, 3, 3, 3],
      tooltip: 'The number of smart contract vaults currently accepting deposits.'
    }
  ]

  return (
    <section className="py-12" aria-label="Protocol statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <div 
              key={stat.label}
              className="tooltip cursor-help"
              data-tooltip={stat.tooltip}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {protocolLoading || vaultsLoading ? (
                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 border border-white/5 bg-white/5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-12 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <StatsCard
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  sparklineData={stat.sparklineData}
                  color={stat.color}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats

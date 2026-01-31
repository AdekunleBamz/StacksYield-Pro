import React, { useState, useEffect } from 'react'
import { HiCurrencyDollar, HiUsers, HiArrowTrendingUp, HiLockClosed } from 'react-icons/hi2'
import { useProtocolStats, useVaults } from '../hooks/useContract'
import { formatNumber } from '../utils/helpers'

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
      icon: HiCurrencyDollar,
      label: 'Total Value Locked',
      value: `${formatNumber(displayStats.tvl)} STX`,
      color: 'text-stacks-purple',
      bgColor: 'bg-stacks-purple/20'
    },
    {
      icon: HiUsers,
      label: 'Active Users',
      value: formatNumber(displayStats.users),
      color: 'text-stacks-orange',
      bgColor: 'bg-stacks-orange/20'
    },
    {
      icon: HiArrowTrendingUp,
      label: 'Max APY',
      value: `${displayStats.apy}%`,
      color: 'text-vault-aggressive',
      bgColor: 'bg-vault-aggressive/20'
    },
    {
      icon: HiLockClosed,
      label: 'Active Vaults',
      value: displayStats.vaults,
      color: 'text-vault-conservative',
      bgColor: 'bg-vault-conservative/20'
    }
  ]

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <div 
              key={stat.label}
              aria-label={stat.label}
              className="stat-card glass-card p-6 rounded-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-2xl lg:text-3xl font-bold font-display ${stat.color} animate-count`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats

import React from 'react'
import { HiShieldCheck, HiScale, HiFire } from 'react-icons/hi2'
import { formatSTX } from '../utils/helpers'

const VaultCard = ({ vault, onDeposit, onWithdraw }) => {
  const strategyMeta = {
    1: { icon: HiShieldCheck, color: 'text-green-400', border: 'border-green-500/30', label: 'Conservative' },
    2: { icon: HiScale, color: 'text-amber-400', border: 'border-amber-500/30', label: 'Balanced' },
    3: { icon: HiFire, color: 'text-red-400', border: 'border-red-500/30', label: 'Aggressive' }
  }

  const meta = strategyMeta[vault.strategy] || strategyMeta[1]
  const Icon = meta.icon
  
  return (
    <div className={`glass-card border-l-4 ${meta.border} rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-stacks-purple/10 group`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-white/5 ${meta.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-stacks-purple transition-colors">{vault.name}</h3>
            <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>{meta.label} Protocol</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black ${meta.color}`}>{vault.apy}% <small className="text-[10px] uppercase opacity-60">APY</small></span>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2 italic">"{vault.description}"</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Min Deposit</p>
          <p className="text-white font-bold">{vault.minDeposit} <span className="text-gray-500 text-[10px]">STX</span></p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Lock Period</p>
          <p className="text-white font-bold">{vault.lockPeriod} <span className="text-gray-500 text-[10px]">Blocks</span></p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => onDeposit(vault)} 
          className="flex-1 bg-stacks-purple hover:bg-stacks-purple/80 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-stacks-purple/20"
        >
          Deposit
        </button>
        <button 
          onClick={() => onWithdraw(vault)} 
          className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}

export default VaultCard

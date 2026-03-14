import React from 'react'
import { formatDate, formatSTX } from '../utils/helpers'
import { 
  HiArrowDownLeft, 
  HiArrowUpRight, 
  HiSparkles,
  HiClock,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi2'
import EmptyState from './EmptyState'

const TransactionHistory = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return <EmptyState 
      title="No Transactions" 
      message="Your transaction history will appear here once you start interacting with the protocol."
      size="sm"
    />
  }

  const typeConfig = {
    deposit: {
      icon: HiArrowDownLeft,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Deposit'
    },
    withdraw: {
      icon: HiArrowUpRight,
      color: 'text-error',
      bgColor: 'bg-error/10',
      label: 'Withdraw'
    },
    compound: {
      icon: HiSparkles,
      color: 'text-stacks-purple',
      bgColor: 'bg-stacks-purple/10',
      label: 'Compound'
    }
  }

  const statusConfig = {
    pending: { icon: HiClock, color: 'text-warning' },
    success: { icon: HiCheckCircle, color: 'text-success' },
    failed: { icon: HiXCircle, color: 'text-error' }
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, i) => {
        const config = typeConfig[tx.type] || typeConfig.deposit
        const status = statusConfig[tx.status] || statusConfig.pending
        
        return (
          <div key={i} className="flex justify-between items-center bg-[#1A1A1C]/50 border border-white/5 p-4 rounded-xl hover:bg-[#1A1A1C] hover:border-stacks-purple/30 hover:translate-x-1 transition-all duration-300 group cursor-default">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <config.icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div>
                <p className="font-black text-white text-sm uppercase tracking-widest mb-1 group-hover:text-stacks-purple transition-colors">
                  {config.label}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[10px] font-medium">{formatDate(tx.timestamp)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                  <span className="text-gray-500 text-[10px] font-mono opacity-60">#{tx.txid?.slice(-8) || 'pending'}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-black text-base mb-1 ${tx.type === 'withdraw' ? 'text-error' : 'text-success'}`}>
                {tx.type === 'withdraw' ? '-' : '+'}{formatSTX(tx.amount)} <span className="text-[10px] opacity-60 uppercase">STX</span>
              </p>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                <status.icon className="w-3 h-3" />
                {tx.status}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TransactionHistory

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
          <div key={i} className="flex justify-between items-center bg-[#1A1A1C] border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                <config.icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <p className="font-bold text-white leading-none mb-1">
                  {config.label}
                </p>
                <p className="text-gray-500 text-xs">{formatDate(tx.timestamp)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-white leading-none mb-1">
                {tx.type === 'withdraw' ? '-' : '+'}{formatSTX(tx.amount)} STX
              </p>
              <div className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
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

import React from 'react'
import { 
  HiArrowDownRight, 
  HiArrowUpRight, 
  HiOutlineArrowTopRightOnSquare as HiExternalLink,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi2'
import { formatSTX, formatDate } from '../utils/helpers'
import { EmptyState } from './EmptyState'

const statusConfig = {
  success: { color: 'text-vault-conservative', icon: HiCheckCircle, label: 'Success' },
  pending: { color: 'text-vault-balanced', icon: HiClock, label: 'Pending' },
  failed: { color: 'text-vault-aggressive', icon: HiExclamationCircle, label: 'Failed' }
}

const typeConfig = {
  deposit: { color: 'text-vault-conservative', bgColor: 'bg-vault-conservative/10', icon: HiArrowDownRight, label: 'Deposit' },
  withdraw: { color: 'text-vault-aggressive', bgColor: 'bg-vault-aggressive/10', icon: HiArrowUpRight, label: 'Withdrawal' }
}

export const TransactionHistory = ({ transactions = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState 
        title="No Transactions"
        message="Your transaction history will appear here once you start interacting with the vaults."
        size="sm"
      />
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, i) => {
        const config = typeConfig[tx.type] || typeConfig.deposit
        const status = statusConfig[tx.status] || statusConfig.pending
        
        return (
          <div 
            key={i} 
            className="group flex justify-between items-center bg-[#1A1A1C]/50 border border-white/5 p-4 rounded-xl hover:bg-[#1A1A1C] hover:border-stacks-purple/30 hover:translate-x-1 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
          >
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
                  <a 
                    href={`https://explorer.hiro.so/txid/${tx.txId}?chain=mainnet`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 text-[10px] font-mono opacity-60 hover:text-stacks-purple transition-colors flex items-center gap-1"
                  >
                    #{tx.txId?.slice(-8) || 'pending'}
                    <HiExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-black text-base mb-1 ${tx.type === 'withdraw' ? 'text-vault-aggressive' : 'text-vault-conservative'}`}>
                {tx.type === 'withdraw' ? '-' : '+'}{formatSTX(tx.amount)} <span className="text-[10px] opacity-60 uppercase">STX</span>
              </p>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                <status.icon className={`w-3 h-3 ${tx.status === 'pending' ? 'animate-spin' : ''}`} />
                {status.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

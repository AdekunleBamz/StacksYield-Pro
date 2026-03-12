import React, { useState, useEffect } from 'react'
import { getTransaction } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'
import { HiExternalLink, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi2'
import LoadingSpinner from './LoadingSpinner'

const TransactionStatus = ({ txId, network = 'mainnet', onConfirm }) => {
  const [status, setStatus] = useState('pending')
  const [confirmations, setConfirmations] = useState(0)
  
  const networkObj = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet()

  const statusColors = {
    pending: 'text-yellow-500',
    success: 'text-green-500',
    failed: 'text-red-500',
    success_pending: 'text-blue-500'
  }
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const tx = await getTransaction(txId, networkObj)
        setStatus(tx.tx_status)
        if (tx.block_hash) {
          setConfirmations(1)
          onConfirm?.(tx)
        }
      } catch (e) {
        console.error('Error checking tx:', e)
      }
    }
    
    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [txId])
  
  const explorerUrl = `https://explorer.hiro.so/txid/${txId}?chain=${network}`

  return (
    <div className="flex flex-col gap-2 p-4 glass-card rounded-xl border border-white/5 bg-stacks-dark/50">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 font-bold text-sm ${statusColors[status] || 'text-gray-400'}`}>
          {status === 'pending' || status === 'success_pending' ? (
            <HiClock className="w-5 h-5 animate-pulse" />
          ) : status === 'success' ? (
            <HiCheckCircle className="w-5 h-5" />
          ) : (
            <HiXCircle className="w-5 h-5" />
          )}
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </div>
        {confirmations > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold border border-green-500/20">
            {confirmations} Confirmations
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Transaction ID</span>
          <span className="text-xs font-mono text-gray-400">{txId.slice(0, 8)}...{txId.slice(-8)}</span>
        </div>
        <a 
          href={explorerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stacks-purple/10 text-stacks-purple hover:bg-stacks-purple/20 transition-all text-[10px] font-bold uppercase tracking-wider"
        >
          Explorer <HiExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}

export default TransactionStatus

import React, { useState, useEffect } from 'react'
import { getTransaction } from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'
import LoadingSpinner from './LoadingSpinner'

const TransactionStatus = ({ txId, network = 'mainnet', onConfirm }) => {
  const [status, setStatus] = useState('pending')
  const [confirmations, setConfirmations] = useState(0)
  
  const networkObj = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet()
  
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
  
  const statusColors = {
    pending: 'text-yellow-500',
    success: 'text-green-500',
    failed: 'text-red-500'
  }
  
  if (status === 'pending') {
    return <LoadingSpinner size="sm" text="Confirming transaction..." />
  }
  
  return (
    <div className={`flex items-center gap-2 ${statusColors[status]}`}>
      <span>{status === 'success' ? '✓' : '✕'}</span>
      <span className="capitalize">{status}</span>
      {confirmations > 0 && <span className="text-gray-400">({confirmations} confirmations)</span>}
    </div>
  )
}

export default TransactionStatus

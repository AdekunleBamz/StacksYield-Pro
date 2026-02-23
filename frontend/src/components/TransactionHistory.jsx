import React from 'react'
import { formatDate, formatSTX } from '../utils/helpers'

const TransactionHistory = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-400 text-center">No transactions yet</p>
  }

  const typeColors = {
    deposit: 'text-green-400',
    withdraw: 'text-red-400',
    compound: 'text-blue-400'
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, i) => (
        <div key={i} className="flex justify-between items-center bg-stacks-gray/20 p-3 rounded-lg">
          <div>
            <p className={`font-medium ${typeColors[tx.type] || 'text-white'}`}>
              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
            </p>
            <p className="text-gray-500 text-xs">{formatDate(tx.timestamp)}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{formatSTX(tx.amount)} STX</p>
            <p className="text-gray-500 text-xs">{tx.status}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionHistory

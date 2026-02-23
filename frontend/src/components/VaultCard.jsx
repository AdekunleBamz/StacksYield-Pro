import React from 'react'
import { formatSTX } from '../utils/helpers'

const VaultCard = ({ vault, onDeposit, onWithdraw }) => {
  const strategyColors = {
    1: 'border-green-500',
    2: 'border-yellow-500', 
    3: 'border-red-500'
  }
  
  return (
    <div className={`bg-stacks-gray/30 border-2 ${strategyColors[vault.id]} rounded-xl p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{vault.name}</h3>
          <p className="text-gray-400 text-sm">{vault.description}</p>
        </div>
        <span className="text-2xl font-bold text-green-400">{vault.apy}% APY</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Min Deposit</p>
          <p className="text-white font-medium">{vault.minDeposit} STX</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Lock Period</p>
          <p className="text-white font-medium">{vault.lockPeriod} days</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button onClick={() => onDeposit(vault)} className="flex-1 bg-stacks-purple hover:bg-stacks-purple/80 text-white py-2 rounded-lg">
          Deposit
        </button>
        <button onClick={() => onWithdraw(vault)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg">
          Withdraw
        </button>
      </div>
    </div>
  )
}

export default VaultCard

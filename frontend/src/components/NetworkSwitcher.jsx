import React from 'react'

const NetworkSwitcher = ({ currentNetwork, onSwitch }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Network:</span>
      <button
        onClick={() => onSwitch(currentNetwork === 'mainnet' ? 'testnet' : 'mainnet')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentNetwork === 'mainnet' 
            ? 'bg-green-600 text-white' 
            : 'bg-orange-600 text-white'
        }`}
      >
        {currentNetwork === 'mainnet' ? 'Mainnet' : 'Testnet'}
      </button>
    </div>
  )
}

export default NetworkSwitcher

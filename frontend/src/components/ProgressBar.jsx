import React from 'react'

const ProgressBar = ({ value, max = 100, color = 'stacks-purple', showLabel = true }) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-stacks-gray rounded-full h-2">
        <div 
          className={`bg-${color} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

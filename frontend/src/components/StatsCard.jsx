import React from 'react'

const StatsCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="bg-stacks-gray/20 border border-stacks-gray rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      {trend && (
        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </div>
  )
}

export default StatsCard

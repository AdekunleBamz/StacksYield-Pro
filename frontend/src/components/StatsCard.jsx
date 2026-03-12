import React from 'react'

const StatsCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="stat-card glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Gradient Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-stacks-purple/5 rounded-full blur-2xl group-hover:bg-stacks-purple/10 transition-colors duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-2 font-medium">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-stacks-gray/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-4 relative z-10">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500 font-medium">vs last month</span>
        </div>
      )}
    </div>
  )
}

export default StatsCard

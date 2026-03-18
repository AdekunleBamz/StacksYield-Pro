import React from 'react'
import { Sparkline } from './Sparkline'

export const StatsCard = ({ title, value, subtitle, icon, trend, sparklineData, color = '#5546FF' }) => {
  return (
    <div className="stat-card glass-card rounded-2xl p-6 relative overflow-hidden group border border-white/5 hover:border-white/20 transition-all duration-500">
      {/* Dynamic Glow Overlay */}
      <div 
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">{title}</p>
          <p className="text-2xl lg:text-3xl font-black text-white tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">{value}</p>
          {subtitle && <p className="text-gray-500 text-[10px] mt-2 font-bold uppercase tracking-tight">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex items-end justify-between relative z-10">
        {trend !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              trend > 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          </div>
        )}
        
        {sparklineData && (
          <div className="opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-1">
            <Sparkline data={sparklineData} color={color} width={90} height={35} />
          </div>
        )}
      </div>
    </div>
  )
}


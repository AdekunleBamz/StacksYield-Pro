import React from 'react'

export const Card = ({ children, title, className = '', hover = true }) => {
  return (
    <div className={`
      bg-[#1A1A1C] glass-card border border-white/5 rounded-3xl overflow-hidden
      ${hover ? 'transition-all duration-700 ease-[var(--ease-spring)] hover:shadow-[0_20px_50px_rgba(85,70,255,0.15)] hover:-translate-y-2 hover:border-white/20 active:scale-[0.99]' : ''}
      ${className}
    `}>
      {title && (
        <div className="border-b border-white/5 px-6 py-4 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white/60 tracking-widest uppercase">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}


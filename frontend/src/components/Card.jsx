import React from 'react'

const Card = ({ children, title, className = '', hover = true }) => {
  return (
    <div className={`
      bg-[#1A1A1C] glass-card border border-white/5 rounded-2xl overflow-hidden
      ${hover ? 'transition-all duration-500 hover:shadow-2xl hover:shadow-stacks-purple/10 hover:-translate-y-1 hover:border-white/10' : ''}
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

export default Card

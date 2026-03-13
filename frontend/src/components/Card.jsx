import React from 'react'

const Card = ({ children, title, className = '', hover = true }) => {
  return (
    <div className={`glass-card border border-white/5 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
      hover ? 'hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-white/5 hover:border-white/10' : ''
    } ${className}`}>
      {title && (
        <div className="border-b border-white/5 px-6 py-5 bg-white/[0.02]">
          <h3 className="text-lg font-black text-white tracking-tight uppercase tracking-widest text-[10px] opacity-60">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default Card

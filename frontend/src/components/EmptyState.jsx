import React from 'react'
import { HiOutlineInbox } from 'react-icons/hi2'

import { Button } from './Button'

export const EmptyState = ({ 
  title = "No data found", 
  message = "There are no items to display at the moment.",
  icon: Icon = HiOutlineInbox,
  action,
  className = "",
  size = "md" // Added new prop 'size' with default 'md'
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center text-center p-8 md:p-12 
      glass-card rounded-3xl border border-white/5 bg-white/[0.02]
      animate-fade-in-up transition-all duration-500
      ${size === 'sm' ? 'py-8' : size === 'lg' ? 'py-20' : 'py-12'}
      ${className}
    `}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-stacks-purple/20 blur-2xl rounded-full scale-150 animate-pulse-glow" />
        <div className="relative w-20 h-20 rounded-2xl bg-stacks-purple/10 flex items-center justify-center border border-stacks-purple/20 shadow-xl shadow-stacks-purple/5">
          <Icon className="w-10 h-10 text-stacks-purple" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-400 text-sm md:text-base max-w-sm mb-8 leading-relaxed">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-all shadow-lg shadow-stacks-purple/20"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

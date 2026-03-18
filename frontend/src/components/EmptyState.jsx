import React from 'react'
import { HiOutlineInbox } from 'react-icons/hi2'

import { Button } from './Button'

export const EmptyState = ({ 
  title = "No data found", 
  message = "There are no items to display at the moment.",
  icon: Icon = HiOutlineInbox,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center glass-card border-dashed border-2 border-white/5 rounded-3xl bg-white/[0.02] animate-in fade-in zoom-in-95 duration-700 ${className}`}>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-stacks-purple/20 blur-3xl rounded-full scale-150 opacity-20" />
        <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative z-10 shadow-2xl">
          <Icon className="w-12 h-12 text-white/20" />
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-white/40 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
        {message}
      </p>
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
          size="lg"
          className="px-8"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}


import React from 'react'
import { HiOutlineInbox } from 'react-icons/hi2'

const EmptyState = ({ 
  title = "No data found", 
  message = "There are no items to display at the moment.",
  icon: Icon = HiOutlineInbox,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center glass-card border-dashed border-2 border-white/5 rounded-3xl bg-white/[0.02] animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-stacks-purple/20 blur-3xl rounded-full scale-150 opacity-20" />
        <div className="w-20 h-20 rounded-2xl bg-stacks-gray/30 flex items-center justify-center border border-white/5 relative z-10 shadow-2xl">
          <Icon className="w-10 h-10 text-gray-500 group-hover:text-stacks-purple transition-colors" />
        </div>
      </div>
      
      <h3 className="text-xl font-black text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-10 font-bold leading-relaxed opacity-60">
        {message}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-stacks-purple/20 active:scale-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState

import React from 'react'
import { HiOutlineInbox } from 'react-icons/hi2'

const EmptyState = ({ 
  title = "No data found", 
  message = "There are no items to display at the moment.",
  icon: Icon = HiOutlineInbox,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState

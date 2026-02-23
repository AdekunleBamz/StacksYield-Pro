import React from 'react'

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-stacks-purple/20 text-stacks-purple',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400'
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export default Badge

import React from 'react'

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-stacks-purple/10 text-stacks-purple border border-stacks-purple/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-error/10 text-error border border-error/20',
    neutral: 'bg-white/5 text-gray-400 border border-white/10'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export default Badge

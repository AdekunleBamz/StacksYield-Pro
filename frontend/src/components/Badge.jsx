import React from 'react'

const Badge = ({ children, variant = 'default', size = 'md', animate = false }) => {
  const variants = {
    default: 'bg-stacks-purple/10 text-stacks-purple border border-stacks-purple/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-error/10 text-error border border-error/20',
    neutral: 'bg-white/5 text-gray-400 border border-white/10'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm uppercase'
  }
  
  return (
    <span className={`
      inline-flex items-center rounded-full font-bold tracking-wider transition-all duration-300
      ${variants[variant]} 
      ${sizes[size]}
      ${animate ? 'animate-pulse shadow-[0_0_12px_rgba(85,70,255,0.3)]' : ''}
    `}>
      {children}
    </span>
  )
}

export default Badge

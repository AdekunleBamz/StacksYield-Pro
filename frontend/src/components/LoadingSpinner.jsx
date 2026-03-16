import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-5'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 animate-in fade-in duration-700 ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          border-stacks-purple/20 border-t-stacks-purple rounded-full animate-spin
          shadow-[0_0_15px_rgba(85,70,255,0.1)]
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-4 text-white/40 text-sm font-medium tracking-wide animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner

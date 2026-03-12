import React from 'react'

const Button = ({ children, onClick, variant = 'primary', disabled, loading, type = 'button', className = '', size = 'md' }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  
  const variants = {
    primary: 'bg-stacks-purple text-white hover:bg-stacks-purple-light hover:shadow-lg hover:shadow-stacks-purple/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
    outline: 'bg-transparent border-2 border-stacks-purple text-white hover:bg-stacks-purple/10',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    success: 'bg-success/20 text-success hover:bg-success/30 border border-success/20',
    danger: 'bg-error/20 text-error hover:bg-error/30 border border-error/20'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  )
}

export default Button

import React from 'react'

const Button = ({ children, onClick, variant = 'primary', disabled, loading, type = 'button', className = '' }) => {
  const variants = {
    primary: 'bg-stacks-purple hover:bg-stacks-purple/80',
    secondary: 'bg-gray-600 hover:bg-gray-500',
    success: 'bg-green-600 hover:bg-green-600/80',
    danger: 'bg-red-600 hover:bg-red-600/80'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button

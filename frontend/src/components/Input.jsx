import React from 'react'

const Input = ({ label, error, type = 'text', value, onChange, placeholder, disabled, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-[#1A1A1C] border-2 rounded-xl px-4 py-3 text-white transition-all duration-300 placeholder:text-gray-600
            ${error 
              ? 'border-error/50 focus:border-error focus:ring-4 focus:ring-error/10' 
              : 'border-white/5 focus:border-stacks-purple focus:ring-4 focus:ring-stacks-purple/10'
            } 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/10'}
          `}
        />
      </div>
      {error && (
        <p className="text-error text-xs font-medium ml-1 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  )
}

export default Input

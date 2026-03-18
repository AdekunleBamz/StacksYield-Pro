import React from 'react'

export const Input = ({ 
  label, 
  error, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  className = '',
  id,
  required,
  name
}) => {
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-400 ml-1 transition-colors group-focus-within:text-stacks-purple">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-[#1A1A1C] border-2 rounded-xl px-4 py-3 text-white transition-all duration-300 placeholder:text-gray-600
            ${error 
              ? 'border-error/50 focus:border-error focus:ring-4 focus:ring-error/10' 
              : 'border-white/5 focus:border-stacks-purple focus:ring-4 focus:ring-stacks-purple/10'
            } 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/10'}
            focus:outline-none
          `}
        />
      </div>
      {error && (
        <p id={errorId} className="text-error text-xs font-medium ml-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}


import React, { useId } from 'react'

export const Input = ({ label, error, className = '', disabled, required, ...props }) => {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-gray-400 text-sm mb-2 font-black uppercase tracking-widest"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          id={id}
          {...props}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-4 py-3 rounded-xl bg-white/5 border transition-all duration-300
            text-white placeholder-gray-500
            focus:outline-none focus:ring-4 focus:ring-stacks-purple/10
            ${error 
              ? 'border-error/50 focus:border-error' 
              : 'border-white/5 group-hover:border-white/20 focus:border-stacks-purple'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/10'}
            ${className}
          `}
        />
        {error && (
          <p 
            id={errorId}
            className="mt-1.5 text-[10px] text-error font-black uppercase tracking-wider animate-fade-in"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

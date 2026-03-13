import React, { useState } from 'react'

const Dropdown = ({ options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-stacks-dark/50 border border-white/10 rounded-xl px-4 py-3 text-left text-white focus:outline-none focus:border-stacks-purple/50 transition-all hover:bg-stacks-purple/5 hover:border-white/20 flex items-center justify-between"
      >
        <span className="text-sm font-medium">{options.find(o => o.value === value)?.label || placeholder}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-stacks-purple' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-2 bg-stacks-dark/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-modal-entrance origin-top glass-card">
            <div className="p-1">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => { onChange(option.value); setIsOpen(false) }}
                  className={`w-full px-4 py-2.5 text-left text-sm rounded-lg transition-all ${
                    value === option.value 
                      ? 'bg-stacks-purple text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dropdown

import React, { useState } from 'react'

const Dropdown = ({ options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-stacks-dark border border-stacks-gray rounded-lg px-4 py-2 text-left text-white"
      >
        {options.find(o => o.value === value)?.label || placeholder}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-stacks-dark border border-stacks-gray rounded-lg shadow-lg">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => { onChange(option.value); setIsOpen(false) }}
              className="w-full px-4 py-2 text-left text-white hover:bg-stacks-purple/20"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown

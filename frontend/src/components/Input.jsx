import React from 'react'

const Input = ({ label, error, type = 'text', value, onChange, placeholder, disabled }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-stacks-dark border ${error ? 'border-red-500' : 'border-stacks-gray'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-stacks-purple ${disabled ? 'opacity-50' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Input

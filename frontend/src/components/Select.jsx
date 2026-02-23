import React from 'react'

const Select = ({ label, options, value, onChange, error }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-400 text-sm mb-2">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-stacks-dark border ${error ? 'border-red-500' : 'border-stacks-gray'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-stacks-purple`}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Select

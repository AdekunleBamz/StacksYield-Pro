import React from 'react'

const Alert = ({ children, variant = 'info', title }) => {
  const variants = {
    info: 'bg-blue-500/20 border-blue-500',
    success: 'bg-green-500/20 border-green-500',
    warning: 'bg-yellow-500/20 border-yellow-500',
    error: 'bg-red-500/20 border-red-500'
  }
  
  return (
    <div className={`border-l-4 p-4 rounded ${variants[variant]}`}>
      {title && <h4 className="font-bold text-white mb-1">{title}</h4>}
      <div className="text-gray-300">{children}</div>
    </div>
  )
}

export default Alert

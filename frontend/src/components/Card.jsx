import React from 'react'

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-stacks-gray/20 border border-stacks-gray rounded-xl ${className}`}>
      {title && (
        <div className="border-b border-stacks-gray px-6 py-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default Card

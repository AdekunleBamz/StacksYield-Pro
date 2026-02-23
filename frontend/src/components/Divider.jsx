import React from 'react'

const Divider = ({ text, className = '' }) => {
  if (text) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="flex-1 border-t border-stacks-gray" />
        <span className="text-gray-400 text-sm">{text}</span>
        <div className="flex-1 border-t border-stacks-gray" />
      </div>
    )
  }
  return <div className={`border-t border-stacks-gray my-4 ${className}`} />
}

export default Divider

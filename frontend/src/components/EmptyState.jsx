import React from 'react'

const EmptyState = ({ icon, title, description, action }) => (
  <div className="text-center py-12">
    {icon && <div className="text-4xl mb-4">{icon}</div>}
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-4">{description}</p>
    {action}
  </div>
)

export default EmptyState

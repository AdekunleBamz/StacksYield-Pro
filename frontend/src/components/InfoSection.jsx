import React from 'react'

const InfoSection = ({ title, items, icon }) => {
  return (
    <div className="bg-stacks-gray/20 border border-stacks-gray rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoSection

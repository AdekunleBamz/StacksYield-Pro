import React, { useState } from 'react'

export const Tabs = ({ tabs, activeTab, onTabChange, defaultTab = 0 }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab)
  
  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab
  const handleTabChange = (index) => {
    if (onTabChange) {
      onTabChange(index)
    } else {
      setInternalActiveTab(index)
    }
  }

  return (
    <div>
      <div className="flex border-b border-stacks-gray">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2 font-medium transition-colors ${
              currentTab === i
                ? 'text-white border-b-2 border-stacks-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs[currentTab]?.content}
      </div>
    </div>
  )
}

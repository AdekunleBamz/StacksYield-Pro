import React, { useState } from 'react'

export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const headerId = `accordion-header-${i}`
        const panelId = `accordion-panel-${i}`
        
        return (
          <div key={i} className={`
            border border-white/5 rounded-2xl overflow-hidden transition-all duration-300
            ${isOpen ? 'bg-[#1A1A1C]' : 'bg-transparent hover:border-white/10'}
          `}>
            <button
              id={headerId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full px-5 py-4 text-left flex justify-between items-center group transition-colors focus:outline-none"
            >
              <span className={`font-semibold tracking-tight transition-colors ${isOpen ? 'text-stacks-purple' : 'text-white/80 group-hover:text-white'}`}>
                {item.title}
              </span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-stacks-purple' : 'text-white/30 group-hover:text-white/50'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`
                px-5 overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


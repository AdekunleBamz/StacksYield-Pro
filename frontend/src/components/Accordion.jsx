import React, { useState } from 'react'

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-stacks-gray rounded-lg">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full px-4 py-3 text-left flex justify-between items-center"
          >
            <span className="text-white font-medium">{item.title}</span>
            <span>{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && (
            <div className="px-4 pb-3 text-gray-400">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion

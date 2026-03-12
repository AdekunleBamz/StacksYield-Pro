import React, { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
        copied 
          ? 'bg-success/20 text-success border border-success/30' 
          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
      } ${className}`}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <FiCheck className="w-3.5 h-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiCopy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

export default CopyButton

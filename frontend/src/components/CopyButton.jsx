import React, { useState } from 'react'

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
      className={`px-3 py-1 bg-stacks-purple/20 text-stacks-purple rounded hover:bg-stacks-purple/30 ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default CopyButton

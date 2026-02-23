import React from 'react'

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-stacks-gray/30 rounded ${className}`} />
)

export default Skeleton

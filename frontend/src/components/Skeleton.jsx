import React from 'react'

export const Skeleton = ({ className = '', circle = false }) => (
  <div 
    className={`relative overflow-hidden bg-white/5 ${circle ? 'rounded-full' : 'rounded-2xl'} ${className}`}
    aria-hidden="true"
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
  </div>
)


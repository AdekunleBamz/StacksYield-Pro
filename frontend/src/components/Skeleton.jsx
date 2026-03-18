import React from 'react'

export const Skeleton = ({ className = '', circle = false }) => (
  <div className={`relative overflow-hidden bg-white/5 ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
  </div>
)


import React from 'react'

const Sparkline = ({ data = [], color = '#5546FF', height = 40, width = 100 }) => {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const padding = 2

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = range === 0 
      ? height / 2 
      : height - ((val - min) / range) * (height - padding * 2) - padding
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="spark-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d={areaPath}
          fill={`url(#grad-${color})`}
          stroke="none"
          className="animate-fade-in"
        />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#spark-glow)"
          className="sparkline-path"
        />
      </svg>
      <style>{`
        .sparkline-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawSparkline 1.5s ease-out forwards;
        }
        @keyframes drawSparkline {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Sparkline

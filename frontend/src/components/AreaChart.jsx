import React from 'react'

export const AreaChart = ({ 
  data = [], 
  color = '#5546FF', 
  height = 200, 
  width = 600,
  label = 'Value',
  showGrid = true 
}) => {
  if (!data || data.length < 2) return null

  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const padding = 20
  const range = max - min
  
  const getX = (i) => (i / (data.length - 1)) * (width - padding * 2) + padding
  const getY = (v) => {
    const scale = range === 0 ? 0.5 : (v - min) / range
    return height - (scale * (height - padding * 2) + padding)
  }

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label} Growth</h4>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-300">Current</span>
          </div>
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id={`area-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id="area-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feOffset dx="0" dy="10" result="offsetBlur" />
              <feFlood floodColor={color} floodOpacity="0.2" result="colorBlur" />
              <feComposite in="colorBlur" in2="offsetBlur" operator="in" result="shadow" />
              <feComposite in="SourceGraphic" in2="shadow" operator="over" />
            </filter>
            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-5">
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line 
                  key={p}
                  x1={padding} y1={getY(min + p * range)} 
                  x2={width - padding} y2={getY(min + p * range)} 
                  stroke="white" 
                  strokeWidth="1" 
                  strokeDasharray="4,4"
                />
              ))}
            </g>
          )}

          {/* Area */}
          <path
            d={areaPath}
            fill={`url(#area-grad-${color})`}
            filter="url(#area-shadow)"
            className="animate-area-reveal"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#line-glow)"
            className="chart-line"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} cy={p.y} r="5" 
              fill="#0C0C0D" 
              stroke={color} 
              strokeWidth="2.5" 
              className="chart-point opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer hover:r-7"
            >
              <title>{data[i].label}: {data[i].value}</title>
            </circle>
          ))}
        </svg>
      </div>
      
      <div className="flex justify-between mt-4 opacity-40">
        {data.filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1).map((d, i) => (
          <span key={i} className="text-[9px] uppercase font-black tracking-widest text-gray-500">{d.label}</span>
        ))}
      </div>

      <style>{`
        .chart-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawLine 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        .animate-area-reveal {
          animation: areaReveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform-origin: bottom;
          transform: scaleY(0.9);
        }
        @keyframes areaReveal {
          to { opacity: 1; transform: scaleY(1); }
        }
        .chart-point:hover {
          filter: drop-shadow(0 0 8px ${color});
        }
      `}</style>
    </div>
  )
}


import React from 'react'

export const PieChart = ({ 
  data = [], 
  size = 200, 
  innerRadius = 60,
  label = 'Value'
}) => {
  if (!data || data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return null

  let currentAngle = 0
  const center = size / 2
  const radius = size / 2 - 10

  const getCoordinatesForAngle = (angle) => {
    const x = center + radius * Math.cos(Math.PI * angle / 180)
    const y = center + radius * Math.sin(Math.PI * angle / 180)
    return [x, y]
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="transform -rotate-90"
          role="img"
          aria-label="Portfolio asset allocation chart"
        >
          {data.map((item, i) => {
            const angle = (item.value / total) * 360
            const [startX, startY] = getCoordinatesForAngle(currentAngle)
            const [endX, endY] = getCoordinatesForAngle(currentAngle + angle)
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L ${center} ${center}`,
              'Z'
            ].join(' ')

            const segment = (
              <path
                key={i}
                d={pathData}
                fill={item.color}
                className="transition-all duration-500 hover:scale-105 hover:opacity-90 cursor-pointer origin-center"
                style={{
                  animation: `pieReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards ${i * 0.15}s`,
                  opacity: 0,
                  transformOrigin: `${center}px ${center}px`
                }}
                aria-label={`${item.label}: ${item.value}%`}
              >
                <title>{item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)</title>
              </path>
            )

            currentAngle += angle
            return segment
          })}
          
          {/* Inner hole for Donut chart effect */}
          <circle cx={center} cy={center} r={innerRadius} fill="#0C0C0D" className="shadow-inner" />
          
          {/* Total Value Text */}
          <g className="transform rotate-90" style={{ transformOrigin: 'center' }} aria-hidden="true">
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              className="text-[9px] font-black fill-gray-500 uppercase tracking-[0.2em] opacity-60"
            >
              Holdings
            </text>
            <text
              x={center}
              y={center + 18}
              textAnchor="middle"
              className="text-2xl font-black fill-white tracking-tighter"
            >
              100<tspan className="text-xs opacity-40 ml-0.5">%</tspan>
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 group cursor-default">
            <div className={`w-2.5 h-2.5 rounded-[3px] transition-transform group-hover:scale-125`} style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
              <span className="text-xs font-black text-white">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pieReveal {
          from { opacity: 0; transform: scale(0.9) rotate(-15deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        path:hover {
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.1));
        }
      `}</style>
    </div>
  )
}

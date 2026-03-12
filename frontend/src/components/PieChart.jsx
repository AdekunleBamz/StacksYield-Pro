import React from 'react'

const PieChart = ({ data = [], size = 200, innerRadius = 60 }) => {
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
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
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
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{
                  animation: `pieReveal 1s ease-out forwards ${i * 0.1}s`,
                  opacity: 0
                }}
              >
                <title>{item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)</title>
              </path>
            )

            currentAngle += angle
            return segment
          })}
          
          {/* Inner hole for Donut chart effect */}
          <circle cx={center} cy={center} r={innerRadius} fill="#141416" />
          
          {/* Total Value Text */}
          <g className="transform rotate-90" style={{ transformOrigin: 'center' }}>
            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              className="text-[10px] font-bold fill-gray-500 uppercase tracking-widest"
            >
              Portfolio
            </text>
            <text
              x={center}
              y={center + 15}
              textAnchor="middle"
              className="text-lg font-bold fill-white"
            >
              100%
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</span>
            <span className="text-[10px] font-bold text-white">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pieReveal {
          from { opacity: 0; transform: scale(0.8) rotate(-10deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
      `}</style>
    </div>
  )
}

export default PieChart

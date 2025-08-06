"use client"

import { useEffect, useState } from 'react'

interface CalorieSpeedometerProps {
  current?: number
  currentCalories?: number
  target?: number
  goalCalories?: number
  size?: number
}

export function CalorieSpeedometer({ 
  current, 
  currentCalories, 
  target, 
  goalCalories, 
  size = 200 
}: CalorieSpeedometerProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  // Handle both prop naming conventions and provide fallbacks
  const actualCurrent = current ?? currentCalories ?? 0
  const actualTarget = target ?? goalCalories ?? 2000
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(actualCurrent)
    }, 100)
    return () => clearTimeout(timer)
  }, [actualCurrent])

  // Calculate angle for the needle (0-180 degrees) with safety checks
  const safeAnimatedValue = isNaN(animatedValue) ? 0 : animatedValue
  const safeTarget = isNaN(actualTarget) || actualTarget === 0 ? 2000 : actualTarget
  
  const percentage = Math.min((safeAnimatedValue / safeTarget) * 100, 100)
  const angle = (percentage / 100) * 180 - 90 // -90 to 90 degrees

  const radius = size / 2 - 20
  const center = size / 2
  const strokeWidth = 12

  // Create arc path for the gauge background
  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start = {
      x: center + Math.cos(startAngle * Math.PI / 180) * innerRadius,
      y: center + Math.sin(startAngle * Math.PI / 180) * innerRadius
    }
    const end = {
      x: center + Math.cos(endAngle * Math.PI / 180) * innerRadius,
      y: center + Math.sin(endAngle * Math.PI / 180) * innerRadius
    }
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
    
    return `
      M ${start.x} ${start.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `
  }

  // Color zones
  const getColorForPercentage = (perc: number) => {
    if (perc <= 60) return '#10b981' // Green
    if (perc <= 80) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  const needleColor = getColorForPercentage(percentage)
  const remainingCalories = Math.max(0, safeTarget - safeAnimatedValue)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.6 }}>
        <svg width={size} height={size * 0.6} className="overflow-visible">
          {/* Background arc */}
          <path
            d={createArcPath(-90, 90, radius, radius)}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          
          {/* Color zones */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          
          {/* Active arc */}
          <path
            d={createArcPath(-90, angle, radius, radius)}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'all 1s ease-out',
              strokeDasharray: `${(percentage / 100) * Math.PI * radius}, ${Math.PI * radius}`
            }}
          />
          
          {/* Needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${center}px ${center}px` }}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius + 15}
              stroke={needleColor}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'transform 1s ease-out' }}
            />
            <circle
              cx={center}
              cy={center}
              r="6"
              fill={needleColor}
            />
          </g>
          
          {/* Scale marks */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const markAngle = (mark / 100) * 180 - 90
            const x1 = center + Math.cos(markAngle * Math.PI / 180) * (radius - 15)
            const y1 = center + Math.sin(markAngle * Math.PI / 180) * (radius - 15)
            const x2 = center + Math.cos(markAngle * Math.PI / 180) * (radius - 5)
            const y2 = center + Math.sin(markAngle * Math.PI / 180) * (radius - 5)
            
            return (
              <line
                key={mark}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              />
            )
          })}
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: needleColor }}>
              {Math.round(safeAnimatedValue)}
            </div>
            <div className="text-sm text-muted-foreground">calories</div>
            <div className="text-xs text-muted-foreground mt-1">
              {remainingCalories > 0 ? `${remainingCalories} remaining` : 'Goal exceeded!'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scale labels */}
      <div className="flex justify-between w-full mt-2 px-4">
        <span className="text-xs text-muted-foreground">0</span>
        <span className="text-xs text-muted-foreground">{Math.round(safeTarget * 0.5)}</span>
        <span className="text-xs text-muted-foreground">{safeTarget}</span>
      </div>
    </div>
  )
}
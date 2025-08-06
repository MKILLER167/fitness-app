"use client"

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

interface CalorieSemicircleGaugeProps {
  current: number
  target: number
  size?: number
}

export function CalorieSemicircleGauge({ 
  current, 
  target, 
  size = 240 
}: CalorieSemicircleGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(current)
    }, 300)
    return () => clearTimeout(timer)
  }, [current])

  // Calculate remaining calories
  const remaining = Math.max(0, target - current)
  const percentage = Math.min((current / target) * 100, 100)
  
  // SVG dimensions
  const center = size / 2
  const radius = size * 0.38
  const strokeWidth = 12
  
  // Create semicircle path
  const circumference = Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Generate tick marks for scale (more detailed)
  const tickMarks = []
  const tickCount = 8
  for (let i = 0; i <= tickCount; i++) {
    const angle = (i / tickCount) * Math.PI - Math.PI
    const isMainTick = i % 2 === 0
    const x1 = center + Math.cos(angle) * (radius - (isMainTick ? 15 : 8))
    const y1 = center + Math.sin(angle) * (radius - (isMainTick ? 15 : 8))
    const x2 = center + Math.cos(angle) * (radius + 2)
    const y2 = center + Math.sin(angle) * (radius + 2)
    
    tickMarks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={isMainTick ? "2" : "1"}
        className={isMainTick ? "text-muted-foreground/60" : "text-muted-foreground/30"}
      />
    )
  }

  // Scale labels
  const scaleLabels = []
  const labelCount = 3
  for (let i = 0; i <= labelCount; i++) {
    const value = (target / labelCount) * i
    const angle = (i / labelCount) * Math.PI - Math.PI
    const x = center + Math.cos(angle) * (radius + 25)
    const y = center + Math.sin(angle) * (radius + 25)
    
    scaleLabels.push(
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs text-muted-foreground fill-current"
      >
        {Math.round(value)}
      </text>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg width={size} height={size * 0.65} className="overflow-visible">
          {/* Background semicircle */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          
          {/* Progress semicircle */}
          <motion.path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="url(#calorieGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          
          {/* Tick marks */}
          {tickMarks}
          
          {/* Scale labels */}
          {scaleLabels}
          
          {/* Center needle/indicator */}
          <motion.g
            style={{ 
              transformOrigin: `${center}px ${center}px`,
            }}
            animate={{ 
              rotate: (percentage / 100) * 180 - 90 
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius + 20}
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              className="dark:stroke-white"
            />
            <circle
              cx={center}
              cy={center}
              r="5"
              fill="#000000"
              className="dark:fill-white"
            />
          </motion.g>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              CALORIES
            </div>
            <motion.div 
              className="text-3xl font-bold text-foreground"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {remaining}
            </motion.div>
            <div className="text-xs text-muted-foreground">
              remaining
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom label */}
      <motion.div 
        className="mt-2 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Today's Nutrition
      </motion.div>
    </div>
  )
}
"use client"

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageContext'

interface SimpleCalorieGaugeProps {
  currentCalories: number
  goalCalories: number
  size?: number
}

export function SimpleCalorieGauge({ currentCalories, goalCalories, size = 200 }: SimpleCalorieGaugeProps) {
  const { t, direction } = useLanguage()
  const [animatedValue, setAnimatedValue] = useState(0)
  
  const percentage = Math.min((currentCalories / goalCalories) * 100, 100)
  const radius = (size - 40) / 2
  const circumference = 2 * Math.PI * radius
  
  // Start from x-axis (270 degrees) and go clockwise
  const startAngle = 270 // Start from bottom (x-axis)
  const endAngle = 270 + (percentage / 100) * 270 // 270 degrees of arc
  
  // Calculate the stroke-dasharray for the progress arc
  // We want 3/4 of a circle (270 degrees out of 360)
  const arcLength = (270 / 360) * circumference
  const progressLength = (percentage / 100) * arcLength
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  // Calculate color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return '#ef4444' // red
    if (percentage < 50) return '#f97316' // orange  
    if (percentage < 75) return '#eab308' // yellow
    if (percentage < 90) return '#22c55e' // green
    return '#06b6d4' // cyan for over 90%
  }

  const progressColor = getProgressColor(percentage)

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Speedometer-style gauge */}
      <div className="relative" style={{ width: size, height: size * 0.75 }}>
        <svg
          width={size}
          height={size * 0.75}
          className="transform -rotate-45"
          viewBox={`0 0 ${size} ${size * 0.75}`}
        >
          {/* Background arc */}
          <path
            d={`M ${size/2 - radius} ${size/2} A ${radius} ${radius} 0 0 1 ${size/2 + radius} ${size/2}`}
            fill="none"
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M ${size/2 - radius} ${size/2} A ${radius} ${radius} 0 0 1 ${size/2 + radius} ${size/2}`}
            fill="none"
            stroke={progressColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${arcLength}`}
            className="transition-all duration-1000 ease-out"
            style={{
              strokeDashoffset: arcLength - progressLength,
            }}
          />
          
          {/* Center dot */}
          <circle
            cx={size/2}
            cy={size/2}
            r="4"
            fill={progressColor}
            className="transition-colors duration-300"
          />
          
          {/* Needle pointing to current progress */}
          <line
            x1={size/2}
            y1={size/2}
            x2={size/2 + (radius - 20) * Math.cos((startAngle + (percentage / 100) * 270) * Math.PI / 180)}
            y2={size/2 + (radius - 20) * Math.sin((startAngle + (percentage / 100) * 270) * Math.PI / 180)}
            stroke={progressColor}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: progressColor }}>
              {Math.round(animatedValue)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </div>

      {/* Stats below gauge */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs text-center">
        <div className="space-y-1">
          <div className="text-lg font-semibold text-blue-600">
            {goalCalories.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{t('home.calories.goal')}</div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold text-purple-600">
            {Math.round(currentCalories).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{t('home.calories.consumed')}</div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold text-green-600">
            {Math.max(0, goalCalories - currentCalories).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">{t('home.calories.remaining')}</div>
        </div>
      </div>
    </div>
  )
}
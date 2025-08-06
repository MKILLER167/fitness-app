"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Target, TrendingUp, Activity } from 'lucide-react'

interface ModernCalorieCounterProps {
  currentCalories: number
  goalCalories: number
  consumedCalories: number
  remainingCalories: number
}

export function ModernCalorieCounter({ 
  currentCalories, 
  goalCalories, 
  consumedCalories, 
  remainingCalories 
}: ModernCalorieCounterProps) {
  const percentage = Math.min((currentCalories / goalCalories) * 100, 100)
  
  // Calculate the angle for the progress (270 degrees max for 3/4 circle)
  const progressAngle = (percentage / 100) * 270
  
  // Create SVG path for the progress arc
  const radius = 80
  const centerX = 100
  const centerY = 100
  const startAngle = 135 // Start from bottom left
  
  const createArcPath = (angle: number) => {
    const endAngle = startAngle + angle
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    
    const startX = centerX + radius * Math.cos(startAngleRad)
    const startY = centerY + radius * Math.sin(startAngleRad)
    const endX = centerX + radius * Math.cos(endAngleRad)
    const endY = centerY + radius * Math.sin(endAngleRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
          <Target className="text-primary" size={20} />
          Daily Calorie Target
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Modern Circular Progress */}
        <div className="relative">
          <svg width="200" height="160" viewBox="0 0 200 200" className="transform -rotate-45">
            {/* Background arc */}
            <path
              d={createArcPath(270)}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d={createArcPath(progressAngle)}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-yellow-600">
              {Math.round(percentage)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Complete
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 w-full text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">
              {currentCalories.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Goal
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">
              {consumedCalories.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Consumed
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">
              {remainingCalories.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Remaining
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
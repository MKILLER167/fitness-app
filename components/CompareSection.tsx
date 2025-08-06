"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity, 
  Target, 
  Flame, 
  Clock,
  BarChart3,
  ArrowRight,
  Trophy
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface CompareSectionProps {
  userProfile?: UserProfile
  userStats?: UserStats
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
}

export function CompareSection({ userProfile, userStats, subscriptionTier = 'free', onPremiumFeatureAccess }: CompareSectionProps) {
  const [compareType, setCompareType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  
  const weeklyComparison = {
    thisWeek: {
      calories: 14800,
      workouts: 5,
      steps: 52000,
      activeMinutes: 280
    },
    lastWeek: {
      calories: 13200,
      workouts: 4,
      steps: 48000,
      activeMinutes: 240
    }
  }
  
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change > 0
    }
  }

  const comparisonData = [
    {
      label: 'Calories Burned',
      current: weeklyComparison.thisWeek.calories,
      previous: weeklyComparison.lastWeek.calories,
      icon: Flame,
      color: 'text-orange-600'
    },
    {
      label: 'Workouts Completed',
      current: weeklyComparison.thisWeek.workouts,
      previous: weeklyComparison.lastWeek.workouts,
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      label: 'Total Steps',
      current: weeklyComparison.thisWeek.steps,
      previous: weeklyComparison.lastWeek.steps,
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Active Minutes',
      current: weeklyComparison.thisWeek.activeMinutes,
      previous: weeklyComparison.lastWeek.activeMinutes,
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress Comparison</h2>
          <p className="text-muted-foreground">Track your improvements over time</p>
        </div>
        <div className="flex gap-2">
          {['weekly', 'monthly', 'yearly'].map((type) => (
            <Button
              key={type}
              variant={compareType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCompareType(type as any)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.map((item, index) => {
          const change = calculateChange(item.current, item.previous)
          const Icon = item.icon
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={item.color} size={20} />
                    <CardTitle className="text-base">{item.label}</CardTitle>
                  </div>
                  <Badge variant={change.isPositive ? 'default' : 'secondary'}>
                    {change.isPositive ? '+' : '-'}{change.percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This {compareType.slice(0, -2)}</span>
                    <span className="font-bold text-lg">{item.current.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last {compareType.slice(0, -2)}</span>
                    <span className="text-muted-foreground">{item.previous.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {change.isPositive ? (
                      <TrendingUp className="text-green-600" size={16} />
                    ) : (
                      <TrendingDown className="text-red-600" size={16} />
                    )}
                    <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
                      {change.percentage}% {change.isPositive ? 'increase' : 'decrease'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            Weekly Progress Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const dayCalories = Math.floor(Math.random() * 500) + 1800
              const maxCalories = 2400
              const percentage = (dayCalories / maxCalories) * 100
              
              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{day}</span>
                    <span className="text-muted-foreground">{dayCalories} cal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-600" size={20} />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">Completed This Week</h4>
              <div className="space-y-2">
                {['7-Day Streak', 'Early Bird Workout', 'Protein Goal'].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Trophy className="text-green-600" size={16} />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-orange-600">In Progress</h4>
              <div className="space-y-2">
                {['Marathon Distance', '30-Day Challenge', 'Strength Builder'].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Clock className="text-orange-600" size={16} />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
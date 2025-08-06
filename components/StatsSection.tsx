"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { FitnessRadarChart } from "./FitnessRadarChart"
import { motion } from 'motion/react'
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Target,
  Award,
  Flame,
  Heart,
  Clock,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface StatsSectionProps {
  userProfile?: UserProfile
  userStats?: UserStats
}

export function StatsSection({ userProfile, userStats }: StatsSectionProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week')

  // Sample data - would come from actual tracking
  const weeklyData = [
    { day: 'Mon', workouts: 1, calories: 2100, steps: 8500, water: 8 },
    { day: 'Tue', workouts: 0, calories: 1950, steps: 6200, water: 6 },
    { day: 'Wed', workouts: 1, calories: 2200, steps: 10200, water: 7 },
    { day: 'Thu', workouts: 1, calories: 1850, steps: 9800, water: 8 },
    { day: 'Fri', workouts: 0, calories: 2050, steps: 7100, water: 5 },
    { day: 'Sat', workouts: 1, calories: 2300, steps: 12000, water: 9 },
    { day: 'Sun', workouts: 0, calories: 1900, steps: 5500, water: 7 }
  ]

  const monthlyStats = {
    totalWorkouts: 18,
    avgCalories: 2057,
    totalSteps: 187500,
    avgWater: 7.2,
    streakDays: 15,
    bestWeek: { week: '3rd week', workouts: 6 },
    improvement: { metric: 'consistency', percentage: 23 }
  }

  const personalBests = [
    { metric: 'Daily Steps', value: '15,234', date: 'March 15', icon: Activity, color: 'text-blue-500' },
    { metric: 'Weekly Workouts', value: '6', date: 'This week', icon: Target, color: 'text-green-500' },
    { metric: 'Streak Days', value: '21', date: 'February', icon: Flame, color: 'text-orange-500' },
    { metric: 'Water Intake', value: '12 glasses', date: 'March 10', icon: Heart, color: 'text-cyan-500' }
  ]

  const milestones = [
    { title: '100 Workouts', progress: 85, current: 85, target: 100, icon: '🏆' },
    { title: '10K Steps Streak', progress: 60, current: 6, target: 10, icon: '👟' },
    { title: 'Perfect Week', progress: 90, current: 9, target: 10, icon: '⭐' },
    { title: 'Hydration Master', progress: 75, current: 15, target: 20, icon: '💧' }
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Fitness Statistics
              </h1>
              <p className="text-muted-foreground">
                Track your progress and analyze your fitness journey
              </p>
            </div>
            <Badge variant="secondary">
              Level {userStats?.level || 1}
            </Badge>
          </div>
          
          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border">
              {(['week', 'month', 'year'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="mx-auto mb-2 text-blue-500" size={24} />
                    <div className="text-2xl font-bold">{monthlyStats.totalWorkouts}</div>
                    <p className="text-sm text-muted-foreground">Workouts This Month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Flame className="mx-auto mb-2 text-orange-500" size={24} />
                    <div className="text-2xl font-bold">{monthlyStats.streakDays}</div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="mx-auto mb-2 text-green-500" size={24} />
                    <div className="text-2xl font-bold">{monthlyStats.avgCalories}</div>
                    <p className="text-sm text-muted-foreground">Avg Calories</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="mx-auto mb-2 text-red-500" size={24} />
                    <div className="text-2xl font-bold">{monthlyStats.avgWater.toFixed(1)}</div>
                    <p className="text-sm text-muted-foreground">Avg Water (glasses)</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <motion.div
                      key={day.day}
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 grid grid-cols-4 gap-2 text-sm">
                        <div className="text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${day.workouts > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-muted-foreground">Workout</span>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{day.calories}</div>
                          <span className="text-xs text-muted-foreground">calories</span>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{(day.steps / 1000).toFixed(1)}k</div>
                          <span className="text-xs text-muted-foreground">steps</span>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{day.water}</div>
                          <span className="text-xs text-muted-foreground">glasses</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Bests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Personal Bests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalBests.map((best, index) => {
                    const Icon = best.icon
                    return (
                      <motion.div
                        key={best.metric}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${best.color}`} />
                          <div>
                            <div className="font-medium">{best.metric}</div>
                            <div className="text-sm text-muted-foreground">{best.date}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">{best.value}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <FitnessRadarChart 
              userProfile={userProfile}
              userStats={userStats}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Detailed Trends Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    We're working on advanced analytics to show your progress over time
                  </p>
                </div>

                {/* Improvement Highlights */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">This Month's Improvements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Workout Consistency</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          +{monthlyStats.improvement.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Average Daily Steps</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          +15%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Milestone Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.title}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{milestone.icon}</span>
                        <span className="font-medium">{milestone.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {milestone.current}/{milestone.target}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {milestone.progress}% complete
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Download your fitness data for personal records or to share with health professionals.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export PDF Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Export CSV Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
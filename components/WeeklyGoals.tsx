"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import { 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  Flame,
  Dumbbell,
  Utensils,
  Droplets,
  TrendingUp,
  Plus,
  Edit,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
  streak: number
  weeklyGoal: number
  weeklyProgress: number
}

interface WeeklyGoal {
  id: string
  type: 'workouts' | 'meals' | 'water' | 'streak'
  target: number
  current: number
  unit: string
  icon: any
  color: string
}

interface WeeklyGoalsProps {
  userStats?: UserStats
  onXPGain?: (xp: number, reason: string) => void
  compact?: boolean
}

export function WeeklyGoals({ userStats, onXPGain, compact = false }: WeeklyGoalsProps) {
  const { language, direction } = useLanguage()
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([])
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date())

  // Initialize weekly goals
  useEffect(() => {
    const startOfWeek = getStartOfWeek(new Date())
    setWeekStartDate(startOfWeek)
    
    const goals: WeeklyGoal[] = [
      {
        id: 'workouts',
        type: 'workouts',
        target: 5,
        current: userStats?.workoutsCompleted || 0,
        unit: language === 'ar' ? 'تمارين' : 'workouts',
        icon: Dumbbell,
        color: 'orange'
      },
      {
        id: 'meals',
        type: 'meals',
        target: 21, // 3 meals per day for 7 days
        current: getMealsThisWeek(),
        unit: language === 'ar' ? 'وجبات' : 'meals',
        icon: Utensils,
        color: 'green'
      },
      {
        id: 'water',
        type: 'water',
        target: 56, // 8 glasses per day for 7 days
        current: getWaterThisWeek(),
        unit: language === 'ar' ? 'أكواب' : 'glasses',
        icon: Droplets,
        color: 'blue'
      },
      {
        id: 'streak',
        type: 'streak',
        target: 7,
        current: Math.min(userStats?.streak || 0, 7),
        unit: language === 'ar' ? 'أيام' : 'days',
        icon: Flame,
        color: 'red'
      }
    ]
    
    setWeeklyGoals(goals)
  }, [userStats, language])

  function getStartOfWeek(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    return new Date(d.setDate(diff))
  }

  function getMealsThisWeek(): number {
    // This would typically come from meal data
    // For now, return a mock value based on current day of week
    const today = new Date().getDay()
    return Math.floor(Math.random() * (today * 3)) + (today * 2)
  }

  function getWaterThisWeek(): number {
    // This would typically come from water intake data
    // For now, return a mock value based on current day of week
    const today = new Date().getDay()
    return Math.floor(Math.random() * (today * 8)) + (today * 6)
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'bg-orange-100 dark:bg-orange-950/30',
          text: 'text-orange-600 dark:text-orange-400',
          progress: 'bg-orange-500'
        }
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-950/30',
          text: 'text-green-600 dark:text-green-400',
          progress: 'bg-green-500'
        }
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/30',
          text: 'text-blue-600 dark:text-blue-400',
          progress: 'bg-blue-500'
        }
      case 'red':
        return {
          bg: 'bg-red-100 dark:bg-red-950/30',
          text: 'text-red-600 dark:text-red-400',
          progress: 'bg-red-500'
        }
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-950/30',
          text: 'text-gray-600 dark:text-gray-400',
          progress: 'bg-gray-500'
        }
    }
  }

  const getWeekProgress = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // Convert Sunday to 7
    return Math.round((dayOfWeek / 7) * 100)
  }

  const getCompletedGoals = () => {
    return weeklyGoals.filter(goal => goal.current >= goal.target).length
  }

  const getTotalProgress = () => {
    const totalProgress = weeklyGoals.reduce((sum, goal) => {
      return sum + Math.min((goal.current / goal.target) * 100, 100)
    }, 0)
    return Math.round(totalProgress / weeklyGoals.length)
  }

  const formatDateRange = () => {
    const endOfWeek = new Date(weekStartDate)
    endOfWeek.setDate(weekStartDate.getDate() + 6)
    
    const startFormatted = weekStartDate.toLocaleDateString(
      language === 'ar' ? 'ar-SA' : 'en-US',
      { month: 'short', day: 'numeric' }
    )
    const endFormatted = endOfWeek.toLocaleDateString(
      language === 'ar' ? 'ar-SA' : 'en-US',
      { month: 'short', day: 'numeric' }
    )
    
    return `${startFormatted} - ${endFormatted}`
  }

  if (compact) {
    // Compact version for home screen
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {language === 'ar' ? 'هدف الأسبوع' : 'Weekly Goal'}
            </CardTitle>
            <Badge variant="outline">
              {getCompletedGoals()}/{weeklyGoals.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={getTotalProgress()} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ar' ? 'التقدم هذا الأسبوع' : 'This week\'s progress'}
              </span>
              <span className="font-medium">{getTotalProgress()}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {language === 'ar' 
                ? `${getCompletedGoals()} أهداف مكتملة هذا الأسبوع`
                : `${getCompletedGoals()} goals completed this week`
              }
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full weekly goals screen
  return (
    <div className="space-y-6" dir={direction}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {language === 'ar' ? 'أهداف الأسبوع' : 'Weekly Goals'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatDateRange()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {getTotalProgress()}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مكتمل' : 'Complete'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{getCompletedGoals()}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'أهداف مكتملة' : 'Goals Completed'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{getWeekProgress()}%</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'من الأسبوع' : 'Week Progress'}
                </p>
              </div>
            </div>
            
            <Progress value={getTotalProgress()} className="h-2 mt-4" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {weeklyGoals.map((goal, index) => {
          const colors = getColorClasses(goal.color)
          const progress = Math.min((goal.current / goal.target) * 100, 100)
          const isCompleted = goal.current >= goal.target
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`${isCompleted ? 'border-green-500/20 bg-green-50/50 dark:bg-green-950/10' : ''} transition-all duration-300 hover:shadow-md`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                      <goal.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm capitalize">
                        {goal.type === 'workouts' && (language === 'ar' ? 'التمارين' : 'Workouts')}
                        {goal.type === 'meals' && (language === 'ar' ? 'الوجبات' : 'Meals')}
                        {goal.type === 'water' && (language === 'ar' ? 'الماء' : 'Water')}
                        {goal.type === 'streak' && (language === 'ar' ? 'التتالي' : 'Streak')}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'الهدف الأسبوعي' : 'Weekly target'}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'ar' ? 'التقدم' : 'Progress'}
                      </span>
                      <span className="font-medium ltr-numbers">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    
                    <Progress value={progress} className="h-2">
                      <div 
                        className={`h-full ${colors.progress} rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </Progress>
                    
                    <div className="flex justify-between text-xs">
                      <span className={`${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {Math.round(progress)}% {language === 'ar' ? 'مكتمل' : 'complete'}
                      </span>
                      {!isCompleted && goal.target - goal.current > 0 && (
                        <span className="text-muted-foreground ltr-numbers">
                          {goal.target - goal.current} {language === 'ar' ? 'متبقي' : 'remaining'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="mt-3 p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {language === 'ar' ? 'تم إنجاز الهدف! 🎉' : 'Goal completed! 🎉'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة هدف' : 'Add Goal'}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {language === 'ar' ? 'تعديل الأهداف' : 'Edit Goals'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Week Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {language === 'ar' ? 'ملخص الأسبوع' : 'Week Summary'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? `أنجزت ${getCompletedGoals()} من ${weeklyGoals.length} أهداف هذا الأسبوع`
                    : `You've completed ${getCompletedGoals()} out of ${weeklyGoals.length} goals this week`
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold ltr-numbers">{getTotalProgress()}%</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'الإجمالي' : 'Overall'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
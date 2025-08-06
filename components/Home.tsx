"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import { 
  Target,
  Plus,
  Flame,
  Droplets,
  Footprints,
  TrendingUp,
  Zap,
  Dumbbell,
  Award,
  ArrowRight,
  Star,
  Users,
  Calendar,
  BarChart3,
  BookOpen,
  Activity,
  Heart,
  Bell,
  Utensils,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  Smile,
  Coffee,
  Moon,
  Sun
} from 'lucide-react'
import { FeatureCard } from './FeatureCard'
import { FlipCard3D } from './3d/FlipCard3D'
import { RotatingCube3D } from './3d/RotatingCube3D'
import { FloatingButton3D } from './3d/FloatingButton3D'
import { AchievementBadge3D } from './3d/AchievementBadge3D'
import { NotificationBell } from './NotificationBell'
import { QuickAddFood } from './QuickAddFood'
import type { UserProfile } from './Onboarding'
import { toast } from 'sonner@2.0.3'

interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  timestamp: Date
  source: 'search' | 'custom' | 'barcode' | 'quick'
  amount: number
  unit: string
  consumedAt?: string
}

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

interface HomeProps {
  userProfile?: UserProfile
  userStats?: UserStats
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
  onManageSubscription?: () => void
}

export function Home({ userProfile, userStats, onXPGain, subscriptionTier = 'free', onPremiumFeatureAccess, onManageSubscription }: HomeProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [todayStreak, setTodayStreak] = useState(false)
  const { t, language, direction } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Load meals from localStorage
  useEffect(() => {
    const loadMeals = () => {
      const savedMeals = localStorage.getItem('fitness_meals')
      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals).map((meal: any) => ({
          ...meal,
          timestamp: new Date(meal.timestamp)
        }))
        setMeals(parsedMeals)
      }
    }
    loadMeals()
  }, [])

  // Check today's activity for streak
  useEffect(() => {
    const today = new Date().toDateString()
    const todayMeals = meals.filter(meal => 
      new Date(meal.timestamp).toDateString() === today
    )
    setTodayStreak(todayMeals.length > 0 || (userStats?.workoutsCompleted || 0) > 0)
  }, [meals, userStats])

  // Simulate loading effect on mount
  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(loadingTimer)
  }, [])

  // Navigation handler
  const handleNavigate = (tab: string) => {
    const event = new CustomEvent('navigateToTab', { detail: tab })
    window.dispatchEvent(event)
  }

  // Quick action handler with more personalized responses
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'meal':
        handleNavigate('meals')
        onXPGain?.(10, 'logging a meal')
        toast.success('Let\'s fuel your body! 🍎', { duration: 1500 })
        break
      case 'workout':
        handleNavigate('workouts')
        onXPGain?.(15, 'starting workout')
        toast.success('Time to get stronger! 💪', { duration: 1500 })
        break
      case 'challenges':
        if (subscriptionTier === 'free' && onPremiumFeatureAccess) {
          if (!onPremiumFeatureAccess('Social Challenges')) {
            return
          }
        }
        handleNavigate('social')
        toast.success('Join the community! 🏆', { duration: 1500 })
        break
      case 'water':
        toast.success('Hydration boost! 💧', {
          description: 'Keep staying hydrated throughout the day'
        })
        onXPGain?.(5, 'water intake')
        break
      case 'quick_log':
        handleNavigate('meals')
        toast.success('Quick logging activated! ⚡', { duration: 1500 })
        break
    }
  }

  // Handle food addition with automatic time
  const handleFoodAdded = (mealData: Omit<MealEntry, 'id' | 'timestamp'>) => {
    const now = new Date()
    const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const newMeal: MealEntry = {
      ...mealData,
      id: Date.now().toString(),
      timestamp: now,
      consumedAt: mealData.consumedAt || currentTimeString
    }

    const updatedMeals = [...meals, newMeal]
    setMeals(updatedMeals)
    localStorage.setItem('fitness_meals', JSON.stringify(updatedMeals))
  }

  const getPersonalizedGreeting = () => {
    const hour = currentTime.getHours()
    const name = userProfile?.name || (language === 'ar' ? 'بطل' : 'Champion')
    
    if (language === 'ar') {
      if (hour < 6) return `ليلة سعيدة، ${name} 🌙`
      if (hour < 12) return `صباح الخير، ${name} ☀️`
      if (hour < 17) return `مساء الخير، ${name} 🌤️`
      if (hour < 21) return `مساء الخير، ${name} 🌅`
      return `ليلة سعيدة، ${name} 🌙`
    } else {
      if (hour < 6) return `Good night, ${name} 🌙`
      if (hour < 12) return `Good morning, ${name} ☀️`
      if (hour < 17) return `Good afternoon, ${name} 🌤️`
      if (hour < 21) return `Good evening, ${name} 🌅`
      return `Good night, ${name} 🌙`
    }
  }

  const getMotivationalMessage = () => {
    const messages = language === 'ar' 
      ? [
          '💪 كل خطوة تقربك من هدفك!',
          '🔥 أنت أقوى مما تعتقد!',
          '⚡ التقدم يحدث يوماً بعد يوم!',
          '🎯 ركز على التقدم وليس الكمال!',
          '🚀 استمر، أنت في الطريق الصحيح!'
        ]
      : [
          '💪 Every step brings you closer to your goals!',
          '🔥 You\'re stronger than you think!',
          '⚡ Progress happens one day at a time!',
          '🎯 Focus on progress, not perfection!',
          '🚀 Keep going, you\'re on the right track!'
        ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getContextualTip = () => {
    const hour = currentTime.getHours()
    const dailyCalories = getDailyTotals().calories
    const calorieTarget = userProfile?.calorieTarget || 2000
    
    if (hour < 10 && dailyCalories < 200) {
      return language === 'ar' 
        ? '🌅 ابدأ يومك بإفطار صحي لتنشيط عقلك وجسمك!'
        : '🌅 Start your day with a healthy breakfast to fuel your mind and body!'
    }
    
    if (hour > 14 && hour < 16 && dailyCalories < calorieTarget * 0.6) {
      return language === 'ar'
        ? '🥗 وقت الغداء! تأكد من الحصول على البروتين والخضروات'
        : '🥗 Lunch time! Make sure to include protein and vegetables'
    }
    
    if (hour > 18 && (userStats?.workoutsCompleted || 0) === 0) {
      return language === 'ar'
        ? '💪 كيف حال التمرين اليوم؟ حتى 10 دقائق تحدث فرقاً!'
        : '💪 How about a quick workout? Even 10 minutes makes a difference!'
    }
    
    return getMotivationalMessage()
  }

  // Calculate daily totals from meals
  const getDailyTotals = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.timestamp)
      mealDate.setHours(0, 0, 0, 0)
      return mealDate.getTime() === today.getTime()
    })

    return todayMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  // Progress data
  const dailyTotals = getDailyTotals()
  const dailyProgress = {
    calories: { current: dailyTotals.calories, target: userProfile?.calorieTarget || 2000 },
    water: { current: 6, target: 8 },
    steps: { current: 7500, target: 10000 }
  }

  const caloriesRemaining = Math.max(0, dailyProgress.calories.target - dailyProgress.calories.current)
  const caloriesProgress = (dailyProgress.calories.current / dailyProgress.calories.target) * 100
  const waterProgress = (dailyProgress.water.current / dailyProgress.water.target) * 100
  const stepsProgress = (dailyProgress.steps.current / dailyProgress.steps.target) * 100

  return (
    <div className="min-h-screen bg-background pb-32" dir={direction}>
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header with Personalization */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-background via-background to-muted/30 p-6 pb-4 rounded-b-3xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-semibold mb-1">
                {getPersonalizedGreeting()}
              </h1>
              <p className="text-muted-foreground text-sm">
                {currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <NotificationBell onNavigate={handleNavigate} />
              
              {/* Streak Indicator */}
              <div className="flex items-center gap-1">
                {todayStreak ? (
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-950/30 px-2 py-1 rounded-full">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {userStats?.streak || 1}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">0</span>
                  </div>
                )}
              </div>
              
              {/* Level Badge */}
              <Badge variant="secondary" className="text-xs">
                {language === 'ar' ? `المستوى ${userStats?.level || 1}` : `Level ${userStats?.level || 1}`}
              </Badge>
              
              {subscriptionTier !== 'free' && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    subscriptionTier === 'pro' ? 'border-purple-300 text-purple-600 bg-purple-50 dark:bg-purple-950/30' :
                    'border-orange-300 text-orange-600 bg-orange-50 dark:bg-orange-950/30'
                  }`}
                >
                  {subscriptionTier === 'pro' ? '✨ Pro' : '👑 Premium'}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Contextual Tip */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {getContextualTip()}
            </p>
          </div>
        </motion.div>

        {/* Today's Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-4"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  {language === 'ar' ? 'تقدم اليوم' : "Today's Progress"}
                </h3>
                <Badge variant={caloriesProgress >= 80 ? "default" : "secondary"} className="text-xs">
                  {Math.round(caloriesProgress)}%
                </Badge>
              </div>
              
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 - (351.86 * Math.min(caloriesProgress, 100)) / 100}
                      className="text-primary transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold ltr-numbers">{dailyProgress.calories.current}</span>
                    <span className="text-xs text-muted-foreground">
                      / {dailyProgress.calories.target} cal
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-950/30 rounded-full mx-auto mb-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-sm font-semibold ltr-numbers">
                    {dailyProgress.water.current}/{dailyProgress.water.target}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'أكواب' : 'glasses'}
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, waterProgress)}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-950/30 rounded-full mx-auto mb-1">
                    <Dumbbell className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="text-sm font-semibold ltr-numbers">
                    {userStats?.workoutsCompleted || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'تمارين' : 'workouts'}
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((userStats?.workoutsCompleted || 0) / 1) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-950/30 rounded-full mx-auto mb-1">
                    <Footprints className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-sm font-semibold ltr-numbers">
                    {(dailyProgress.steps.current / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'خطوات' : 'steps'}
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, stepsProgress)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Redesigned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <Card className="overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {language === 'ar' ? 'تسجيل وجبة' : 'Log Meal'}
                    </h4>
                    <p className="text-xs text-green-100">
                      {language === 'ar' ? 'إضافة سريعة' : 'Quick add'}
                    </p>
                  </div>
                  <QuickAddFood 
                    onFoodAdded={handleFoodAdded}
                    onNavigateToMeals={() => handleNavigate('meals')}
                    onXPGain={onXPGain}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      {language === 'ar' ? 'بدء تمرين' : 'Start Workout'}
                    </h4>
                    <p className="text-xs text-blue-100">
                      {language === 'ar' ? 'بناء القوة' : 'Build strength'}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    onClick={() => handleQuickAction('workout')}
                  >
                    <Dumbbell className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Featured Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {/* Join Challenges */}
            <Card 
              className="overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleQuickAction('challenges')}
            >
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5" />
                    {subscriptionTier === 'free' && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                        {language === 'ar' ? 'مميز' : 'Premium'}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">
                    {language === 'ar' ? 'انضم للتحديات' : 'Join Challenges'}
                  </h4>
                  <p className="text-xs text-purple-100">
                    {language === 'ar' ? 'تنافس مع الآخرين' : 'Compete with others'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workout Plans */}
            <Card 
              className="overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleNavigate('workout-splits')}
            >
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">
                    {language === 'ar' ? 'خطط التمرين' : 'Workout Plans'}
                  </h4>
                  <p className="text-xs text-pink-100">
                    {language === 'ar' ? 'خبراء اللياقة' : 'Expert designed'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Build Strength CTA - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="px-4"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-background via-background to-accent/30 border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    {language === 'ar' ? 'بناء القوة وتحقيق الأهداف' : 'Build Strength & Achieve Goals'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'ar' ? 
                      'سجل تمارينك، تتبع تقدمك، واكتشف إمكانياتك الحقيقية مع نظام التدريب المتقدم' : 
                      'Track workouts, monitor progress, and unlock your true potential with our advanced training system'
                    }
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-950/30 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-yellow-500" />
                      </div>
                      <span className="text-sm">
                        <span className="font-bold ltr-numbers">{userStats?.tiersUnlocked || 2}</span>
                        <span className="text-muted-foreground ml-1">
                          {language === 'ar' ? 'مستويات' : 'Tiers'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-orange-500" />
                      </div>
                      <span className="text-sm">
                        <span className="font-bold ltr-numbers">{userStats?.achievements || 0}</span>
                        <span className="text-muted-foreground ml-1">
                          {language === 'ar' ? 'إنجازات' : 'Achievements'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleNavigate('workouts')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'ابدأ التدريب الآن' : 'Start Training Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
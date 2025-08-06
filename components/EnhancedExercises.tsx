"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Progress } from './ui/progress'
import { ExerciseDatabase } from './strength/ExerciseDatabase'
import { EXERCISE_DATABASE } from './strength/exerciseDatabase'
import { exerciseDatabaseService } from './ExerciseDatabaseService'
import { CustomWorkoutBuilder, type CustomWorkout } from './CustomWorkoutBuilder'
import { useReminderService } from './ReminderService'
import { toast } from 'sonner@2.0.3'
import { useLanguage } from './LanguageContext'
import { 
  Dumbbell, Play, Plus, Timer, Target, TrendingUp, Trophy, 
  Zap, Heart, Calendar, Bell, Filter, SortAsc, Star,
  Users, Clock, Flame, Activity, ChevronRight, Check,
  Trash2, Edit, Share, Copy, BarChart3
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface WorkoutSession {
  id: string
  workoutId?: string
  name: string
  type: 'strength' | 'cardio' | 'flexibility' | 'sport' | 'mixed'
  duration: number
  caloriesBurned: number
  exercises: Array<{
    name: string
    sets?: number
    reps?: number
    weight?: number
    duration?: number
    completed: boolean
  }>
  completedAt: Date
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  notes?: string
}

interface EnhancedExercisesProps {
  userProfile?: UserProfile
  onXPGain?: (xp: number, reason: string) => void
  onWorkoutSkip?: () => Promise<any>
  onPremiumFeatureAccess?: (featureName: string) => boolean
  subscriptionTier?: string
}

export function EnhancedExercises({ 
  userProfile, 
  onXPGain, 
  onWorkoutSkip, 
  onPremiumFeatureAccess,
  subscriptionTier = 'free'
}: EnhancedExercisesProps) {
  const { language } = useLanguage()
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([])
  const [personalRecords, setPersonalRecords] = useState<{ [exerciseId: string]: { weight: number, maxReps: number, date: Date } }>({})
  const [activeTab, setActiveTab] = useState('workouts')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'duration' | 'calories'>('recent')
  const [currentWorkout, setCurrentWorkout] = useState<CustomWorkout | null>(null)
  const [workoutInProgress, setWorkoutInProgress] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [exerciseAnalytics, setExerciseAnalytics] = useState<any>(null)
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([])
  
  // Reminder service
  const { reminderService } = useReminderService()

  // Predefined workouts
  const quickWorkouts: CustomWorkout[] = [
    {
      id: 'quick-1',
      name: language === 'ar' ? 'تمرين سريع عالي الكثافة' : 'Quick HIIT',
      description: language === 'ar' ? 'تمرين عالي الكثافة للجداول المزدحمة' : 'High-intensity interval training for busy schedules',
      category: 'mixed',
      level: 'intermediate',
      duration: 900, // 15 minutes
      exercises: [
        {
          id: '1',
          name: language === 'ar' ? 'القفز بفتح الذراعين' : 'Jumping Jacks',
          category: 'Cardio',
          muscleGroups: [language === 'ar' ? 'الجسم كاملاً' : 'Full Body'],
          duration: 30,
          restTime: 10
        },
        {
          id: '2',
          name: language === 'ar' ? 'تمرين الضغط' : 'Push-ups',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'الصدر' : 'Chest', language === 'ar' ? 'الأكتاف' : 'Shoulders', language === 'ar' ? 'العضلة ثلاثية' : 'Triceps'],
          sets: 3,
          reps: '10-15',
          restTime: 30
        },
        {
          id: '3',
          name: language === 'ar' ? 'القرفصاء' : 'Squats',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'الفخذ الأمامي' : 'Quadriceps', language === 'ar' ? 'المؤخرة' : 'Glutes'],
          sets: 3,
          reps: '15-20',
          restTime: 30
        },
        {
          id: '4',
          name: language === 'ar' ? 'تمرين البلانك' : 'Plank',
          category: 'Core',
          muscleGroups: [language === 'ar' ? 'عضلات البطن' : 'Core'],
          duration: 60,
          restTime: 30
        }
      ],
      tags: ['quick', 'hiit', 'no-equipment'],
      equipment: [],
      targetMuscles: [language === 'ar' ? 'الجسم كاملاً' : 'Full Body'],
      createdAt: new Date(),
      isFavorite: false,
      timesCompleted: 0,
      calories: 75
    },
    {
      id: 'quick-2',
      name: language === 'ar' ? 'تقوية الجزء العلوي' : 'Upper Body Strength',
      description: language === 'ar' ? 'التركيز على بناء قوة الجزء العلوي' : 'Focus on building upper body strength',
      category: 'strength',
      level: 'beginner',
      duration: 1800, // 30 minutes
      exercises: [
        {
          id: '1',
          name: language === 'ar' ? 'تمرين الضغط' : 'Push-ups',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'الصدر' : 'Chest', language === 'ar' ? 'الأكتاف' : 'Shoulders', language === 'ar' ? 'العضلة ثلاثية' : 'Triceps'],
          sets: 3,
          reps: '8-12',
          restTime: 60
        },
        {
          id: '2',
          name: language === 'ar' ? 'العقلة' : 'Pull-ups',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'الظهر' : 'Back', language === 'ar' ? 'العضلة ثنائية' : 'Biceps'],
          sets: 3,
          reps: '5-10',
          restTime: 90
        },
        {
          id: '3',
          name: language === 'ar' ? 'تمرين المتوازي' : 'Dips',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'العضلة ثلاثية' : 'Triceps', language === 'ar' ? 'الصدر' : 'Chest'],
          sets: 3,
          reps: '8-12',
          restTime: 60
        },
        {
          id: '4',
          name: language === 'ar' ? 'ضغط الأكتاف' : 'Pike Push-ups',
          category: 'Bodyweight',
          muscleGroups: [language === 'ar' ? 'الأكتاف' : 'Shoulders'],
          sets: 3,
          reps: '6-10',
          restTime: 60
        }
      ],
      tags: ['strength', 'upper-body', 'bodyweight'],
      equipment: ['Pull-up bar'],
      targetMuscles: [language === 'ar' ? 'الصدر' : 'Chest', language === 'ar' ? 'الظهر' : 'Back', language === 'ar' ? 'الأكتاف' : 'Shoulders', language === 'ar' ? 'الذراعين' : 'Arms'],
      createdAt: new Date(),
      isFavorite: false,
      timesCompleted: 0,
      calories: 150
    }
  ]

  // Load data on mount
  useEffect(() => {
    loadWorkoutSessions()
    loadCustomWorkouts()
    loadPersonalRecords()
    loadExerciseAnalytics()
  }, [userProfile])

  // Load workout sessions
  const loadWorkoutSessions = () => {
    const saved = localStorage.getItem('workout_sessions')
    if (saved) {
      const parsed = JSON.parse(saved).map((session: any) => ({
        ...session,
        completedAt: new Date(session.completedAt)
      }))
      setWorkoutSessions(parsed)
    }
  }

  // Load custom workouts
  const loadCustomWorkouts = () => {
    const saved = localStorage.getItem('custom_workouts')
    if (saved) {
      const parsed = JSON.parse(saved).map((workout: any) => ({
        ...workout,
        createdAt: new Date(workout.createdAt)
      }))
      setCustomWorkouts(parsed)
    }
  }

  // Load personal records
  const loadPersonalRecords = async () => {
    if (!userProfile?.id) return
    
    const result = await exerciseDatabaseService.getPersonalRecords(userProfile.id)
    if (result.success && result.personalRecords) {
      setPersonalRecords(result.personalRecords)
    }
  }

  // Load exercise analytics
  const loadExerciseAnalytics = async () => {
    if (!userProfile?.id) return
    
    const result = await exerciseDatabaseService.getWorkoutAnalytics(userProfile.id)
    if (result.success && result.analytics) {
      setExerciseAnalytics(result.analytics)
    }
  }

  // Save workout sessions
  const saveWorkoutSessions = (sessions: WorkoutSession[]) => {
    localStorage.setItem('workout_sessions', JSON.stringify(sessions))
  }

  // Handle exercise selection from database
  const handleExerciseSelect = (exercise: any) => {
    // Add exercise to current workout or create new workout
    toast.success(`${exercise.name} ${language === 'ar' ? 'تم إضافته للتمرين' : 'added to workout'}`)
  }

  // Save exercise session to database
  const saveExerciseSession = async (exerciseId: string, weight: number, reps: number, sets: number, duration?: number) => {
    if (!userProfile?.id) return

    const session = {
      exerciseId,
      weight,
      reps,
      sets,
      duration,
      date: new Date().toISOString(),
      caloriesBurned: exerciseDatabaseService.calculateCaloriesBurned(exerciseId, duration || 0, userProfile.weight)
    }

    const result = await exerciseDatabaseService.saveExerciseSession(userProfile.id, session)
    
    if (result.success) {
      toast.success(language === 'ar' ? 'تم حفظ جلسة التمرين' : 'Exercise session saved')
      loadPersonalRecords() // Refresh personal records
    } else {
      toast.error(language === 'ar' ? 'خطأ في حفظ جلسة التمرين' : 'Error saving exercise session')
    }
  }

  // Start workout
  const startWorkout = (workout: CustomWorkout) => {
    setCurrentWorkout(workout)
    setWorkoutInProgress(true)
    setWorkoutStartTime(new Date())
    setCompletedExercises([])
    
    toast.success(`${language === 'ar' ? 'بدأ' : 'Started'} ${workout.name}! ${language === 'ar' ? 'هيا نحطم هذا التمرين!' : "Let's crush this workout!"} 💪`)
    
    // Set up workout reminder if skipped
    const reminderTime = new Date()
    reminderTime.setHours(reminderTime.getHours() + 24) // Remind tomorrow
    
    reminderService.addWorkoutReminder({
      title: `${language === 'ar' ? 'متابعة' : 'Continue'} ${workout.name}`,
      workoutType: workout.name,
      time: `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`,
      days: [1, 2, 3, 4, 5, 6, 0], // All days
      isActive: true,
      soundEnabled: true,
      vibrationEnabled: true
    })
  }

  // Complete exercise
  const completeExercise = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId])
      onXPGain?.(20, language === 'ar' ? 'إكمال تمرين' : 'Completing an exercise')
    }
  }

  // Complete workout
  const completeWorkout = async () => {
    if (!currentWorkout || !workoutStartTime) return

    const duration = Math.round((Date.now() - workoutStartTime.getTime()) / 1000)
    const completionPercentage = (completedExercises.length / currentWorkout.exercises.length) * 100

    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: currentWorkout.id,
      name: currentWorkout.name,
      type: currentWorkout.category,
      duration,
      caloriesBurned: Math.round((currentWorkout.calories || 0) * (completionPercentage / 100)),
      exercises: currentWorkout.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        completed: completedExercises.includes(ex.id)
      })),
      completedAt: new Date(),
      difficulty: currentWorkout.level,
      notes: `${language === 'ar' ? 'تم إكمال' : 'Completed'} ${Math.round(completionPercentage)}% ${language === 'ar' ? 'من التمارين' : 'of exercises'}`
    }

    const updatedSessions = [...workoutSessions, session]
    setWorkoutSessions(updatedSessions)
    saveWorkoutSessions(updatedSessions)

    // Update custom workout stats
    const updatedCustomWorkouts = customWorkouts.map(w =>
      w.id === currentWorkout.id
        ? { ...w, timesCompleted: w.timesCompleted + 1 }
        : w
    )
    setCustomWorkouts(updatedCustomWorkouts)
    localStorage.setItem('custom_workouts', JSON.stringify(updatedCustomWorkouts))

    // Award XP based on completion
    const xpGained = Math.round(50 + (completionPercentage * 2))
    onXPGain?.(xpGained, `${language === 'ar' ? 'إكمال تمرين' : 'Completing'} ${currentWorkout.name} ${language === 'ar' ? '' : 'workout'}`)

    // Reset workout state
    setCurrentWorkout(null)
    setWorkoutInProgress(false)
    setWorkoutStartTime(null)
    setCompletedExercises([])

    toast.success(`${language === 'ar' ? 'تم إكمال التمرين! عمل رائع!' : 'Workout completed! Great job!'} 🎉`)
  }

  // Skip workout
  const skipWorkout = async () => {
    if (onWorkoutSkip) {
      const result = await onWorkoutSkip()
      if (result.skipped) {
        setCurrentWorkout(null)
        setWorkoutInProgress(false)
        setWorkoutStartTime(null)
        setCompletedExercises([])
      }
    }
  }

  // Filter and sort workouts
  const getFilteredWorkouts = () => {
    let workouts = [...quickWorkouts, ...customWorkouts]

    if (filterType !== 'all') {
      workouts = workouts.filter(w => w.category === filterType)
    }

    if (filterLevel !== 'all') {
      workouts = workouts.filter(w => w.level === filterLevel)
    }

    return workouts.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'duration':
          return a.duration - b.duration
        case 'calories':
          return (b.calories || 0) - (a.calories || 0)
        case 'recent':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })
  }

  // Calculate stats
  const getStats = () => {
    const thisWeek = workoutSessions.filter(session => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return session.completedAt >= weekAgo
    })

    return {
      totalWorkouts: workoutSessions.length,
      thisWeekWorkouts: thisWeek.length,
      totalMinutes: Math.round(workoutSessions.reduce((sum, s) => sum + s.duration, 0) / 60),
      totalCalories: workoutSessions.reduce((sum, s) => sum + s.caloriesBurned, 0),
      favoriteType: workoutSessions.length > 0 
        ? workoutSessions.reduce((acc, session) => {
            acc[session.type] = (acc[session.type] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        : {}
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Dumbbell className="h-6 w-6" />
              {language === 'ar' ? 'مركز التمارين' : 'Workout Hub'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تتبع التمارين وبناء القوة' : 'Track workouts and build strength'}
            </p>
          </div>
        </div>

        {/* Workout in Progress */}
        {workoutInProgress && currentWorkout && (
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {currentWorkout.name} {language === 'ar' ? 'قيد التقدم' : 'in Progress'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={skipWorkout}>
                    {language === 'ar' ? 'تخطي' : 'Skip'}
                  </Button>
                  <Button onClick={completeWorkout} size="sm">
                    {language === 'ar' ? 'إنهاء' : 'Finish'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {language === 'ar' ? 'التقدم:' : 'Progress:'} {completedExercises.length}/{currentWorkout.exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'}
                  </span>
                  <span>{Math.round((completedExercises.length / currentWorkout.exercises.length) * 100)}% {language === 'ar' ? 'مكتمل' : 'complete'}</span>
                </div>
                <Progress 
                  value={(completedExercises.length / currentWorkout.exercises.length) * 100} 
                  className="h-2"
                />
                
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {currentWorkout.exercises.map(exercise => {
                      const isCompleted = completedExercises.includes(exercise.id)
                      return (
                        <div key={exercise.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                          <div className="flex items-center gap-2">
                            <Button
                              variant={isCompleted ? "default" : "outline"}
                              size="sm"
                              onClick={() => completeExercise(exercise.id)}
                              className="h-6 w-6 p-0"
                            >
                              {isCompleted && <Check className="h-3 w-3" />}
                            </Button>
                            <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                              {exercise.name}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {exercise.sets && exercise.reps && `${exercise.sets} × ${exercise.reps}`}
                            {exercise.duration && `${exercise.duration}s`}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إجمالي التمارين' : 'Total Workouts'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.thisWeekWorkouts}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalMinutes}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'إجمالي الدقائق' : 'Total Minutes'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.totalCalories}</div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'السعرات المحروقة' : 'Calories Burned'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workouts">{language === 'ar' ? 'التمارين' : 'Workouts'}</TabsTrigger>
            <TabsTrigger value="database">{language === 'ar' ? 'التمارين' : 'Exercises'}</TabsTrigger>
            <TabsTrigger value="history">{language === 'ar' ? 'التاريخ' : 'History'}</TabsTrigger>
            <TabsTrigger value="analytics">{language === 'ar' ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          </TabsList>

          {/* Exercises Tab */}
          <TabsContent value="database" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'دليل التمارين' : 'Exercise Guide'}
              </h2>
            </div>
            <ExerciseDatabase
              exercises={EXERCISE_DATABASE}
              personalRecords={personalRecords}
              onExerciseSelect={handleExerciseSelect}
              onPremiumFeatureAccess={onPremiumFeatureAccess}
              userSubscriptionTier={subscriptionTier}
            />
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                {/* Filters remain the same but with language support */}
              </div>
              <CustomWorkoutBuilder onWorkoutCreated={loadCustomWorkouts} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredWorkouts().map(workout => (
                <Card key={workout.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base line-clamp-1">{workout.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">{workout.category}</Badge>
                          <Badge variant="outline" className="capitalize">{workout.level}</Badge>
                        </div>
                      </div>
                      {workout.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workout.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        <span>{Math.round(workout.duration / 60)}{language === 'ar' ? 'د' : 'min'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>{workout.calories || 0} {language === 'ar' ? 'سعرة' : 'cal'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{workout.exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        <span>{workout.timesCompleted} {language === 'ar' ? 'مرات' : 'times'}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => startWorkout(workout)}
                      className="w-full"
                      disabled={workoutInProgress}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'بدء التمرين' : 'Start Workout'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {workoutSessions.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{session.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(session.completedAt).toLocaleDateString()}</span>
                            <span>{Math.round(session.duration / 60)} {language === 'ar' ? 'دقائق' : 'minutes'}</span>
                            <span>{session.caloriesBurned} {language === 'ar' ? 'سعرة' : 'calories'}</span>
                            <Badge variant="outline" className="capitalize">{session.type}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {session.exercises.filter(ex => ex.completed).length}/{session.exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'}
                          </div>
                          <Progress 
                            value={(session.exercises.filter(ex => ex.completed).length / session.exercises.length) * 100}
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {workoutSessions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{language === 'ar' ? 'لا يوجد تاريخ تمارين بعد' : 'No workout history yet'}</p>
                    <p className="text-sm">{language === 'ar' ? 'أكمل أول تمرين لرؤيته هنا' : 'Complete your first workout to see it here'}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {language === 'ar' ? 'الهدف الأسبوعي' : 'Weekly Goal'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.thisWeekWorkouts}/3</div>
                  <Progress value={(stats.thisWeekWorkouts / 3) * 100} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'ar' ? 'تمارين هذا الأسبوع' : 'workouts this week'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {language === 'ar' ? 'متوسط المدة' : 'Average Duration'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {workoutSessions.length > 0 
                      ? Math.round((stats.totalMinutes / workoutSessions.length))
                      : 0}{language === 'ar' ? 'د' : 'min'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'لكل تمرين' : 'per workout'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    {language === 'ar' ? 'أفضل سلسلة' : 'Best Streak'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'أيام متتالية' : 'consecutive days'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
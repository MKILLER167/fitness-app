"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useLanguage } from './LanguageContext'
import { toast } from "sonner@2.0.3"
import { Shield, Trophy, Dumbbell, Plus, Target, TrendingUp, Award } from 'lucide-react'

import { EXERCISE_DATABASE } from './strength/exerciseDatabase'
import { type WorkoutRecord, type WorkoutData } from './strength/strengthTypes'
import { 
  EXERCISE_TIERS, 
  ExerciseTier, 
  ExerciseTierProgress, 
  getTierForExercise,
  getNextTierForExercise 
} from './strength/exerciseTiers'
import { TierAchievementPopup } from './strength/TierAchievementPopup'
import { TierTracker } from './strength/TierTracker'
import { WorkoutLogger } from './strength/WorkoutLogger'

interface StrengthTrainingProps {
  onXPGain?: (xp: number, reason: string) => void
}

export function StrengthTraining({ onXPGain }: StrengthTrainingProps) {
  const { direction } = useLanguage()
  
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([])
  const [exerciseTierProgress, setExerciseTierProgress] = useState<Record<string, ExerciseTierProgress>>({})
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISE_DATABASE[0] | null>(null)
  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState(false)
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    sets: [{ reps: 0, weight: 0 }],
    notes: ''
  })
  
  // Achievement popup state
  const [achievementPopup, setAchievementPopup] = useState<{
    tier: ExerciseTier | null
    exerciseName: string
    isVisible: boolean
  }>({
    tier: null,
    exerciseName: '',
    isVisible: false
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'tiers'>('overview')

  // Load workout records and tier progress on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('strength_workout_records')
    const savedTierProgress = localStorage.getItem('exercise_tier_progress')
    
    if (savedRecords) {
      const records = JSON.parse(savedRecords).map((record: any) => ({
        ...record,
        date: new Date(record.date)
      }))
      setWorkoutRecords(records)
    }
    
    if (savedTierProgress) {
      setExerciseTierProgress(JSON.parse(savedTierProgress))
    } else {
      // Initialize tier progress for all exercises
      const initialProgress: Record<string, ExerciseTierProgress> = {}
      EXERCISE_DATABASE.forEach(exercise => {
        initialProgress[exercise.id] = {
          exerciseId: exercise.id,
          currentTier: 0,
          highestWeight: 0,
          highestReps: 0,
          unlockedTiers: [],
          totalWorkouts: 0
        }
      })
      setExerciseTierProgress(initialProgress)
    }
  }, [])

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('strength_workout_records', JSON.stringify(workoutRecords))
  }, [workoutRecords])

  useEffect(() => {
    localStorage.setItem('exercise_tier_progress', JSON.stringify(exerciseTierProgress))
  }, [exerciseTierProgress])

  const getPersonalBest = (exerciseId: string) => {
    const exerciseRecords = workoutRecords.filter(record => record.exerciseId === exerciseId)
    if (exerciseRecords.length === 0) return null

    let bestWeight = 0
    let bestReps = 0

    exerciseRecords.forEach(record => {
      record.sets.forEach(set => {
        if (set.weight > bestWeight || (set.weight === bestWeight && set.reps > bestReps)) {
          bestWeight = set.weight
          bestReps = set.reps
        }
      })
    })

    return { weight: bestWeight, reps: bestReps }
  }

  const handleTierUnlocked = (tier: ExerciseTier, exerciseName: string) => {
    setAchievementPopup({
      tier,
      exerciseName,
      isVisible: true
    })
    
    toast.success(`🎉 Tier Unlocked: ${tier.name}!`)
    onXPGain?.(tier.achievement.xpReward, `Unlocked ${tier.name} tier`)
  }

  const logWorkout = () => {
    if (!selectedExercise || workoutData.sets.length === 0) return
    
    const validSets = workoutData.sets.filter(set => set.reps > 0 && set.weight > 0)
    if (validSets.length === 0) return

    const newRecord: WorkoutRecord = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      date: new Date(),
      sets: validSets,
      notes: workoutData.notes
    }
    
    // Update workout records
    setWorkoutRecords(prev => [...prev, newRecord])
    
    // Update tier progress
    const bestSet = validSets.reduce((best, current) => {
      if (current.weight > best.weight) return current
      if (current.weight === best.weight && current.reps > best.reps) return current
      return best
    }, validSets[0])

    const currentProgress = exerciseTierProgress[selectedExercise.id] || {
      exerciseId: selectedExercise.id,
      currentTier: 0,
      highestWeight: 0,
      highestReps: 0,
      unlockedTiers: [],
      totalWorkouts: 0
    }

    const isNewPB = bestSet.weight > currentProgress.highestWeight ||
      (bestSet.weight === currentProgress.highestWeight && bestSet.reps > currentProgress.highestReps)

    if (isNewPB) {
      const newTier = getTierForExercise(selectedExercise.id, bestSet.weight, bestSet.reps)
      const previousHighestTier = currentProgress.unlockedTiers.length > 0 ? 
        Math.max(...currentProgress.unlockedTiers) : 0

      setExerciseTierProgress(prev => ({
        ...prev,
        [selectedExercise.id]: {
          ...currentProgress,
          highestWeight: Math.max(currentProgress.highestWeight, bestSet.weight),
          highestReps: bestSet.weight === currentProgress.highestWeight ? 
            Math.max(currentProgress.highestReps, bestSet.reps) : bestSet.reps,
          totalWorkouts: currentProgress.totalWorkouts + 1,
          lastWorkout: new Date(),
          currentTier: newTier ? newTier.level : currentProgress.currentTier,
          unlockedTiers: newTier && !currentProgress.unlockedTiers.includes(newTier.level) ?
            [...currentProgress.unlockedTiers, newTier.level] : currentProgress.unlockedTiers
        }
      }))

      // Check if new tier was unlocked
      if (newTier && newTier.level > previousHighestTier) {
        handleTierUnlocked(newTier, selectedExercise.name)
      }
    } else {
      // Just update workout count
      setExerciseTierProgress(prev => ({
        ...prev,
        [selectedExercise.id]: {
          ...currentProgress,
          totalWorkouts: currentProgress.totalWorkouts + 1,
          lastWorkout: new Date()
        }
      }))
    }
    
    setIsLogWorkoutOpen(false)
    setWorkoutData({ sets: [{ reps: 0, weight: 0 }], notes: '' })
    setSelectedExercise(null)
    
    toast.success(`Workout logged for ${selectedExercise.name}!`)
    onXPGain?.(25, `Completed ${selectedExercise.name} workout`)
  }

  const getTotalTiersUnlocked = () => {
    return Object.values(exerciseTierProgress).reduce((total, progress) => {
      return total + progress.unlockedTiers.length
    }, 0)
  }

  const getTotalWorkouts = () => {
    return Object.values(exerciseTierProgress).reduce((total, progress) => {
      return total + progress.totalWorkouts
    }, 0)
  }

  const getHighestTierLevel = () => {
    let highest = 0
    Object.values(exerciseTierProgress).forEach(progress => {
      if (progress.unlockedTiers.length > 0) {
        highest = Math.max(highest, Math.max(...progress.unlockedTiers))
      }
    })
    return highest
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'tiers', label: 'Tiers', icon: Trophy }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="text-yellow-600 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{getTotalTiersUnlocked()}</div>
            <div className="text-sm text-muted-foreground">Tiers Unlocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Dumbbell className="text-blue-600 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{getTotalWorkouts()}</div>
            <div className="text-sm text-muted-foreground">Total Workouts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="text-purple-600 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{getHighestTierLevel()}</div>
            <div className="text-sm text-muted-foreground">Highest Tier</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="text-green-600 mx-auto mb-2" size={24} />
            <div className="font-bold text-lg">{EXERCISE_DATABASE.length}</div>
            <div className="text-sm text-muted-foreground">Exercises</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={20} />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(exerciseTierProgress)
              .filter(([_, progress]) => progress.unlockedTiers.length > 0)
              .slice(0, 5)
              .map(([exerciseId, progress]) => {
                const exercise = EXERCISE_DATABASE.find(ex => ex.id === exerciseId)
                const highestTier = Math.max(...progress.unlockedTiers)
                const tier = EXERCISE_TIERS[exerciseId]?.find(t => t.level === highestTier)
                
                if (!exercise || !tier) return null

                return (
                  <div key={exerciseId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-lg">{tier.badge3d}</span>
                      </div>
                      <div>
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">{exercise.name}</div>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                      Level {tier.level}
                    </Badge>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderExercises = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exercise Database</h3>
        <Button onClick={() => setIsLogWorkoutOpen(true)}>
          <Plus size={16} className="mr-2" />
          Log Workout
        </Button>
      </div>

      <div className="grid gap-4">
        {EXERCISE_DATABASE.map(exercise => {
          const progress = exerciseTierProgress[exercise.id]
          const personalBest = getPersonalBest(exercise.id)
          const currentTier = progress && progress.unlockedTiers.length > 0 ?
            EXERCISE_TIERS[exercise.id]?.find(t => t.level === Math.max(...progress.unlockedTiers)) : null

          return (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <div className="text-sm text-muted-foreground capitalize">
                      {exercise.category} • {exercise.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentTier && (
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{currentTier.badge3d}</span>
                        <Badge variant="secondary" className="text-xs">
                          {currentTier.name}
                        </Badge>
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedExercise(exercise)
                        setIsLogWorkoutOpen(true)
                      }}
                    >
                      Log
                    </Button>
                  </div>
                </div>
                
                {personalBest && (
                  <div className="text-sm text-muted-foreground">
                    Personal Best: {personalBest.weight}kg × {personalBest.reps} reps
                  </div>
                )}
                
                {progress && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {progress.totalWorkouts} workouts • {progress.unlockedTiers.length} tiers unlocked
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderTiers = () => (
    <div className="space-y-6">
      {selectedExercise ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedExercise(null)}
            >
              ← Back
            </Button>
            <h3 className="text-lg font-semibold">{selectedExercise.name} Tiers</h3>
          </div>
          <TierTracker
            exerciseId={selectedExercise.id}
            userProgress={exerciseTierProgress[selectedExercise.id] || {
              exerciseId: selectedExercise.id,
              currentTier: 0,
              highestWeight: 0,
              highestReps: 0,
              unlockedTiers: [],
              totalWorkouts: 0
            }}
            onTierUnlocked={handleTierUnlocked}
          />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select an Exercise to View Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXERCISE_DATABASE.map(exercise => {
              const progress = exerciseTierProgress[exercise.id]
              const tiersCount = EXERCISE_TIERS[exercise.id]?.length || 0
              const unlockedCount = progress?.unlockedTiers.length || 0
              
              return (
                <Card 
                  key={exercise.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{exercise.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {unlockedCount} / {tiersCount} tiers unlocked
                        </div>
                      </div>
                      <div className="text-right">
                        {unlockedCount > 0 && (
                          <Badge variant="secondary">
                            {Math.round((unlockedCount / tiersCount) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={`p-6 space-y-6 pb-32 ${direction === 'rtl' ? 'text-right' : ''}`}>
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Strength Training 💪</h1>
        <p className="text-muted-foreground">Track your lifts and unlock achievement tiers</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'exercises' && renderExercises()}
      {activeTab === 'tiers' && renderTiers()}

      {/* Workout Logger */}
      <WorkoutLogger
        isOpen={isLogWorkoutOpen}
        onClose={() => setIsLogWorkoutOpen(false)}
        exercises={EXERCISE_DATABASE}
        selectedExercise={selectedExercise}
        onExerciseSelect={setSelectedExercise}
        workoutData={workoutData}
        onWorkoutDataChange={setWorkoutData}
        onLogWorkout={logWorkout}
        onTierUnlocked={handleTierUnlocked}
        currentPersonalBest={selectedExercise ? getPersonalBest(selectedExercise.id) : undefined}
      />

      {/* Achievement Popup */}
      <TierAchievementPopup
        tier={achievementPopup.tier}
        exerciseName={achievementPopup.exerciseName}
        isVisible={achievementPopup.isVisible}
        onClose={() => setAchievementPopup({ tier: null, exerciseName: '', isVisible: false })}
        onShare={() => {
          if (achievementPopup.tier) {
            navigator.clipboard.writeText(
              `🎉 Just unlocked ${achievementPopup.tier.achievement.title} in ${achievementPopup.exerciseName}! 💪 #FitTracker #Achievement`
            )
            toast.success('Achievement shared to clipboard!')
          }
        }}
      />
    </div>
  )
}
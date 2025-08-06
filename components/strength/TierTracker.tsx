"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Lock,
  Unlock,
  Star,
  Award
} from 'lucide-react'
import { EXERCISE_TIERS, ExerciseTier, ExerciseTierProgress, getTierForExercise, getNextTierForExercise, calculateTierProgress } from './exerciseTiers'
import { EXERCISE_DATABASE } from './exerciseDatabase'

interface TierTrackerProps {
  exerciseId: string
  userProgress: ExerciseTierProgress
  onTierUnlocked: (tier: ExerciseTier) => void
}

export function TierTracker({ exerciseId, userProgress, onTierUnlocked }: TierTrackerProps) {
  const [selectedTierLevel, setSelectedTierLevel] = useState<number | null>(null)
  
  const exercise = EXERCISE_DATABASE.find(ex => ex.id === exerciseId)
  const tiers = EXERCISE_TIERS[exerciseId] || []
  const currentTier = getTierForExercise(exerciseId, userProgress.highestWeight, userProgress.highestReps)
  const nextTier = getNextTierForExercise(exerciseId, userProgress.highestWeight, userProgress.highestReps)
  const progressToNext = calculateTierProgress(exerciseId, userProgress.highestWeight, userProgress.highestReps)

  if (!exercise || tiers.length === 0) {
    return null
  }

  const getTierStatus = (tier: ExerciseTier) => {
    if (userProgress.unlockedTiers.includes(tier.level)) {
      return 'unlocked'
    } else if (currentTier && tier.level <= currentTier.level) {
      return 'current'
    } else {
      return 'locked'
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'unlocked':
        return 'default'
      case 'current':
        return 'secondary'
      case 'locked':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unlocked':
        return <Unlock className="text-green-600" size={14} />
      case 'current':
        return <Target className="text-blue-600" size={14} />
      case 'locked':
        return <Lock className="text-gray-400" size={14} />
      default:
        return <Lock className="text-gray-400" size={14} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-orange-500" size={20} />
            {exercise.name} - Tier Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Tier Display */}
          {currentTier ? (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTier.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{currentTier.badge3d}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-300">{currentTier.name}</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">{currentTier.description}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Current Tier
              </Badge>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border text-center">
              <p className="text-muted-foreground">No tier unlocked yet. Start training to unlock your first tier!</p>
            </div>
          )}

          {/* Next Tier Progress */}
          {nextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Next Tier: {nextTier.name}</h4>
                <span className="text-sm text-muted-foreground">{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className="font-medium">{userProgress.highestWeight}kg</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target: </span>
                  <span className="font-medium">{nextTier.weightRequirement}kg</span>
                </div>
                {nextTier.repsRequirement && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Current Reps: </span>
                      <span className="font-medium">{userProgress.highestReps}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target Reps: </span>
                      <span className="font-medium">{nextTier.repsRequirement}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="font-semibold text-lg">{userProgress.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Total Workouts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{userProgress.unlockedTiers.length}</div>
              <div className="text-xs text-muted-foreground">Tiers Unlocked</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{userProgress.highestWeight}kg</div>
              <div className="text-xs text-muted-foreground">Personal Best</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-purple-500" size={20} />
            All Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {tiers.map((tier, index) => {
              const status = getTierStatus(tier)
              const isSelected = selectedTierLevel === tier.level
              
              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : status === 'unlocked'
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                        : status === 'current'
                          ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                  } ${status === 'locked' ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedTierLevel(isSelected ? null : tier.level)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center shadow-sm ${
                        status === 'locked' ? 'grayscale' : ''
                      }`}>
                        <span className="text-lg">{tier.badge3d}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{tier.name}</h4>
                          {getStatusIcon(status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getBadgeVariant(status)}>
                        Level {tier.level}
                      </Badge>
                      {status === 'unlocked' && (
                        <div className="text-xs text-green-600 mt-1">
                          +{tier.achievement.xpReward} XP
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Weight Required:</span>
                          <div className="font-medium">{tier.weightRequirement}kg</div>
                        </div>
                        {tier.repsRequirement && (
                          <div>
                            <span className="text-muted-foreground">Reps Required:</span>
                            <div className="font-medium">{tier.repsRequirement}</div>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-background/50 rounded-md">
                        <div className="font-medium text-sm mb-1">Achievement Reward:</div>
                        <div className="text-sm text-muted-foreground">
                          "{tier.achievement.subtitle}"
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">+{tier.achievement.xpReward} XP</Badge>
                          <Badge className={`bg-gradient-to-r ${tier.color} text-white`}>
                            {tier.achievement.badgeType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
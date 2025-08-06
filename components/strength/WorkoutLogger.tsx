import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Plus, Trophy, Target } from 'lucide-react'
import { useLanguage } from '../LanguageContext'
import { Badge } from '../ui/badge'
import type { Exercise } from './exerciseDatabase'
import type { WorkoutData } from './strengthTypes'
import { getTierForExercise, getNextTierForExercise, ExerciseTier } from './exerciseTiers'

interface WorkoutLoggerProps {
  isOpen: boolean
  onClose: () => void
  exercises: Exercise[]
  selectedExercise: Exercise | null
  onExerciseSelect: (exercise: Exercise | null) => void
  workoutData: WorkoutData
  onWorkoutDataChange: (data: WorkoutData) => void
  onLogWorkout: () => void
  onTierUnlocked?: (tier: ExerciseTier, exerciseName: string) => void
  currentPersonalBest?: { weight: number; reps: number }
}

export function WorkoutLogger({
  isOpen,
  onClose,
  exercises,
  selectedExercise,
  onExerciseSelect,
  workoutData,
  onWorkoutDataChange,
  onLogWorkout,
  onTierUnlocked,
  currentPersonalBest
}: WorkoutLoggerProps) {
  const { direction } = useLanguage()

  const addSet = () => {
    onWorkoutDataChange({
      ...workoutData,
      sets: [...workoutData.sets, { reps: 0, weight: 0 }]
    })
  }

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    onWorkoutDataChange({
      ...workoutData,
      sets: workoutData.sets.map((set, i) => 
        i === index ? { ...set, [field]: value } : set
      )
    })
  }

  const handleLogWorkout = () => {
    if (!selectedExercise || workoutData.sets.length === 0) return

    // Find the best set from this workout
    const bestSet = workoutData.sets.reduce((best, current) => {
      if (current.weight > best.weight) return current
      if (current.weight === best.weight && current.reps > best.reps) return current
      return best
    }, workoutData.sets[0])

    // Check if this is a new personal best
    const isNewPB = !currentPersonalBest || 
      bestSet.weight > currentPersonalBest.weight ||
      (bestSet.weight === currentPersonalBest.weight && bestSet.reps > currentPersonalBest.reps)

    if (isNewPB && onTierUnlocked) {
      // Check if this unlocks a new tier
      const previousTier = currentPersonalBest ? 
        getTierForExercise(selectedExercise.id, currentPersonalBest.weight, currentPersonalBest.reps) : null
      const newTier = getTierForExercise(selectedExercise.id, bestSet.weight, bestSet.reps)

      if (newTier && (!previousTier || newTier.level > previousTier.level)) {
        // New tier unlocked!
        onTierUnlocked(newTier, selectedExercise.name)
      }
    }

    onLogWorkout()
  }

  // Get tier information for current workout
  const getCurrentWorkoutTier = () => {
    if (!selectedExercise || workoutData.sets.length === 0) return null
    
    const bestSet = workoutData.sets.reduce((best, current) => {
      if (current.weight > best.weight) return current
      if (current.weight === best.weight && current.reps > best.reps) return current
      return best
    }, workoutData.sets[0])

    if (bestSet.weight === 0 && bestSet.reps === 0) return null

    return getTierForExercise(selectedExercise.id, bestSet.weight, bestSet.reps)
  }

  const getNextTierInfo = () => {
    if (!selectedExercise || workoutData.sets.length === 0) return null
    
    const bestSet = workoutData.sets.reduce((best, current) => {
      if (current.weight > best.weight) return current
      if (current.weight === best.weight && current.reps > best.reps) return current
      return best
    }, workoutData.sets[0])

    if (bestSet.weight === 0 && bestSet.reps === 0) return null

    return getNextTierForExercise(selectedExercise.id, bestSet.weight, bestSet.reps)
  }

  const currentTier = getCurrentWorkoutTier()
  const nextTier = getNextTierInfo()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="text-orange-500" size={20} />
            Log Workout
          </DialogTitle>
          <DialogDescription>
            Record your sets, reps, and weights for this exercise
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Exercise</Label>
            <Select 
              value={selectedExercise?.id || ''} 
              onValueChange={(value) => onExerciseSelect(exercises.find(e => e.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map(exercise => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedExercise && (
            <>
              {/* Personal Best Display */}
              {currentPersonalBest && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-blue-600" size={16} />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Current Personal Best
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    {currentPersonalBest.weight}kg × {currentPersonalBest.reps} reps
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label>Sets</Label>
                {workoutData.sets.map((set, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Reps</Label>
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Weight (kg)</Label>
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    {/* Show if this set beats PB */}
                    {currentPersonalBest && set.weight > 0 && set.reps > 0 && (
                      (set.weight > currentPersonalBest.weight || 
                       (set.weight === currentPersonalBest.weight && set.reps > currentPersonalBest.reps)) && (
                        <div className="text-green-600">
                          <Trophy size={16} />
                        </div>
                      )
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addSet} className="w-full">
                  <Plus size={16} className={direction === 'rtl' ? 'ml-2' : 'mr-2'} />
                  Add Set
                </Button>
              </div>

              {/* Current Tier Preview */}
              {currentTier && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{currentTier.badge3d}</span>
                    <div>
                      <div className="text-sm font-medium text-green-800 dark:text-green-300">
                        {currentTier.name}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        This workout qualifies for this tier!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Tier Preview */}
              {nextTier && (
                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg opacity-60">{nextTier.badge3d}</span>
                      <div>
                        <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                          Next: {nextTier.name}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                          {nextTier.weightRequirement}kg
                          {nextTier.repsRequirement && ` × ${nextTier.repsRequirement} reps`}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      +{nextTier.achievement.xpReward} XP
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <Label>Notes (optional)</Label>
                <Input
                  value={workoutData.notes}
                  onChange={(e) => onWorkoutDataChange({ ...workoutData, notes: e.target.value })}
                  placeholder="How did it feel?"
                />
              </div>

              <Button 
                onClick={handleLogWorkout} 
                className="w-full"
                disabled={workoutData.sets.length === 0 || workoutData.sets.every(set => set.weight === 0 && set.reps === 0)}
              >
                <Trophy size={16} className="mr-2" />
                Log Workout
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
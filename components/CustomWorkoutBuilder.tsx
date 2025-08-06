"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from 'sonner@2.0.3'
import { Plus, Minus, Save, Clock, Target, Dumbbell, Trash2, Search, Play, Timer } from 'lucide-react'

interface WorkoutExercise {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  sets?: number
  reps?: string
  weight?: number
  duration?: number
  restTime?: number
  notes?: string
  instructions?: string[]
}

interface CustomWorkout {
  id: string
  name: string
  description?: string
  category: 'strength' | 'cardio' | 'flexibility' | 'sport' | 'mixed'
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  exercises: WorkoutExercise[]
  tags: string[]
  equipment: string[]
  targetMuscles: string[]
  createdAt: Date
  isFavorite: boolean
  timesCompleted: number
  rating?: number
  calories?: number
}

interface CustomWorkoutBuilderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onWorkoutCreated?: (workout: CustomWorkout) => void
  editWorkout?: CustomWorkout | null
}

// Exercise database
const exerciseDatabase: Omit<WorkoutExercise, 'id' | 'sets' | 'reps' | 'weight' | 'duration' | 'restTime' | 'notes'>[] = [
  {
    name: 'Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    instructions: ['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat']
  },
  {
    name: 'Squats',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    instructions: ['Stand with feet shoulder-width apart', 'Lower body as if sitting', 'Return to standing', 'Repeat']
  },
  {
    name: 'Pull-ups',
    category: 'Bodyweight',
    muscleGroups: ['Back', 'Biceps'],
    instructions: ['Hang from bar', 'Pull body up until chin over bar', 'Lower with control', 'Repeat']
  },
  {
    name: 'Deadlifts',
    category: 'Weightlifting',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    instructions: ['Stand with feet hip-width apart', 'Bend at hips and knees', 'Lift weight keeping back straight', 'Return to standing']
  },
  {
    name: 'Bench Press',
    category: 'Weightlifting',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    instructions: ['Lie on bench', 'Lower bar to chest', 'Press bar up', 'Repeat']
  },
  {
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core'],
    instructions: ['Maintain steady pace', 'Focus on breathing', 'Land on midfoot', 'Keep posture upright']
  },
  {
    name: 'Burpees',
    category: 'HIIT',
    muscleGroups: ['Full Body'],
    instructions: ['Start standing', 'Drop to plank', 'Do push-up', 'Jump feet to hands', 'Jump up with arms overhead']
  },
  {
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Shoulders'],
    instructions: ['Start in push-up position', 'Lower to forearms', 'Keep body straight', 'Hold position']
  },
  {
    name: 'Lunges',
    category: 'Bodyweight',
    muscleGroups: ['Quadriceps', 'Glutes'],
    instructions: ['Step forward', 'Lower back knee to ground', 'Push back to starting position', 'Alternate legs']
  },
  {
    name: 'Bicep Curls',
    category: 'Weightlifting',
    muscleGroups: ['Biceps'],
    instructions: ['Hold weights at sides', 'Curl weights to shoulders', 'Lower with control', 'Repeat']
  }
]

export function CustomWorkoutBuilder({ 
  open = false, 
  onOpenChange, 
  onWorkoutCreated,
  editWorkout = null 
}: CustomWorkoutBuilderProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [workoutName, setWorkoutName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CustomWorkout['category']>('strength')
  const [level, setLevel] = useState<CustomWorkout['level']>('beginner')
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [newEquipment, setNewEquipment] = useState('')
  
  // Exercise search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof exerciseDatabase>([])
  const [activeTab, setActiveTab] = useState('exercises')

  // Load edit workout data
  useEffect(() => {
    if (editWorkout) {
      setWorkoutName(editWorkout.name)
      setDescription(editWorkout.description || '')
      setCategory(editWorkout.category)
      setLevel(editWorkout.level)
      setExercises(editWorkout.exercises)
      setTags(editWorkout.tags)
      setEquipment(editWorkout.equipment)
    }
  }, [editWorkout])

  // Search exercises
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const filtered = exerciseDatabase.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    setSearchResults(filtered)
  }, [searchQuery])

  // Calculate total workout duration
  const calculateDuration = (): number => {
    return exercises.reduce((total, exercise) => {
      if (exercise.duration) {
        return total + exercise.duration
      }
      if (exercise.sets && exercise.restTime) {
        // Estimate time based on sets and rest
        const exerciseTime = exercise.sets * 30 // 30 seconds per set
        const restTime = (exercise.sets - 1) * exercise.restTime
        return total + exerciseTime + restTime
      }
      return total + 180 // Default 3 minutes per exercise
    }, 0)
  }

  // Add exercise to workout
  const addExercise = (exerciseTemplate: typeof exerciseDatabase[0]) => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      ...exerciseTemplate,
      sets: 3,
      reps: '8-12',
      restTime: 60
    }
    setExercises(prev => [...prev, newExercise])
    setSearchQuery('')
    setSearchResults([])
  }

  // Update exercise
  const updateExercise = (id: string, updates: Partial<WorkoutExercise>) => {
    setExercises(prev =>
      prev.map(ex => ex.id === id ? { ...ex, ...updates } : ex)
    )
  }

  // Remove exercise
  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id))
  }

  // Move exercise up/down
  const moveExercise = (id: string, direction: 'up' | 'down') => {
    setExercises(prev => {
      const index = prev.findIndex(ex => ex.id === id)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newExercises = [...prev]
      ;[newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]]
      return newExercises
    })
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  // Add equipment
  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment(prev => [...prev, newEquipment.trim()])
      setNewEquipment('')
    }
  }

  // Save workout
  const saveWorkout = () => {
    if (!workoutName.trim()) {
      toast.error('Please enter a workout name')
      return
    }

    if (exercises.length === 0) {
      toast.error('Please add at least one exercise')
      return
    }

    const workout: CustomWorkout = {
      id: editWorkout?.id || Date.now().toString(),
      name: workoutName.trim(),
      description: description.trim() || undefined,
      category,
      level,
      duration: calculateDuration(),
      exercises,
      tags,
      equipment,
      targetMuscles: [...new Set(exercises.flatMap(ex => ex.muscleGroups))],
      createdAt: editWorkout?.createdAt || new Date(),
      isFavorite: editWorkout?.isFavorite || false,
      timesCompleted: editWorkout?.timesCompleted || 0,
      rating: editWorkout?.rating,
      calories: Math.round(calculateDuration() * 5) // Rough estimate: 5 calories per minute
    }

    // Save to localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('custom_workouts') || '[]')
    if (editWorkout) {
      const index = savedWorkouts.findIndex((w: CustomWorkout) => w.id === editWorkout.id)
      if (index >= 0) {
        savedWorkouts[index] = workout
      }
    } else {
      savedWorkouts.push(workout)
    }
    localStorage.setItem('custom_workouts', JSON.stringify(savedWorkouts))

    toast.success(editWorkout ? 'Workout updated successfully!' : 'Custom workout created successfully!')
    onWorkoutCreated?.(workout)
    resetForm()
    handleOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setWorkoutName('')
    setDescription('')
    setCategory('strength')
    setLevel('beginner')
    setExercises([])
    setTags([])
    setEquipment([])
    setSearchQuery('')
    setSearchResults([])
  }

  // Handle open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    if (!open && !editWorkout) {
      resetForm()
    }
  }

  const duration = calculateDuration()

  return (
    <Dialog open={isOpen || open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {editWorkout ? 'Edit Custom Workout' : 'Create Custom Workout'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="exercises">Exercises ({exercises.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workout-name">Workout Name *</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value: CustomWorkout['category']) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={level} onValueChange={(value: CustomWorkout['level']) => setLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estimated Duration</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Timer className="h-4 w-4" />
                  <span>{Math.round(duration / 60)} minutes</span>
                  <span className="text-muted-foreground">({duration} seconds)</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your workout routine..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4 mt-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
              {/* Exercise Search */}
              <div className="space-y-4">
                <div>
                  <Label>Add Exercises</Label>
                  <div className="flex gap-2">
                    <Search className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search exercises..."
                      className="flex-1"
                    />
                  </div>
                </div>

                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {(searchResults.length > 0 ? searchResults : exerciseDatabase.slice(0, 10)).map((exercise, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-accent" onClick={() => addExercise(exercise)}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground">{exercise.category}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {exercise.muscleGroups.map(muscle => (
                                  <Badge key={muscle} variant="outline" className="text-xs">
                                    {muscle}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Current Exercises */}
              <div className="space-y-4">
                <Label>Workout Exercises</Label>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {exercises.map((exercise, index) => (
                      <Card key={exercise.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground">{exercise.category}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveExercise(exercise.id, 'up')}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveExercise(exercise.id, 'down')}
                                disabled={index === exercises.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                ↓
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(exercise.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Sets</Label>
                              <Input
                                type="number"
                                value={exercise.sets || ''}
                                onChange={(e) => updateExercise(exercise.id, { sets: Number(e.target.value) })}
                                className="h-7"
                                min={1}
                                max={10}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Reps</Label>
                              <Input
                                value={exercise.reps || ''}
                                onChange={(e) => updateExercise(exercise.id, { reps: e.target.value })}
                                placeholder="8-12"
                                className="h-7"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Rest (s)</Label>
                              <Input
                                type="number"
                                value={exercise.restTime || ''}
                                onChange={(e) => updateExercise(exercise.id, { restTime: Number(e.target.value) })}
                                className="h-7"
                                min={0}
                                max={300}
                              />
                            </div>
                          </div>

                          {exercise.category === 'Cardio' && (
                            <div className="mt-2">
                              <Label className="text-xs">Duration (min)</Label>
                              <Input
                                type="number"
                                value={exercise.duration || ''}
                                onChange={(e) => updateExercise(exercise.id, { duration: Number(e.target.value) * 60 })}
                                className="h-7"
                                min={1}
                                max={120}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {exercises.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        No exercises added yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setTags(prev => prev.filter(t => t !== tag))}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <Label>Equipment</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Add equipment..."
                    onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
                  />
                  <Button type="button" onClick={addEquipment} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {equipment.map(item => (
                    <Badge key={item} variant="secondary" className="cursor-pointer" onClick={() => setEquipment(prev => prev.filter(e => e !== item))}>
                      {item} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Target Muscles */}
              <div>
                <Label>Target Muscles</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {[...new Set(exercises.flatMap(ex => ex.muscleGroups))].map(muscle => (
                    <Badge key={muscle} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Estimated Calories */}
              <div>
                <Label>Estimated Calories Burned</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Target className="h-4 w-4" />
                  <span>{Math.round(duration * 5)} calories</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveWorkout} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                {editWorkout ? 'Update Workout' : 'Save Workout'}
              </Button>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export type { CustomWorkout, WorkoutExercise }
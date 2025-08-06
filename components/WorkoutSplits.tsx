"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  Dumbbell, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Play,
  Heart,
  Download,
  Zap,
  Award,
  Users,
  Flame
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

interface WorkoutDay {
  day: string
  focus: string
  duration: string
  exercises: Exercise[]
  tips: string[]
}

interface WorkoutSplit {
  id: string
  name: string
  description: string
  duration: string
  frequency: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  goals: string[]
  benefits: string[]
  schedule: WorkoutDay[]
  pros: string[]
  cons: string[]
  best_for: string[]
}

interface WorkoutSplitsProps {
  userProfile?: UserProfile
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
}

export function WorkoutSplits({ userProfile, onXPGain, subscriptionTier = 'free', onPremiumFeatureAccess }: WorkoutSplitsProps) {
  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplit | null>(null)
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null)

  const workoutSplits: WorkoutSplit[] = [
    {
      id: 'full_body',
      name: 'Full Body Split',
      description: 'Train your entire body in each session',
      duration: '45-60 minutes',
      frequency: '3 days per week',
      level: 'Beginner',
      goals: ['Weight Loss', 'General Fitness', 'Muscle Toning'],
      benefits: [
        'Perfect for beginners',
        'Time efficient',
        'High calorie burn',
        'Balanced muscle development',
        'Allows adequate recovery'
      ],
      schedule: [
        {
          day: 'Monday',
          focus: 'Full Body A',
          duration: '50 min',
          exercises: [
            { name: 'Squats', sets: '3', reps: '12-15', rest: '60s', notes: 'Focus on form' },
            { name: 'Push-ups', sets: '3', reps: '8-12', rest: '45s', notes: 'Modify on knees if needed' },
            { name: 'Bent-over Rows', sets: '3', reps: '10-12', rest: '60s', notes: 'Keep back straight' },
            { name: 'Overhead Press', sets: '3', reps: '8-10', rest: '60s' },
            { name: 'Deadlifts', sets: '3', reps: '8-10', rest: '90s', notes: 'Start light, focus on form' },
            { name: 'Plank', sets: '3', reps: '30-60s', rest: '30s' }
          ],
          tips: [
            'Focus on proper form over heavy weight',
            'Take extra rest if needed',
            'Warm up for 5-10 minutes before starting'
          ]
        },
        {
          day: 'Wednesday',
          focus: 'Full Body B',
          duration: '50 min',
          exercises: [
            { name: 'Lunges', sets: '3', reps: '10 each leg', rest: '60s' },
            { name: 'Incline Push-ups', sets: '3', reps: '10-15', rest: '45s' },
            { name: 'Lat Pulldowns', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Dumbbell Press', sets: '3', reps: '8-12', rest: '60s' },
            { name: 'Romanian Deadlifts', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Mountain Climbers', sets: '3', reps: '20 total', rest: '30s' }
          ],
          tips: [
            'Progressive overload - gradually increase difficulty',
            'Listen to your body',
            'Stay hydrated throughout'
          ]
        },
        {
          day: 'Friday',
          focus: 'Full Body C',
          duration: '50 min',
          exercises: [
            { name: 'Goblet Squats', sets: '3', reps: '12-15', rest: '60s' },
            { name: 'Chest Press', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Seated Rows', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '45s' },
            { name: 'Hip Thrusts', sets: '3', reps: '12-15', rest: '60s' },
            { name: 'Russian Twists', sets: '3', reps: '20 total', rest: '30s' }
          ],
          tips: [
            'End each session with 5-10 minutes of stretching',
            'Track your progress weekly',
            'Ensure 48 hours rest between sessions'
          ]
        }
      ],
      pros: [
        'Time efficient',
        'Great for beginners',
        'High frequency training',
        'Balanced development'
      ],
      cons: [
        'May not be optimal for advanced lifters',
        'Limited volume per muscle group',
        'Can be tiring for some'
      ],
      best_for: [
        'Beginners to weight training',
        'People with limited time',
        'Those wanting general fitness',
        'Weight loss goals'
      ]
    },
    {
      id: 'upper_lower',
      name: 'Upper/Lower Split',
      description: 'Alternate between upper and lower body workouts',
      duration: '60-75 minutes',
      frequency: '4 days per week',
      level: 'Intermediate',
      goals: ['Muscle Building', 'Strength Gains', 'Body Recomposition'],
      benefits: [
        'Higher training volume',
        'Better muscle specialization',
        'Good balance of frequency and volume',
        'Allows targeted training',
        'Suitable progression from full body'
      ],
      schedule: [
        {
          day: 'Monday',
          focus: 'Upper Body Power',
          duration: '70 min',
          exercises: [
            { name: 'Bench Press', sets: '4', reps: '6-8', rest: '3 min', notes: 'Heavy compound movement' },
            { name: 'Bent-over Rows', sets: '4', reps: '6-8', rest: '3 min' },
            { name: 'Overhead Press', sets: '3', reps: '8-10', rest: '2 min' },
            { name: 'Pull-ups/Lat Pulldowns', sets: '3', reps: '8-12', rest: '2 min' },
            { name: 'Dips', sets: '3', reps: '8-12', rest: '90s' },
            { name: 'Barbell Curls', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Close-grip Bench Press', sets: '3', reps: '8-10', rest: '90s' }
          ],
          tips: [
            'Focus on compound movements first',
            'Use progressive overload',
            'Maintain strict form on isolation exercises'
          ]
        },
        {
          day: 'Tuesday',
          focus: 'Lower Body Power',
          duration: '70 min',
          exercises: [
            { name: 'Squats', sets: '4', reps: '6-8', rest: '3 min', notes: 'Go heavy with proper form' },
            { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', rest: '3 min' },
            { name: 'Bulgarian Split Squats', sets: '3', reps: '10 each leg', rest: '2 min' },
            { name: 'Leg Press', sets: '3', reps: '12-15', rest: '2 min' },
            { name: 'Walking Lunges', sets: '3', reps: '12 each leg', rest: '90s' },
            { name: 'Calf Raises', sets: '4', reps: '15-20', rest: '60s' },
            { name: 'Plank', sets: '3', reps: '45-60s', rest: '60s' }
          ],
          tips: [
            'Warm up thoroughly before heavy squats',
            'Focus on full range of motion',
            'Don\'t neglect posterior chain'
          ]
        },
        {
          day: 'Thursday',
          focus: 'Upper Body Hypertrophy',
          duration: '65 min',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: '4', reps: '8-12', rest: '2 min' },
            { name: 'Cable Rows', sets: '4', reps: '10-12', rest: '2 min' },
            { name: 'Dumbbell Flyes', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Face Pulls', sets: '3', reps: '15-20', rest: '60s' },
            { name: 'Hammer Curls', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Tricep Pushdowns', sets: '3', reps: '10-12', rest: '60s' },
            { name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '45s' }
          ],
          tips: [
            'Focus on muscle contraction',
            'Use controlled tempo',
            'Feel the muscle working'
          ]
        },
        {
          day: 'Friday',
          focus: 'Lower Body Hypertrophy',
          duration: '65 min',
          exercises: [
            { name: 'Front Squats', sets: '4', reps: '10-12', rest: '2 min' },
            { name: 'Stiff Leg Deadlifts', sets: '4', reps: '10-12', rest: '2 min' },
            { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Leg Extensions', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Hip Thrusts', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Seated Calf Raises', sets: '4', reps: '15-20', rest: '60s' },
            { name: 'Hanging Leg Raises', sets: '3', reps: '10-15', rest: '60s' }
          ],
          tips: [
            'Focus on time under tension',
            'Use full range of motion',
            'Mind-muscle connection is key'
          ]
        }
      ],
      pros: [
        'Higher volume per muscle group',
        'Good balance of compound and isolation',
        'Allows for specialization',
        'Great for intermediate lifters'
      ],
      cons: [
        'Requires more time',
        'May be too much for beginners',
        'Need good recovery between sessions'
      ],
      best_for: [
        'Intermediate to advanced lifters',
        'Muscle building goals',
        'Those who can train 4+ days per week',
        'People wanting to specialize'
      ]
    },
    {
      id: 'push_pull_legs',
      name: 'Push/Pull/Legs',
      description: 'Divide workouts by movement patterns',
      duration: '60-80 minutes',
      frequency: '6 days per week',
      level: 'Advanced',
      goals: ['Muscle Building', 'Strength', 'Bodybuilding'],
      benefits: [
        'Maximum training volume',
        'Optimal muscle specialization',
        'Great for bodybuilding',
        'Allows high frequency',
        'Balanced push/pull movements'
      ],
      schedule: [
        {
          day: 'Monday',
          focus: 'Push Day (Chest, Shoulders, Triceps)',
          duration: '75 min',
          exercises: [
            { name: 'Bench Press', sets: '4', reps: '6-8', rest: '3 min', notes: 'Main compound movement' },
            { name: 'Overhead Press', sets: '4', reps: '8-10', rest: '2.5 min' },
            { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12', rest: '2 min' },
            { name: 'Lateral Raises', sets: '4', reps: '12-15', rest: '90s' },
            { name: 'Dips', sets: '3', reps: '10-15', rest: '2 min' },
            { name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '90s' },
            { name: 'Overhead Tricep Extension', sets: '3', reps: '10-12', rest: '60s' }
          ],
          tips: [
            'Start with heaviest compound movements',
            'Focus on pushing movements only',
            'Save triceps for last'
          ]
        },
        {
          day: 'Tuesday',
          focus: 'Pull Day (Back, Biceps)',
          duration: '70 min',
          exercises: [
            { name: 'Deadlifts', sets: '4', reps: '5-6', rest: '3 min', notes: 'Heavy pulling movement' },
            { name: 'Pull-ups', sets: '4', reps: '6-10', rest: '2.5 min' },
            { name: 'Bent-over Rows', sets: '4', reps: '8-10', rest: '2 min' },
            { name: 'Cable Rows', sets: '3', reps: '10-12', rest: '2 min' },
            { name: 'Face Pulls', sets: '3', reps: '15-20', rest: '90s' },
            { name: 'Barbell Curls', sets: '4', reps: '8-12', rest: '90s' },
            { name: 'Hammer Curls', sets: '3', reps: '10-12', rest: '60s' }
          ],
          tips: [
            'Focus on pulling movements only',
            'Engage lats on all back exercises',
            'Don\'t neglect rear delts'
          ]
        },
        {
          day: 'Wednesday',
          focus: 'Legs Day (Quads, Hamstrings, Glutes, Calves)',
          duration: '80 min',
          exercises: [
            { name: 'Squats', sets: '4', reps: '6-8', rest: '3 min', notes: 'King of leg exercises' },
            { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', rest: '2.5 min' },
            { name: 'Leg Press', sets: '4', reps: '12-15', rest: '2 min' },
            { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Bulgarian Split Squats', sets: '3', reps: '10 each leg', rest: '2 min' },
            { name: 'Calf Raises', sets: '4', reps: '15-20', rest: '90s' },
            { name: 'Leg Extensions', sets: '3', reps: '12-15', rest: '90s' }
          ],
          tips: [
            'Legs require the most energy',
            'Don\'t skip the warm-up',
            'Focus on both quads and hamstrings'
          ]
        }
      ],
      pros: [
        'High training volume',
        'Maximum muscle specialization',
        'Great for advanced lifters',
        'Balanced approach'
      ],
      cons: [
        'Requires 6 days per week commitment',
        'Can be overwhelming for beginners',
        'Risk of overtraining'
      ],
      best_for: [
        'Advanced lifters',
        'Bodybuilding goals',
        'Those with 6+ days to train',
        'Experienced athletes'
      ]
    },
    {
      id: 'bro_split',
      name: 'Bro Split',
      description: 'Train one muscle group per day',
      duration: '60-90 minutes',
      frequency: '5-6 days per week',
      level: 'Advanced',
      goals: ['Bodybuilding', 'Muscle Isolation', 'Peak Specialization'],
      benefits: [
        'Maximum focus per muscle group',
        'High volume training',
        'Complete muscle isolation',
        'Great for bodybuilding prep',
        'Allows maximum recovery per muscle'
      ],
      schedule: [
        {
          day: 'Monday',
          focus: 'Chest Day',
          duration: '75 min',
          exercises: [
            { name: 'Flat Bench Press', sets: '4', reps: '6-8', rest: '3 min' },
            { name: 'Incline Barbell Press', sets: '4', reps: '8-10', rest: '2.5 min' },
            { name: 'Decline Dumbbell Press', sets: '3', reps: '10-12', rest: '2 min' },
            { name: 'Dumbbell Flyes', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Cable Crossovers', sets: '3', reps: '12-15', rest: '90s' },
            { name: 'Dips', sets: '3', reps: 'To failure', rest: '2 min' },
            { name: 'Push-ups', sets: '2', reps: 'To failure', rest: '60s' }
          ],
          tips: [
            'Hit chest from all angles',
            'Focus on feeling the chest work',
            'Use full range of motion'
          ]
        },
        {
          day: 'Tuesday',
          focus: 'Back Day',
          duration: '80 min',
          exercises: [
            { name: 'Deadlifts', sets: '4', reps: '5-6', rest: '3 min' },
            { name: 'Pull-ups', sets: '4', reps: '6-10', rest: '2.5 min' },
            { name: 'Bent-over Rows', sets: '4', reps: '8-10', rest: '2 min' },
            { name: 'T-Bar Rows', sets: '3', reps: '10-12', rest: '2 min' },
            { name: 'Cable Rows', sets: '3', reps: '10-12', rest: '90s' },
            { name: 'Lat Pulldowns', sets: '3', reps: '10-12', rest: '90s' },
            { name: 'Face Pulls', sets: '3', reps: '15-20', rest: '60s' }
          ],
          tips: [
            'Focus on width and thickness',
            'Engage lats on every exercise',
            'Don\'t neglect lower back'
          ]
        },
        {
          day: 'Wednesday',
          focus: 'Shoulders Day',
          duration: '65 min',
          exercises: [
            { name: 'Overhead Press', sets: '4', reps: '6-8', rest: '2.5 min' },
            { name: 'Dumbbell Shoulder Press', sets: '4', reps: '8-10', rest: '2 min' },
            { name: 'Lateral Raises', sets: '4', reps: '12-15', rest: '90s' },
            { name: 'Rear Delt Flyes', sets: '4', reps: '12-15', rest: '90s' },
            { name: 'Front Raises', sets: '3', reps: '10-12', rest: '90s' },
            { name: 'Upright Rows', sets: '3', reps: '10-12', rest: '90s' },
            { name: 'Shrugs', sets: '3', reps: '12-15', rest: '90s' }
          ],
          tips: [
            'Hit all three deltoid heads',
            'Focus on rear delts',
            'Use controlled movements'
          ]
        }
      ],
      pros: [
        'Maximum focus per muscle',
        'High volume training',
        'Great for bodybuilding',
        'Complete muscle isolation'
      ],
      cons: [
        'Low training frequency per muscle',
        'Requires advanced recovery',
        'Risk of imbalances',
        'Not ideal for strength'
      ],
      best_for: [
        'Advanced bodybuilders',
        'Contest preparation',
        'Those wanting maximum muscle isolation',
        'Experienced lifters with great recovery'
      ]
    }
  ]

  const renderExerciseList = (exercises: Exercise[]) => (
    <div className="space-y-3">
      {exercises.map((exercise, idx) => (
        <div key={idx} className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium">{exercise.name}</h5>
            <div className="flex gap-2 text-xs">
              <Badge variant="outline">{exercise.sets} sets</Badge>
              <Badge variant="outline">{exercise.reps} reps</Badge>
              <Badge variant="outline">{exercise.rest} rest</Badge>
            </div>
          </div>
          {exercise.notes && (
            <p className="text-xs text-muted-foreground italic">{exercise.notes}</p>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Workout Splits 💪</h1>
        <p className="text-muted-foreground">Professional training programs for every level</p>
      </div>

      {/* Workout Splits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workoutSplits.map((split) => (
          <Card key={split.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="text-blue-500" size={20} />
                    {split.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{split.description}</p>
                </div>
                <Badge 
                  variant={split.level === 'Beginner' ? 'secondary' : split.level === 'Intermediate' ? 'default' : 'destructive'}
                >
                  {split.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="text-blue-600 mx-auto mb-1" size={16} />
                  <div className="text-sm font-medium">{split.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="text-green-600 mx-auto mb-1" size={16} />
                  <div className="text-sm font-medium">{split.frequency}</div>
                  <div className="text-xs text-muted-foreground">Frequency</div>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h4 className="font-medium mb-2">Perfect For:</h4>
                <div className="flex flex-wrap gap-1">
                  {split.goals.map((goal, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-medium mb-2">Key Benefits:</h4>
                <div className="space-y-1">
                  {split.benefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Star className="text-yellow-500" size={12} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedSplit(split)}
                  className="flex-1"
                >
                  <Play size={16} className="mr-2" />
                  View Program
                </Button>
                <Button variant="outline" size="sm">
                  <Heart size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Split View */}
      {selectedSplit && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="text-green-500" size={20} />
                {selectedSplit.name} - Complete Program
              </CardTitle>
              <Button variant="outline" onClick={() => {
                setSelectedSplit(null)
                setSelectedDay(null)
              }}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Program Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="text-purple-600" size={16} />
                  Pros
                </h3>
                <div className="space-y-2">
                  {selectedSplit.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <TrendingUp className="text-green-500" size={12} />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="text-orange-600" size={16} />
                  Considerations
                </h3>
                <div className="space-y-2">
                  {selectedSplit.cons.map((con, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Flame className="text-orange-500" size={12} />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best For */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="text-blue-600" size={16} />
                Best For
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedSplit.best_for.map((target, idx) => (
                  <Badge key={idx} variant="outline" className="text-center">
                    {target}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Workout Schedule */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={16} />
                Weekly Schedule
              </h3>
              <div className="grid gap-3">
                {selectedSplit.schedule.map((day, idx) => (
                  <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDay(selectedDay?.day === day.day ? null : day)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{day.day}</h4>
                          <p className="text-sm text-muted-foreground">{day.focus}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{day.duration}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {day.exercises.length} exercises
                          </div>
                        </div>
                      </div>
                      
                      {selectedDay?.day === day.day && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Exercises:</h5>
                            {renderExerciseList(day.exercises)}
                          </div>
                          
                          {day.tips.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Star className="text-yellow-500" size={14} />
                                Training Tips:
                              </h5>
                              <div className="space-y-1">
                                {day.tips.map((tip, tipIdx) => (
                                  <div key={tipIdx} className="text-sm text-muted-foreground">
                                    • {tip}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Calendar size={16} className="mr-2" />
                Start This Program
              </Button>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Heart size={16} className="mr-2" />
                Save to Favorites
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
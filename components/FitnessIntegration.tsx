"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Trophy,
  Dumbbell,
  Utensils,
  ChefHat,
  Star,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface FitnessGoal {
  id: string
  title: string
  description: string
  type: 'diet' | 'workout' | 'strength'
  target: number
  current: number
  unit: string
  deadline?: Date
  dietPlan?: string
  workoutSplit?: string
  strengthExercise?: string
}

interface FitnessIntegrationProps {
  userProfile?: any
  userStats?: any
  onNavigate: (tab: string) => void
  onXPGain?: (xp: number, reason: string) => void
}

export function FitnessIntegration({ userProfile, userStats, onNavigate, onXPGain }: FitnessIntegrationProps) {
  const [activeGoals, setActiveGoals] = useState<FitnessGoal[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState({
    caloriesTracked: 0,
    workoutsCompleted: 0,
    strengthSessions: 0,
    targetCalories: userProfile?.dailyCalorieGoal || 2000,
    targetWorkouts: parseInt(userProfile?.workoutFrequency) || 3,
    targetStrengthSessions: 2
  })

  // Initialize sample goals based on user profile
  useEffect(() => {
    if (userProfile) {
      const goals: FitnessGoal[] = [
        {
          id: 'weekly_nutrition',
          title: 'Weekly Nutrition Goal',
          description: 'Track your daily calories consistently',
          type: 'diet',
          target: 7,
          current: 3,
          unit: 'days',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          dietPlan: userProfile.fitnessGoal === 'lose_weight' ? '1500_plan_1' : '2500_plan_1'
        },
        {
          id: 'strength_progression',
          title: 'Strength Training Progress',
          description: 'Complete strength training sessions',
          type: 'strength',
          target: parseInt(userProfile.workoutFrequency) || 3,
          current: userStats?.workoutsCompleted % 7 || 0,
          unit: 'sessions',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          strengthExercise: 'bench_press'
        },
        {
          id: 'workout_consistency',
          title: 'Workout Consistency',
          description: 'Follow your workout split routine',
          type: 'workout',
          target: parseInt(userProfile.workoutFrequency) || 3,
          current: weeklyProgress.workoutsCompleted,
          unit: 'workouts',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          workoutSplit: userProfile.fitnessLevel === 'beginner' ? 'full_body' : 'push_pull_legs'
        }
      ]
      setActiveGoals(goals)
    }
  }, [userProfile, userStats, weeklyProgress])

  const getGoalProgress = (goal: FitnessGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'diet':
        return <Utensils className="text-green-500" size={20} />
      case 'workout':
        return <Dumbbell className="text-blue-500" size={20} />
      case 'strength':
        return <Trophy className="text-yellow-500" size={20} />
      default:
        return <Target className="text-gray-500" size={20} />
    }
  }

  const getRecommendedAction = (goal: FitnessGoal) => {
    const progress = getGoalProgress(goal)
    
    if (progress >= 100) {
      return {
        action: 'Completed! 🎉',
        buttonText: 'View Results',
        color: 'bg-green-500'
      }
    } else if (progress >= 70) {
      return {
        action: 'Almost there!',
        buttonText: 'Continue',
        color: 'bg-blue-500'
      }
    } else if (progress >= 30) {
      return {
        action: 'Keep going!',
        buttonText: 'Continue',
        color: 'bg-orange-500'
      }
    } else {
      return {
        action: 'Get started!',
        buttonText: 'Start',
        color: 'bg-red-500'
      }
    }
  }

  const handleGoalAction = (goal: FitnessGoal) => {
    switch (goal.type) {
      case 'diet':
        onNavigate('diet-plans')
        break
      case 'workout':
        onNavigate('workout-splits')
        break
      case 'strength':
        onNavigate('strength')
        break
      default:
        onNavigate('home')
    }
  }

  const quickStartActions = [
    {
      title: 'Browse Diet Plans',
      description: 'Find the perfect meal plan for your goals',
      icon: <ChefHat className="text-orange-500" size={24} />,
      action: () => onNavigate('diet-plans'),
      color: 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20'
    },
    {
      title: 'Choose Workout Split',
      description: 'Select a training program that fits your schedule',
      icon: <Calendar className="text-blue-500" size={24} />,
      action: () => onNavigate('workout-splits'),
      color: 'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      title: 'Track Strength Progress',
      description: 'Log workouts and unlock achievement tiers',
      icon: <Trophy className="text-yellow-500" size={24} />,
      action: () => onNavigate('strength'),
      color: 'from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Weekly Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" size={20} />
            Weekly Fitness Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = getGoalProgress(goal)
            const recommendation = getRecommendedAction(goal)
            
            return (
              <div key={goal.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getGoalIcon(goal.type)}
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {goal.current}/{goal.target} {goal.unit}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {recommendation.action}
                    </span>
                    <Button 
                      size="sm" 
                      onClick={() => handleGoalAction(goal)}
                      className="h-8"
                    >
                      {recommendation.buttonText}
                      <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Start Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {quickStartActions.map((action, index) => (
              <div 
                key={index}
                className={`p-4 bg-gradient-to-r ${action.color} rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
                onClick={action.action}
              >
                <div className="flex items-center gap-3">
                  {action.icon}
                  <div className="flex-1">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            Success Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium">Start with a Diet Plan</h5>
                <p className="text-sm text-muted-foreground">
                  Nutrition is 70% of your fitness journey. Choose a plan that matches your calorie goals.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium">Pick the Right Workout Split</h5>
                <p className="text-sm text-muted-foreground">
                  Match your workout frequency with an appropriate training program for best results.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-500 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium">Track Strength Progress</h5>
                <p className="text-sm text-muted-foreground">
                  Log your lifts consistently to unlock achievement tiers and see real progress.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="text-blue-500 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium">Stay Consistent</h5>
                <p className="text-sm text-muted-foreground">
                  Small daily actions compound into amazing results over time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
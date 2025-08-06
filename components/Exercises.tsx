"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Play, Plus, Timer, Flame } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function Exercises() {
  const [activeWorkout, setActiveWorkout] = useState(null)
  
  const todaysWorkouts = [
    { name: 'Morning Run', duration: 30, calories: 300, time: '7:00 AM', completed: true },
    { name: 'Push-ups', duration: 10, calories: 50, time: '7:30 AM', completed: true },
  ]

  const workoutPlans = [
    {
      category: 'Cardio',
      exercises: [
        { name: 'Running', duration: 30, calories: 300, difficulty: 'Medium' },
        { name: 'Cycling', duration: 45, calories: 350, difficulty: 'Easy' },
        { name: 'Jump Rope', duration: 15, calories: 200, difficulty: 'Hard' },
        { name: 'Swimming', duration: 30, calories: 400, difficulty: 'Medium' },
      ]
    },
    {
      category: 'Strength',
      exercises: [
        { name: 'Push-ups', duration: 10, calories: 50, difficulty: 'Easy' },
        { name: 'Squats', duration: 15, calories: 80, difficulty: 'Easy' },
        { name: 'Planks', duration: 5, calories: 30, difficulty: 'Medium' },
        { name: 'Burpees', duration: 10, calories: 100, difficulty: 'Hard' },
      ]
    },
    {
      category: 'Flexibility',
      exercises: [
        { name: 'Yoga Flow', duration: 20, calories: 60, difficulty: 'Easy' },
        { name: 'Stretching', duration: 15, calories: 40, difficulty: 'Easy' },
        { name: 'Pilates', duration: 30, calories: 120, difficulty: 'Medium' },
      ]
    }
  ]

  const totalCaloriesBurned = todaysWorkouts.reduce((sum, workout) => sum + workout.calories, 0)
  const weeklyGoal = 2000
  const weeklyProgress = (totalCaloriesBurned / weeklyGoal) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-3xl">Exercises</h1>
        <p className="text-muted-foreground">Track your workouts and burn calories</p>
      </div>

      {/* Today's Progress */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Calories Burned Today</h3>
              <div className="text-3xl text-orange-600">{totalCaloriesBurned}</div>
            </div>
            <Flame className="text-orange-500" size={32} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal Progress</span>
              <span>{Math.round(weeklyProgress)}%</span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Workouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Workouts</CardTitle>
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              Add Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todaysWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todaysWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${workout.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Timer size={14} />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={14} />
                          {workout.calories} cal
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={workout.completed ? "default" : "outline"}>
                    {workout.completed ? 'Completed' : workout.time}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No workouts scheduled for today</p>
              <Button variant="ghost" className="mt-2">
                <Plus size={16} className="mr-2" />
                Add your first workout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Categories */}
      <Tabs defaultValue="Cardio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Cardio">Cardio</TabsTrigger>
          <TabsTrigger value="Strength">Strength</TabsTrigger>
          <TabsTrigger value="Flexibility">Flexibility</TabsTrigger>
        </TabsList>

        {workoutPlans.map((category) => (
          <TabsContent key={category.category} value={category.category} className="space-y-3">
            <div className="grid gap-3">
              {category.exercises.map((exercise, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getDifficultyColor(exercise.difficulty)}`} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Timer size={14} />
                            {exercise.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame size={14} />
                            {exercise.calories} cal
                          </span>
                          <Badge variant="outline" size="sm">
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play size={16} className="mr-2" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
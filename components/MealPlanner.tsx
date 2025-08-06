"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Calendar, 
  Clock, 
  ChefHat, 
  Plus, 
  ShoppingCart, 
  Bookmark,
  Star,
  Timer,
  Users,
  Flame
} from 'lucide-react'

export function MealPlanner() {
  const [selectedDay, setSelectedDay] = useState('today')
  
  const mealPlan = {
    breakfast: {
      name: "Protein Power Bowl",
      calories: 420,
      protein: 25,
      time: "8:00 AM",
      difficulty: "Easy",
      cookTime: "10 min",
      rating: 4.8,
      image: "🥣"
    },
    lunch: {
      name: "Grilled Chicken Salad",
      calories: 380,
      protein: 35,
      time: "12:30 PM",
      difficulty: "Medium",
      cookTime: "15 min",
      rating: 4.6,
      image: "🥗"
    },
    dinner: {
      name: "Salmon & Quinoa",
      calories: 520,
      protein: 42,
      time: "7:00 PM",
      difficulty: "Medium",
      cookTime: "25 min",
      rating: 4.9,
      image: "🐟"
    },
    snacks: [
      { name: "Greek Yogurt", calories: 150, time: "3:00 PM", image: "🥛" },
      { name: "Mixed Nuts", calories: 180, time: "9:00 PM", image: "🥜" }
    ]
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const totalCalories = mealPlan.breakfast.calories + mealPlan.lunch.calories + mealPlan.dinner.calories + 
                       mealPlan.snacks.reduce((sum, snack) => sum + snack.calories, 0)

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Meal Planner 🍽️</h1>
        <p className="text-muted-foreground">Smart nutrition planning for your goals</p>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">This Week</h3>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-1" />
              Generate Plan
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <Button
                key={day}
                variant={index === 3 ? "default" : "ghost"}
                size="sm"
                className="h-12 flex-col"
              >
                <span className="text-xs">{day}</span>
                <span className="text-xs opacity-60">{15 + index}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-500" size={20} />
              Today's Plan
            </div>
            <Badge variant="outline">{totalCalories} calories</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-600">145g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-600">180g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">65g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Protein Goal</span>
              <span>145g / 150g</span>
            </div>
            <Progress value={96.7} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        {/* Breakfast */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{mealPlan.breakfast.image}</div>
                <div>
                  <h4 className="font-medium">{mealPlan.breakfast.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={12} />
                    {mealPlan.breakfast.time}
                    <Timer size={12} />
                    {mealPlan.breakfast.cookTime}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{mealPlan.breakfast.calories} cal</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  {mealPlan.breakfast.rating}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <ChefHat size={14} className="mr-1" />
                Cook Now
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lunch */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{mealPlan.lunch.image}</div>
                <div>
                  <h4 className="font-medium">{mealPlan.lunch.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={12} />
                    {mealPlan.lunch.time}
                    <Timer size={12} />
                    {mealPlan.lunch.cookTime}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{mealPlan.lunch.calories} cal</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  {mealPlan.lunch.rating}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" variant="outline">
                <ShoppingCart size={14} className="mr-1" />
                Add to Cart
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dinner */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{mealPlan.dinner.image}</div>
                <div>
                  <h4 className="font-medium">{mealPlan.dinner.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={12} />
                    {mealPlan.dinner.time}
                    <Timer size={12} />
                    {mealPlan.dinner.cookTime}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{mealPlan.dinner.calories} cal</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  {mealPlan.dinner.rating}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" variant="outline">
                Prep Later
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Snacks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Snacks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mealPlan.snacks.map((snack, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{snack.image}</div>
                  <div>
                    <p className="font-medium">{snack.name}</p>
                    <p className="text-sm text-muted-foreground">{snack.time}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{snack.calories} cal</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <ShoppingCart size={24} />
          <span>Shopping List</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Users size={24} />
          <span>Share Plan</span>
        </Button>
      </div>
    </div>
  )
}
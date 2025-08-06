"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { NutritionSearch } from "./NutritionSearch"
import { Plus, Search, Clock, Verified } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import type { NutritionData } from './NutritionService'

export function Meals() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showNutritionSearch, setShowNutritionSearch] = useState(false)

  const handleFoodAdd = (food: NutritionData, servings: number) => {
    console.log('Adding food:', food.name, 'Servings:', servings, 'Calories:', Math.round(food.calories * servings))
    // Here you would add the food to your meal tracking state
    setShowNutritionSearch(false)
  }
  
  const meals = {
    breakfast: [
      { name: 'Oatmeal with berries', calories: 280, time: '8:00 AM' },
      { name: 'Greek yogurt', calories: 150, time: '8:15 AM' },
    ],
    lunch: [
      { name: 'Chicken salad', calories: 420, time: '12:30 PM' },
      { name: 'Apple', calories: 80, time: '1:00 PM' },
    ],
    dinner: [
      { name: 'Grilled salmon', calories: 350, time: '7:00 PM' },
      { name: 'Quinoa bowl', calories: 200, time: '7:15 PM' },
    ],
    snacks: [
      { name: 'Almonds', calories: 170, time: '3:30 PM' },
    ]
  }

  const popularFoods = [
    { name: 'Banana', calories: 105 },
    { name: 'Chicken breast (100g)', calories: 165 },
    { name: 'Brown rice (1 cup)', calories: 216 },
    { name: 'Avocado', calories: 320 },
    { name: 'Eggs (2 large)', calories: 140 },
    { name: 'Broccoli (1 cup)', calories: 25 },
  ]

  const totalCalories = Object.values(meals).flat().reduce((sum, meal) => sum + meal.calories, 0)

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-3xl">Meals & Nutrition</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Verified className="text-green-500" size={16} />
          Powered by Google Nutrition API
        </p>
      </div>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-2">{totalCalories}</div>
          <p className="text-muted-foreground">Total calories today</p>
        </CardContent>
      </Card>

      {/* Enhanced Search */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setShowNutritionSearch(!showNutritionSearch)}
          variant={showNutritionSearch ? "secondary" : "default"}
        >
          <Search size={20} className="mr-2" />
          {showNutritionSearch ? 'Hide' : 'Search'} Google Nutrition Database
        </Button>
        
        {showNutritionSearch && (
          <NutritionSearch onFoodAdd={handleFoodAdd} />
        )}
        
        <Button variant="outline" className="w-full" size="lg">
          <Plus size={20} className="mr-2" />
          Quick Add Calories
        </Button>
      </div>

      {/* Meal Tabs */}
      <Tabs defaultValue="breakfast" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
        </TabsList>

        {Object.entries(meals).map(([mealType, mealItems]) => (
          <TabsContent key={mealType} value={mealType} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="capitalize">{mealType}</h3>
              <Badge variant="outline">
                {mealItems.reduce((sum, item) => sum + item.calories, 0)} cal
              </Badge>
            </div>
            
            {mealItems.length > 0 ? (
              <div className="space-y-2">
                {mealItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={14} />
                            {item.time}
                          </div>
                        </div>
                        <Badge>{item.calories} cal</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>No {mealType} logged yet</p>
                  <Button variant="ghost" className="mt-2">
                    <Plus size={16} className="mr-2" />
                    Add {mealType}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Popular Foods */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {popularFoods.map((food, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 justify-between"
              >
                <div className="text-left">
                  <p className="text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.calories} cal</p>
                </div>
                <Plus size={16} />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
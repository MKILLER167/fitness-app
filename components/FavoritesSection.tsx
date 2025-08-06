"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  Heart, 
  Star, 
  Play, 
  Clock, 
  Flame, 
  Target, 
  Utensils, 
  Dumbbell,
  BookOpen,
  Plus,
  Filter,
  Search
} from 'lucide-react'
import { Input } from "./ui/input"

export function FavoritesSection() {
  const [activeTab, setActiveTab] = useState<'workouts' | 'meals' | 'recipes' | 'guides'>('workouts')
  const [searchQuery, setSearchQuery] = useState('')

  const favoriteWorkouts = [
    {
      id: 1,
      name: 'HIIT Cardio Blast',
      duration: '20 min',
      calories: 280,
      difficulty: 'Beginner',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      type: 'Cardio'
    },
    {
      id: 2,
      name: 'Upper Body Strength',
      duration: '45 min',
      calories: 320,
      difficulty: 'Intermediate',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop',
      type: 'Strength'
    },
    {
      id: 3,
      name: 'Morning Yoga Flow',
      duration: '30 min',
      calories: 150,
      difficulty: 'Beginner',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      type: 'Flexibility'
    }
  ]

  const favoriteMeals = [
    {
      id: 1,
      name: 'Grilled Chicken Bowl',
      calories: 450,
      protein: 35,
      prepTime: '15 min',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      tags: ['High Protein', 'Low Carb']
    },
    {
      id: 2,
      name: 'Quinoa Power Salad',
      calories: 380,
      protein: 18,
      prepTime: '10 min',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      tags: ['Vegetarian', 'Fiber Rich']
    }
  ]

  const favoriteGuides = [
    {
      id: 1,
      title: 'Beginner\'s Guide to Weight Loss',
      readTime: '8 min',
      category: 'Weight Loss',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Nutrition Basics for Athletes',
      readTime: '12 min',
      category: 'Nutrition',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop'
    }
  ]

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, count: favoriteWorkouts.length },
    { id: 'meals', label: 'Meals', icon: Utensils, count: favoriteMeals.length },
    { id: 'recipes', label: 'Recipes', icon: Target, count: 8 },
    { id: 'guides', label: 'Guides', icon: BookOpen, count: favoriteGuides.length }
  ]

  const renderWorkouts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteWorkouts.map((workout) => (
        <Card key={workout.id} className="hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={workout.image} 
              alt={workout.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2">
              <Button size="sm" variant="secondary" className="bg-white/90">
                <Heart className="text-red-500 fill-current" size={16} />
              </Button>
            </div>
            <Badge className="absolute bottom-2 left-2 bg-black/70 text-white">
              {workout.type}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{workout.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {workout.duration}
              </div>
              <div className="flex items-center gap-1">
                <Flame size={14} />
                {workout.calories} cal
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} />
                {workout.rating}
              </div>
              <Badge variant="outline" className="text-xs">
                {workout.difficulty}
              </Badge>
            </div>
            <Button className="w-full">
              <Play size={16} className="mr-2" />
              Start Workout
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderMeals = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteMeals.map((meal) => (
        <Card key={meal.id} className="hover:shadow-lg transition-shadow">
          <div className="relative">
            <img 
              src={meal.image} 
              alt={meal.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 right-2">
              <Button size="sm" variant="secondary" className="bg-white/90">
                <Heart className="text-red-500 fill-current" size={16} />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{meal.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
              <div>{meal.calories} calories</div>
              <div>{meal.protein}g protein</div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {meal.prepTime}
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} />
                {meal.rating}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {meal.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button className="w-full">
              Add to Meal Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderGuides = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {favoriteGuides.map((guide) => (
        <Card key={guide.id} className="hover:shadow-lg transition-shadow">
          <div className="flex">
            <img 
              src={guide.image} 
              alt={guide.title}
              className="w-24 h-24 object-cover rounded-l-lg"
            />
            <CardContent className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm leading-tight">{guide.title}</h3>
                <Button size="sm" variant="ghost">
                  <Heart className="text-red-500 fill-current" size={16} />
                </Button>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {guide.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} />
                  {guide.rating}
                </div>
                <Badge variant="outline" className="text-xs">
                  {guide.category}
                </Badge>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Favorites</h2>
        <p className="text-muted-foreground">Your saved workouts, meals, and guides</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
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
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'meals' && renderMeals()}
        {activeTab === 'recipes' && renderMeals()}
        {activeTab === 'guides' && renderGuides()}
      </div>

      {/* Empty State for other tabs */}
      {(activeTab === 'recipes') && (
        <div className="text-center py-12">
          <Plus className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg font-medium mb-2">No favorite recipes yet</h3>
          <p className="text-muted-foreground mb-4">Start adding recipes to see them here</p>
          <Button>Browse Recipes</Button>
        </div>
      )}
    </div>
  )
}
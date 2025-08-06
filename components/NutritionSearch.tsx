"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { Separator } from "./ui/separator"
import { Search, Plus, Verified, Clock } from 'lucide-react'
import { nutritionService, type SearchResult, type NutritionData } from './NutritionService'

interface NutritionSearchProps {
  onFoodAdd: (food: NutritionData, serving: number) => void
}

export function NutritionSearch({ onFoodAdd }: NutritionSearchProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [popularFoods, setPopularFoods] = useState<SearchResult[]>([])
  const [selectedFood, setSelectedFood] = useState<NutritionData | null>(null)
  const [customServing, setCustomServing] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Load popular foods on mount
  useEffect(() => {
    const loadPopular = async () => {
      const popular = await nutritionService.getPopularFoods()
      setPopularFoods(popular)
    }
    loadPopular()
  }, [])

  // Search foods with debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        const results = await nutritionService.searchFoods(query)
        setSearchResults(results)
        setIsLoading(false)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleFoodSelect = async (food: SearchResult) => {
    setIsLoadingDetails(true)
    const nutrition = await nutritionService.getNutritionData(food.id)
    if (nutrition) {
      setSelectedFood(nutrition)
      setCustomServing(1)
    }
    setIsLoadingDetails(false)
  }

  const handleAddFood = () => {
    if (selectedFood) {
      onFoodAdd(selectedFood, customServing)
      setSelectedFood(null)
      setQuery('')
      setSearchResults([])
    }
  }

  const displayedFoods = query.trim() ? searchResults : popularFoods
  const showingPopular = !query.trim()

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
        <Input
          placeholder="Search foods (powered by Google Nutrition)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Food Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {showingPopular ? (
              <>
                <Clock size={20} />
                Popular Foods
              </>
            ) : (
              <>
                <Search size={20} />
                Search Results ({searchResults.length})
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : displayedFoods.length > 0 ? (
            <div className="space-y-2">
              {displayedFoods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div>
                    <p className="font-medium">{food.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" size="sm">{food.category}</Badge>
                      <span>{food.servingSize}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{food.calories} cal</p>
                    <p className="text-xs text-muted-foreground">per serving</p>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>No foods found for "{query}"</p>
              <p className="text-sm">Try searching for basic ingredients</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Search for foods to see nutrition information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Food Details */}
      {selectedFood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Verified className="text-green-500" size={20} />
              Nutrition Facts
              {selectedFood.verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Google Verified
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDetails ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{selectedFood.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedFood.servingSize}</p>
                </div>

                {/* Serving Size Adjuster */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">Servings:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomServing(Math.max(0.5, customServing - 0.5))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{customServing}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomServing(customServing + 0.5)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Nutrition Facts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span className="font-medium">{Math.round(selectedFood.calories * customServing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span>{(selectedFood.protein * customServing).toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs</span>
                      <span>{(selectedFood.carbs * customServing).toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat</span>
                      <span>{(selectedFood.fat * customServing).toFixed(1)}g</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span>{(selectedFood.fiber * customServing).toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sugar</span>
                      <span>{(selectedFood.sugar * customServing).toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span>{Math.round(selectedFood.sodium * customServing)}mg</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleAddFood} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add {Math.round(selectedFood.calories * customServing)} calories
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
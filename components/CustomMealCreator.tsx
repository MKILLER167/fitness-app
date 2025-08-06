"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner@2.0.3'
import { Plus, Minus, Save, Clock, Users, ChefHat, Trash2, Star } from 'lucide-react'
import nutritionService, { type FoodItem, type NutritionData } from './NutritionService'

interface MealIngredient {
  id: string
  food: FoodItem
  amount: number
  unit: string
}

interface CustomMeal {
  id: string
  name: string
  description?: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  prepTime: number
  servings: number
  ingredients: MealIngredient[]
  instructions?: string[]
  tags: string[]
  nutrition: NutritionData
  createdAt: Date
  isFavorite: boolean
  timesCooked: number
  rating?: number
}

interface CustomMealCreatorProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onMealCreated?: (meal: CustomMeal) => void
  editMeal?: CustomMeal | null
}

export function CustomMealCreator({ 
  open = false, 
  onOpenChange, 
  onMealCreated,
  editMeal = null 
}: CustomMealCreatorProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [mealName, setMealName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CustomMeal['category']>('lunch')
  const [prepTime, setPrepTime] = useState(30)
  const [servings, setServings] = useState(1)
  const [ingredients, setIngredients] = useState<MealIngredient[]>([])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  // Ingredient search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load edit meal data
  useEffect(() => {
    if (editMeal) {
      setMealName(editMeal.name)
      setDescription(editMeal.description || '')
      setCategory(editMeal.category)
      setPrepTime(editMeal.prepTime)
      setServings(editMeal.servings)
      setIngredients(editMeal.ingredients)
      setInstructions(editMeal.instructions || [''])
      setTags(editMeal.tags)
    }
  }, [editMeal])

  // Search for foods
  useEffect(() => {
    const searchFoods = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await nutritionService.searchFood(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('Food search error:', error)
        toast.error('Failed to search foods')
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(searchFoods, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Calculate total nutrition
  const calculateTotalNutrition = (): NutritionData => {
    return ingredients.reduce((total, ingredient) => {
      const nutrition = nutritionService.calculateNutritionForAmount(
        ingredient.food.nutrition,
        ingredient.amount,
        ingredient.unit
      )
      
      return {
        calories: total.calories + nutrition.calories,
        protein: Math.round((total.protein + nutrition.protein) * 10) / 10,
        carbs: Math.round((total.carbs + nutrition.carbs) * 10) / 10,
        fat: Math.round((total.fat + nutrition.fat) * 10) / 10,
        fiber: total.fiber && nutrition.fiber ? 
          Math.round((total.fiber + nutrition.fiber) * 10) / 10 : undefined,
        sugar: total.sugar && nutrition.sugar ? 
          Math.round((total.sugar + nutrition.sugar) * 10) / 10 : undefined,
        sodium: total.sodium && nutrition.sodium ? 
          Math.round((total.sodium + nutrition.sodium) * 10) / 10 : undefined,
        servingSize: servings.toString(),
        servingSizeUnit: 'serving'
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  // Add ingredient
  const addIngredient = (food: FoodItem) => {
    const newIngredient: MealIngredient = {
      id: Date.now().toString(),
      food,
      amount: 100,
      unit: food.nutrition.servingSizeUnit || 'g'
    }
    setIngredients(prev => [...prev, newIngredient])
    setSearchQuery('')
    setSearchResults([])
  }

  // Update ingredient amount
  const updateIngredient = (id: string, field: 'amount' | 'unit', value: string | number) => {
    setIngredients(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    )
  }

  // Remove ingredient
  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id))
  }

  // Add instruction step
  const addInstruction = () => {
    setInstructions(prev => [...prev, ''])
  }

  // Update instruction
  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev =>
      prev.map((inst, i) => i === index ? value : inst)
    )
  }

  // Remove instruction
  const removeInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index))
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  // Save meal
  const saveMeal = () => {
    if (!mealName.trim()) {
      toast.error('Please enter a meal name')
      return
    }

    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    const meal: CustomMeal = {
      id: editMeal?.id || Date.now().toString(),
      name: mealName.trim(),
      description: description.trim() || undefined,
      category,
      prepTime,
      servings,
      ingredients,
      instructions: instructions.filter(inst => inst.trim()),
      tags,
      nutrition: calculateTotalNutrition(),
      createdAt: editMeal?.createdAt || new Date(),
      isFavorite: editMeal?.isFavorite || false,
      timesCooked: editMeal?.timesCooked || 0,
      rating: editMeal?.rating
    }

    // Save to localStorage
    const savedMeals = JSON.parse(localStorage.getItem('custom_meals') || '[]')
    if (editMeal) {
      const index = savedMeals.findIndex((m: CustomMeal) => m.id === editMeal.id)
      if (index >= 0) {
        savedMeals[index] = meal
      }
    } else {
      savedMeals.push(meal)
    }
    localStorage.setItem('custom_meals', JSON.stringify(savedMeals))

    toast.success(editMeal ? 'Meal updated successfully!' : 'Custom meal created successfully!')
    onMealCreated?.(meal)
    resetForm()
    handleOpenChange(false)
  }

  // Reset form
  const resetForm = () => {
    setMealName('')
    setDescription('')
    setCategory('lunch')
    setPrepTime(30)
    setServings(1)
    setIngredients([])
    setInstructions([''])
    setTags([])
    setSearchQuery('')
    setSearchResults([])
  }

  // Handle open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    if (!open && !editMeal) {
      resetForm()
    }
  }

  const totalNutrition = calculateTotalNutrition()
  const nutritionPerServing = {
    calories: Math.round(totalNutrition.calories / servings),
    protein: Math.round((totalNutrition.protein / servings) * 10) / 10,
    carbs: Math.round((totalNutrition.carbs / servings) * 10) / 10,
    fat: Math.round((totalNutrition.fat / servings) * 10) / 10
  }

  return (
    <Dialog open={isOpen || open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            {editMeal ? 'Edit Custom Meal' : 'Create Custom Meal'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="meal-name">Meal Name *</Label>
              <Input
                id="meal-name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Protein Power Bowl"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your meal..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value: CustomMeal['category']) => setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prep-time">Prep Time (min)</Label>
                <Input
                  id="prep-time"
                  type="number"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  min={1}
                  max={600}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>

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
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Nutrition Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Nutrition (per serving)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: {nutritionPerServing.calories}</div>
                  <div>Protein: {nutritionPerServing.protein}g</div>
                  <div>Carbs: {nutritionPerServing.carbs}g</div>
                  <div>Fat: {nutritionPerServing.fat}g</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Ingredients */}
          <div className="space-y-4">
            <div>
              <Label>Add Ingredients</Label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for foods..."
              />
              {searchResults.length > 0 && (
                <ScrollArea className="h-32 mt-2 border rounded-md">
                  <div className="p-2 space-y-1">
                    {searchResults.map((food, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-accent rounded-md cursor-pointer text-sm"
                        onClick={() => addIngredient(food)}
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {food.nutrition.calories} cal per {food.nutrition.servingSize}{food.nutrition.servingSizeUnit}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div>
              <Label>Ingredients ({ingredients.length})</Label>
              <ScrollArea className="h-64 border rounded-md">
                <div className="p-2 space-y-2">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center gap-2 p-2 bg-accent rounded-md">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{ingredient.food.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {nutritionService.calculateNutritionForAmount(
                            ingredient.food.nutrition, 
                            ingredient.amount, 
                            ingredient.unit
                          ).calories} cal
                        </div>
                      </div>
                      <Input
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(ingredient.id, 'amount', Number(e.target.value))}
                        className="w-16 h-8"
                        min={1}
                      />
                      <Select 
                        value={ingredient.unit} 
                        onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                      >
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="cup">cup</SelectItem>
                          <SelectItem value="tbsp">tbsp</SelectItem>
                          <SelectItem value="tsp">tsp</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {ingredients.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No ingredients added yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div className="space-y-4">
            <div>
              <Label>Instructions</Label>
              <ScrollArea className="h-80 border rounded-md">
                <div className="p-2 space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder={`Step ${index + 1}...`}
                          rows={2}
                          className="resize-none"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstruction(index)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                          disabled={instructions.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInstruction}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveMeal} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                {editMeal ? 'Update Meal' : 'Save Meal'}
              </Button>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { CustomMeal, MealIngredient }
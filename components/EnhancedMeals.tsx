"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { TodaysNutrition } from './TodaysNutrition'
import { CustomMealCreator, type CustomMeal } from './CustomMealCreator'
import { AdBanner } from './AdBanner'
import { NotificationBell } from './NotificationBell'
import { QuickAddFood } from './QuickAddFood'
import { useReminderService } from './ReminderService'
import { toast } from 'sonner@2.0.3'
import { 
  Utensils, Plus, Clock, Target, TrendingUp, 
  Star, Heart, Calendar, Bell, ChefHat, Filter, SortAsc,
  Timer, Users, Trash2, Zap, Edit
} from 'lucide-react'
import type { UserProfile } from './Onboarding'
import { useLanguage } from './LanguageContext'

interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  timestamp: Date
  source: 'search' | 'custom' | 'barcode' | 'quick'
  amount: number
  unit: string
  consumedAt?: string // Time when the meal was consumed
}

interface EnhancedMealsProps {
  userProfile?: UserProfile
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
  onManageSubscription?: () => void
}

export function EnhancedMeals({ userProfile, onXPGain, subscriptionTier = 'free', onPremiumFeatureAccess, onManageSubscription }: EnhancedMealsProps) {
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([])
  const [activeTab, setActiveTab] = useState('log')
  const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('breakfast')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterMealType, setFilterMealType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'time' | 'calories' | 'name'>('time')
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null)
  
  // Language context
  const { language, direction } = useLanguage()
  
  // Reminder service
  const { reminderService, notifications, unreadCount } = useReminderService()

  // Load data on mount
  useEffect(() => {
    loadMeals()
    loadCustomMeals()
  }, [])

  // Listen for external meal additions (from Home component)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fitness_meals') {
        loadMeals()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for direct updates within the same tab
    const handleMealUpdate = () => {
      loadMeals()
    }
    
    window.addEventListener('mealsUpdated', handleMealUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('mealsUpdated', handleMealUpdate)
    }
  }, [])

  // Navigation handler
  const handleNavigate = (tab: string) => {
    const event = new CustomEvent('navigateToTab', { detail: tab })
    window.dispatchEvent(event)
  }

  // Load meals from localStorage
  const loadMeals = () => {
    const savedMeals = localStorage.getItem('fitness_meals')
    if (savedMeals) {
      const parsedMeals = JSON.parse(savedMeals).map((meal: any) => ({
        ...meal,
        timestamp: new Date(meal.timestamp)
      }))
      setMeals(parsedMeals)
    }
  }

  // Load custom meals
  const loadCustomMeals = () => {
    const savedCustomMeals = localStorage.getItem('custom_meals')
    if (savedCustomMeals) {
      const parsedMeals = JSON.parse(savedCustomMeals).map((meal: any) => ({
        ...meal,
        createdAt: new Date(meal.createdAt)
      }))
      setCustomMeals(parsedMeals)
    }
  }

  // Save meals to localStorage
  const saveMeals = (updatedMeals: MealEntry[]) => {
    localStorage.setItem('fitness_meals', JSON.stringify(updatedMeals))
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('mealsUpdated'))
  }

  // Add meal entry
  const addMealEntry = (mealData: Omit<MealEntry, 'id' | 'timestamp'>) => {
    const newMeal: MealEntry = {
      ...mealData,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    const updatedMeals = [...meals, newMeal]
    setMeals(updatedMeals)
    saveMeals(updatedMeals)

    // Award XP
    onXPGain?.(10, 'Logging a meal')
    
    toast.success(`${mealData.name} added to ${mealData.mealType}!`)
  }

  // Add custom meal as entry
  const addCustomMealEntry = (customMeal: CustomMeal, amount: number = 1) => {
    const nutritionPerServing = {
      calories: Math.round(customMeal.nutrition.calories / customMeal.servings),
      protein: Math.round((customMeal.nutrition.protein / customMeal.servings) * 10) / 10,
      carbs: Math.round((customMeal.nutrition.carbs / customMeal.servings) * 10) / 10,
      fat: Math.round((customMeal.nutrition.fat / customMeal.servings) * 10) / 10
    }

    const mealEntry: Omit<MealEntry, 'id' | 'timestamp'> = {
      name: customMeal.name,
      calories: nutritionPerServing.calories * amount,
      protein: nutritionPerServing.protein * amount,
      carbs: nutritionPerServing.carbs * amount,
      fat: nutritionPerServing.fat * amount,
      mealType: customMeal.category === 'dessert' ? 'snack' : customMeal.category,
      source: 'custom',
      amount,
      unit: 'serving'
    }

    addMealEntry(mealEntry)

    // Update custom meal stats
    const updatedCustomMeals = customMeals.map(meal =>
      meal.id === customMeal.id
        ? { ...meal, timesCooked: meal.timesCooked + 1 }
        : meal
    )
    setCustomMeals(updatedCustomMeals)
    localStorage.setItem('custom_meals', JSON.stringify(updatedCustomMeals))
  }

  // Delete meal entry
  const deleteMealEntry = (id: string) => {
    const updatedMeals = meals.filter(meal => meal.id !== id)
    setMeals(updatedMeals)
    saveMeals(updatedMeals)
    toast.success('Meal entry deleted')
  }

  // Edit meal entry
  const updateMealEntry = (id: string, updates: Partial<MealEntry>) => {
    const updatedMeals = meals.map(meal =>
      meal.id === id ? { ...meal, ...updates } : meal
    )
    setMeals(updatedMeals)
    saveMeals(updatedMeals)
    toast.success('Meal updated')
    setEditingMeal(null)
  }

  // Toggle custom meal favorite
  const toggleCustomMealFavorite = (id: string) => {
    const updatedCustomMeals = customMeals.map(meal =>
      meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal
    )
    setCustomMeals(updatedCustomMeals)
    localStorage.setItem('custom_meals', JSON.stringify(updatedCustomMeals))
  }

  // Calculate daily totals
  const getDailyTotals = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.timestamp)
      mealDate.setHours(0, 0, 0, 0)
      return mealDate.getTime() === today.getTime()
    })

    return todayMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  // Get meals by type for today
  const getMealsByType = (type: MealEntry['mealType']) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp)
      mealDate.setHours(0, 0, 0, 0)
      return mealDate.getTime() === today.getTime() && meal.mealType === type
    })
  }

  // Filter and sort custom meals
  const getFilteredCustomMeals = () => {
    let filtered = customMeals

    if (filterMealType !== 'all') {
      filtered = filtered.filter(meal => meal.category === filterMealType)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'calories':
          return b.nutrition.calories - a.nutrition.calories
        case 'time':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })
  }

  // Quick reminder setup
  const setupQuickReminder = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const defaultTimes = {
      breakfast: '08:00',
      lunch: '12:30',
      dinner: '18:30',
      snack: '15:00'
    }

    reminderService.addQuickMealReminder(mealType, defaultTimes[mealType])
    toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} reminder set for ${defaultTimes[mealType]}`)
  }

  // Format time display
  const formatTime = (time?: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const dailyTotals = getDailyTotals()
  const targetCalories = userProfile?.calorieTarget || userProfile?.targetCalories || 2000

  return (
    <div className="min-h-screen bg-background p-4 pb-20" dir={direction}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Utensils className="h-6 w-6" />
              {language === 'ar' ? 'متتبع التغذية' : 'Nutrition Tracker'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تتبع وجباتك وحقق أهدافك الغذائية' : 'Track your meals and reach your nutrition goals'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <NotificationBell onNavigate={handleNavigate} />
            <QuickAddFood 
              onFoodAdded={addMealEntry}
              onNavigateToMeals={() => setActiveTab('add')}
              onXPGain={onXPGain}
            />
          </div>
        </div>

        {/* Today's Nutrition Overview */}
        <Card>
          <CardContent className="p-6">
            <TodaysNutrition
              currentNutrition={{
                calories: dailyTotals.calories || 0,
                protein: dailyTotals.protein || 0,
                carbs: dailyTotals.carbs || 0,
                fat: dailyTotals.fat || 0
              }}
              targetCalories={targetCalories || 2000}
            />
          </CardContent>
        </Card>

        {/* Ad Banner for Free Users */}
        {subscriptionTier === 'free' && (
          <AdBanner
            subscriptionTier={subscriptionTier}
            onUpgrade={onManageSubscription}
            position="inline"
            size="medium"
            dismissible={true}
          />
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="log">Meal Log</TabsTrigger>
            <TabsTrigger value="custom">Custom Meals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Meal Log Tab */}
          <TabsContent value="log" className="space-y-4">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
              const typeMeals = getMealsByType(mealType)
              const typeCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0)

              return (
                <Card key={mealType}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="capitalize">{mealType}</CardTitle>
                        <Badge variant="outline">{typeCalories} cal</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setupQuickReminder(mealType)}
                          title="Set reminder"
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <QuickAddFood 
                          onFoodAdded={(mealData) => addMealEntry({...mealData, mealType})}
                          onNavigateToMeals={() => setActiveTab('custom')}
                          onXPGain={onXPGain}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {typeMeals.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No {mealType} logged yet</p>
                        <div className="flex gap-2 justify-center mt-4">
                          <QuickAddFood 
                            onFoodAdded={(mealData) => addMealEntry({...mealData, mealType})}
                            onNavigateToMeals={() => setActiveTab('custom')}
                            onXPGain={onXPGain}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {typeMeals.map(meal => (
                          <div key={meal.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{meal.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{meal.calories} cal • {meal.amount} {meal.unit}</span>
                                {meal.consumedAt && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatTime(meal.consumedAt)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {meal.source === 'quick' && <Zap className="h-3 w-3 mr-1" />}
                                {meal.source}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMeal(meal)}
                                className="h-8 w-8 p-0"
                                title="Edit meal"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMealEntry(meal.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                title="Delete meal"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Custom Meals Tab */}
          <TabsContent value="custom" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Select value={filterMealType} onValueChange={setFilterMealType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value: 'time' | 'calories' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Latest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="calories">Calories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <CustomMealCreator onMealCreated={loadCustomMeals} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredCustomMeals().map(meal => (
                <Card key={meal.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base line-clamp-1">{meal.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">{meal.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCustomMealFavorite(meal.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Heart className={`h-4 w-4 ${meal.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Calories:</span>
                        <span className="ml-1 font-medium">{Math.round(meal.nutrition.calories / meal.servings)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protein:</span>
                        <span className="ml-1 font-medium">{Math.round((meal.nutrition.protein / meal.servings) * 10) / 10}g</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        <span className="text-muted-foreground">{meal.prepTime}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-muted-foreground">{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {meal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meal.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {meal.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{meal.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {meal.timesCooked > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Cooked {meal.timesCooked} time{meal.timesCooked > 1 ? 's' : ''}
                      </div>
                    )}

                    <Button
                      onClick={() => addCustomMealEntry(meal)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Log
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {getFilteredCustomMeals().length === 0 && (
                <div className="col-span-full text-center py-12">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No custom meals yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first custom meal to get started</p>
                  <CustomMealCreator onMealCreated={loadCustomMeals} />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            {subscriptionTier === 'free' ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Detailed Nutrition Insights</h3>
                  <p className="text-muted-foreground mb-6">
                    Get advanced analytics, weekly trends, and personalized nutrition recommendations
                  </p>
                  <Button 
                    onClick={() => onPremiumFeatureAccess?.('Nutrition Insights')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade for Insights
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Weekly Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(dailyTotals.calories)}</div>
                    <p className="text-sm text-muted-foreground">calories per day</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Goal Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round((dailyTotals.calories / targetCalories) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">of daily goal</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Meals Logged
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{meals.length}</div>
                    <p className="text-sm text-muted-foreground">total entries</p>
                  </CardContent>
                </Card>

                {subscriptionTier === 'pro' && (
                  <>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Star className="h-4 w-4 text-purple-500" />
                          Nutrition Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">85/100</div>
                        <p className="text-sm text-muted-foreground">quality rating</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          Health Impact
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">Good</div>
                        <p className="text-sm text-muted-foreground">trend analysis</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          Streak
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">12 days</div>
                        <p className="text-sm text-muted-foreground">consistent tracking</p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Meal Dialog */}
        {editingMeal && (
          <Dialog open={!!editingMeal} onOpenChange={() => setEditingMeal(null)}>
            <DialogContent className="max-w-md" dir={direction}>
              <DialogHeader>
                <DialogTitle>Edit Meal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Food Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMeal.name}
                    onChange={(e) => setEditingMeal(prev => prev ? {...prev, name: e.target.value} : null)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edit-calories">Calories</Label>
                    <Input
                      id="edit-calories"
                      type="number"
                      value={editingMeal.calories}
                      onChange={(e) => setEditingMeal(prev => prev ? {...prev, calories: parseFloat(e.target.value) || 0} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-amount">Amount</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      step="0.1"
                      value={editingMeal.amount}
                      onChange={(e) => setEditingMeal(prev => prev ? {...prev, amount: parseFloat(e.target.value) || 0} : null)}
                    />
                  </div>
                </div>
                {editingMeal.consumedAt && (
                  <div>
                    <Label htmlFor="edit-time">Time Consumed</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editingMeal.consumedAt}
                      onChange={(e) => setEditingMeal(prev => prev ? {...prev, consumedAt: e.target.value} : null)}
                    />
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingMeal(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => updateMealEntry(editingMeal.id, editingMeal)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
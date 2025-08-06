"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { useLanguage } from './LanguageContext'
import { toast } from 'sonner@2.0.3'
import { 
  Plus, 
  Clock, 
  Utensils, 
  ChefHat,
  Star,
  Flame,
  Scale,
  Timer,
  Zap
} from 'lucide-react'

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
  consumedAt?: string // Time when the meal was consumed (HH:MM format)
}

interface QuickFood {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  unit: string
  category: string
}

interface QuickAddFoodProps {
  onFoodAdded?: (meal: Omit<MealEntry, 'id' | 'timestamp'>) => void
  onNavigateToMeals?: () => void
  onXPGain?: (xp: number, reason: string) => void
}

const commonFoods: QuickFood[] = [
  // Breakfast
  { name: 'Scrambled Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fat: 10, unit: 'serving', category: 'breakfast' },
  { name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 9, fat: 5, unit: 'cup', category: 'breakfast' },
  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, unit: 'cup', category: 'breakfast' },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, unit: 'medium', category: 'breakfast' },
  { name: 'Whole Wheat Toast', calories: 80, protein: 4, carbs: 14, fat: 1, unit: 'slice', category: 'breakfast' },
  
  // Lunch/Dinner
  { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4, unit: '100g', category: 'protein' },
  { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 2, unit: 'cup', category: 'carbs' },
  { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 4, unit: 'cup', category: 'carbs' },
  { name: 'Salmon Fillet', calories: 206, protein: 22, carbs: 0, fat: 12, unit: '100g', category: 'protein' },
  { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0, unit: 'medium', category: 'carbs' },
  
  // Vegetables
  { name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fat: 1, unit: 'cup', category: 'vegetables' },
  { name: 'Spinach', calories: 7, protein: 1, carbs: 1, fat: 0, unit: 'cup', category: 'vegetables' },
  { name: 'Avocado', calories: 234, protein: 3, carbs: 12, fat: 21, unit: 'medium', category: 'fats' },
  { name: 'Mixed Salad', calories: 20, protein: 2, carbs: 4, fat: 0, unit: 'cup', category: 'vegetables' },
  
  // Snacks
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, unit: 'medium', category: 'snacks' },
  { name: 'Almonds', calories: 163, protein: 6, carbs: 6, fat: 14, unit: '28g', category: 'snacks' },
  { name: 'Greek Yogurt Cup', calories: 100, protein: 17, carbs: 6, fat: 0, unit: 'container', category: 'snacks' },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 20, fat: 7, unit: 'bar', category: 'snacks' },
  
  // Beverages
  { name: 'Protein Shake', calories: 120, protein: 25, carbs: 3, fat: 1, unit: 'scoop', category: 'beverages' },
  { name: 'Green Tea', calories: 2, protein: 0, carbs: 0, fat: 0, unit: 'cup', category: 'beverages' },
  { name: 'Black Coffee', calories: 2, protein: 0, carbs: 0, fat: 0, unit: 'cup', category: 'beverages' }
]

export function QuickAddFood({ onFoodAdded, onNavigateToMeals, onXPGain }: QuickAddFoodProps) {
  const { language, direction } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('quick')
  const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('breakfast')
  const [consumedTime, setConsumedTime] = useState('')
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    amount: '1',
    unit: 'serving'
  })

  // Get current meal type and time based on current time
  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    const currentTime = `${hour.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    setConsumedTime(currentTime)
    
    if (hour < 11) setSelectedMealType('breakfast')
    else if (hour < 16) setSelectedMealType('lunch')
    else if (hour < 21) setSelectedMealType('dinner')
    else setSelectedMealType('snack')
  }, [])

  const mealTypes = {
    breakfast: language === 'ar' ? 'الإفطار' : 'Breakfast',
    lunch: language === 'ar' ? 'الغداء' : 'Lunch',
    dinner: language === 'ar' ? 'العشاء' : 'Dinner',
    snack: language === 'ar' ? 'وجبة خفيفة' : 'Snack'
  }

  const categories = {
    breakfast: language === 'ar' ? 'الإفطار' : 'Breakfast',
    protein: language === 'ar' ? 'البروتين' : 'Protein',
    carbs: language === 'ar' ? 'الكربوهيدرات' : 'Carbs',
    vegetables: language === 'ar' ? 'الخضروات' : 'Vegetables',
    fats: language === 'ar' ? 'الدهون' : 'Fats',
    snacks: language === 'ar' ? 'الوجبات الخفيفة' : 'Snacks',
    beverages: language === 'ar' ? 'المشروبات' : 'Beverages'
  }

  const handleQuickAdd = (food: QuickFood, amount: number = 1) => {
    const mealEntry: Omit<MealEntry, 'id' | 'timestamp'> = {
      name: `${food.name}${amount !== 1 ? ` (${amount}x)` : ''}`,
      calories: Math.round(food.calories * amount),
      protein: Math.round(food.protein * amount * 10) / 10,
      carbs: Math.round(food.carbs * amount * 10) / 10,
      fat: Math.round(food.fat * amount * 10) / 10,
      mealType: selectedMealType,
      source: 'quick',
      amount,
      unit: food.unit,
      consumedAt: consumedTime
    }

    onFoodAdded?.(mealEntry)
    onXPGain?.(10, 'Quick food log')
    
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${food.name} إلى ${mealTypes[selectedMealType]}` 
        : `${food.name} added to ${mealTypes[selectedMealType]}`
    )
    
    setIsOpen(false)
  }

  const handleCustomAdd = () => {
    if (!customFood.name.trim() || !customFood.calories) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    const amount = parseFloat(customFood.amount) || 1
    const mealEntry: Omit<MealEntry, 'id' | 'timestamp'> = {
      name: customFood.name,
      calories: Math.round(parseFloat(customFood.calories) * amount),
      protein: Math.round((parseFloat(customFood.protein) || 0) * amount * 10) / 10,
      carbs: Math.round((parseFloat(customFood.carbs) || 0) * amount * 10) / 10,
      fat: Math.round((parseFloat(customFood.fat) || 0) * amount * 10) / 10,
      mealType: selectedMealType,
      source: 'custom',
      amount,
      unit: customFood.unit,
      consumedAt: consumedTime
    }

    onFoodAdded?.(mealEntry)
    onXPGain?.(15, 'Custom food entry')
    
    toast.success(
      language === 'ar' 
        ? `تم إضافة ${customFood.name} إلى ${mealTypes[selectedMealType]}` 
        : `${customFood.name} added to ${mealTypes[selectedMealType]}`
    )
    
    // Reset form
    setCustomFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      amount: '1',
      unit: 'serving'
    })
    
    setIsOpen(false)
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة طعام' : 'Add Food'}
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[85vh] p-0" dir={direction}>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {language === 'ar' ? 'إضافة طعام سريع' : 'Quick Add Food'}
          </DialogTitle>
        </DialogHeader>

        {/* Meal Type and Time Selector */}
        <div className="px-6 space-y-4">
          <div>
            <Label className="text-sm font-medium">
              {language === 'ar' ? 'نوع الوجبة' : 'Meal Type'}
            </Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {Object.entries(mealTypes).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedMealType === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMealType(key as MealEntry['mealType'])}
                  className="text-xs h-8"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="consumed-time" className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {language === 'ar' ? 'وقت تناول الطعام' : 'Time Consumed'}
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="consumed-time"
                type="time"
                value={consumedTime}
                onChange={(e) => setConsumedTime(e.target.value)}
                className="flex-1"
              />
              <Badge variant="outline" className="text-xs">
                {formatTime(consumedTime)}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {language === 'ar' ? 'سريع' : 'Quick'}
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                <ChefHat className="h-3 w-3 mr-1" />
                {language === 'ar' ? 'مخصص' : 'Custom'}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* Quick Add Tab */}
            <TabsContent value="quick" className="h-full mt-0">
              <ScrollArea className="h-80 px-4">
                <div className="space-y-3 pb-4">
                  {Object.entries(
                    commonFoods.reduce((acc, food) => {
                      if (!acc[food.category]) acc[food.category] = []
                      acc[food.category].push(food)
                      return acc
                    }, {} as Record<string, QuickFood[]>)
                  ).map(([category, foods]) => (
                    <div key={category}>
                      <h3 className="font-medium text-sm mb-2 text-muted-foreground flex items-center gap-2">
                        {category === 'protein' && <Scale className="h-3 w-3" />}
                        {category === 'carbs' && <Flame className="h-3 w-3" />}
                        {category === 'vegetables' && <Star className="h-3 w-3" />}
                        {categories[category as keyof typeof categories] || category}
                      </h3>
                      <div className="grid gap-2">
                        {foods.map((food, index) => (
                          <Card 
                            key={`${category}-${index}`} 
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handleQuickAdd(food)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{food.name}</h4>
                                  <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Flame className="h-3 w-3 text-orange-500" />
                                      <span className="text-xs text-muted-foreground ltr-numbers">
                                        {food.calories} cal
                                      </span>
                                    </div>
                                    {food.protein > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Scale className="h-3 w-3 text-blue-500" />
                                        <span className="text-xs text-muted-foreground ltr-numbers">
                                          {food.protein}g P
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {food.unit}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Custom Add Tab */}
            <TabsContent value="custom" className="h-full mt-0">
              <ScrollArea className="h-80 px-6">
                <div className="space-y-4 pb-4">
                  <div>
                    <Label htmlFor="food-name">
                      {language === 'ar' ? 'اسم الطعام *' : 'Food Name *'}
                    </Label>
                    <Input
                      id="food-name"
                      value={customFood.name}
                      onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={language === 'ar' ? 'مثال: دجاج مشوي' : 'e.g. Grilled Chicken'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="food-calories">
                        {language === 'ar' ? 'السعرات *' : 'Calories *'}
                      </Label>
                      <Input
                        id="food-calories"
                        type="number"
                        value={customFood.calories}
                        onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="food-protein">
                        {language === 'ar' ? 'البروتين (جم)' : 'Protein (g)'}
                      </Label>
                      <Input
                        id="food-protein"
                        type="number"
                        step="0.1"
                        value={customFood.protein}
                        onChange={(e) => setCustomFood(prev => ({ ...prev, protein: e.target.value }))}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="food-carbs">
                        {language === 'ar' ? 'الكربوهيدرات (جم)' : 'Carbs (g)'}
                      </Label>
                      <Input
                        id="food-carbs"
                        type="number"
                        step="0.1"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood(prev => ({ ...prev, carbs: e.target.value }))}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="food-fat">
                        {language === 'ar' ? 'الدهون (جم)' : 'Fat (g)'}
                      </Label>
                      <Input
                        id="food-fat"
                        type="number"
                        step="0.1"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood(prev => ({ ...prev, fat: e.target.value }))}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="food-amount">
                        {language === 'ar' ? 'الكمية' : 'Amount'}
                      </Label>
                      <Input
                        id="food-amount"
                        type="number"
                        step="0.1"
                        value={customFood.amount}
                        onChange={(e) => setCustomFood(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="food-unit">
                        {language === 'ar' ? 'الوحدة' : 'Unit'}
                      </Label>
                      <Select 
                        value={customFood.unit} 
                        onValueChange={(value) => setCustomFood(prev => ({ ...prev, unit: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serving">{language === 'ar' ? 'حصة' : 'Serving'}</SelectItem>
                          <SelectItem value="cup">{language === 'ar' ? 'كوب' : 'Cup'}</SelectItem>
                          <SelectItem value="gram">{language === 'ar' ? 'جرام' : 'Gram'}</SelectItem>
                          <SelectItem value="piece">{language === 'ar' ? 'قطعة' : 'Piece'}</SelectItem>
                          <SelectItem value="tbsp">{language === 'ar' ? 'ملعقة كبيرة' : 'Tbsp'}</SelectItem>
                          <SelectItem value="tsp">{language === 'ar' ? 'ملعقة صغيرة' : 'Tsp'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {customFood.calories && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm mb-2">
                          {language === 'ar' ? 'المعلومات الغذائية' : 'Nutrition Info'}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>{language === 'ar' ? 'السعرات:' : 'Calories:'}</span>
                            <span className="ltr-numbers">
                              {Math.round(parseFloat(customFood.calories) * parseFloat(customFood.amount || '1'))}
                            </span>
                          </div>
                          {customFood.protein && (
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'البروتين:' : 'Protein:'}</span>
                              <span className="ltr-numbers">
                                {Math.round(parseFloat(customFood.protein) * parseFloat(customFood.amount || '1') * 10) / 10}g
                              </span>
                            </div>
                          )}
                          {customFood.carbs && (
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'الكربوهيدرات:' : 'Carbs:'}</span>
                              <span className="ltr-numbers">
                                {Math.round(parseFloat(customFood.carbs) * parseFloat(customFood.amount || '1') * 10) / 10}g
                              </span>
                            </div>
                          )}
                          {customFood.fat && (
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'الدهون:' : 'Fat:'}</span>
                              <span className="ltr-numbers">
                                {Math.round(parseFloat(customFood.fat) * parseFloat(customFood.amount || '1') * 10) / 10}g
                              </span>
                            </div>
                          )}
                        </div>
                        {consumedTime && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {language === 'ar' ? 'سيتم تسجيله في:' : 'Will be logged at:'}
                              </span>
                              <span className="ltr-numbers font-medium">
                                {formatTime(consumedTime)}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Button onClick={handleCustomAdd} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إضافة إلى' : 'Add to'} {mealTypes[selectedMealType]}
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
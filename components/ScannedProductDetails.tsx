"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  Star,
  AlertTriangle,
  Info,
  Scale,
  Zap,
  Heart,
  Shield
} from 'lucide-react'
import { ProductNutritionData } from './BarcodeNutritionService'
import { toast } from 'sonner@2.0.3'

interface ScannedProductDetailsProps {
  product: ProductNutritionData
  onAddToMeal: (product: ProductNutritionData, servings: number) => void
  onClose: () => void
}

interface NutrientDisplayProps {
  label: string
  value: number
  unit: string
  dailyValue?: number
  color?: string
  icon?: React.ReactNode
}

function NutrientDisplay({ label, value, unit, dailyValue, color = "text-gray-600", icon }: NutrientDisplayProps) {
  const roundedValue = Math.round(value * 10) / 10
  const dvPercentage = dailyValue ? Math.round((value / dailyValue) * 100) : null
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${color}`}>
          {roundedValue}{unit}
        </span>
        {dvPercentage && (
          <Badge variant="outline" className="text-xs">
            {dvPercentage}% DV
          </Badge>
        )}
      </div>
    </div>
  )
}

export function ScannedProductDetails({ product, onAddToMeal, onClose }: ScannedProductDetailsProps) {
  const [servings, setServings] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const adjustedNutrition = {
    calories: Math.round(product.nutrition.calories * servings),
    protein: Math.round(product.nutrition.protein * servings * 10) / 10,
    carbs: Math.round(product.nutrition.carbs * servings * 10) / 10,
    fat: Math.round(product.nutrition.fat * servings * 10) / 10,
    fiber: product.nutrition.fiber ? Math.round(product.nutrition.fiber * servings * 10) / 10 : 0,
    sugar: product.nutrition.sugar ? Math.round(product.nutrition.sugar * servings * 10) / 10 : 0,
    sodium: product.nutrition.sodium ? Math.round(product.nutrition.sodium * servings * 100) / 100 : 0
  }

  const handleAddToMeal = async () => {
    setIsAdding(true)
    try {
      await onAddToMeal(product, servings)
      toast.success(`Added ${product.productName} to your meal!`)
      onClose()
    } catch (error) {
      toast.error('Failed to add product to meal')
    } finally {
      setIsAdding(false)
    }
  }

  const incrementServings = () => {
    setServings(prev => Math.min(prev + 0.5, 10))
  }

  const decrementServings = () => {
    setServings(prev => Math.max(prev - 0.5, 0.5))
  }

  const getSourceBadge = () => {
    const sourceConfig = {
      google: { label: 'Google', color: 'bg-blue-100 text-blue-800', icon: <Shield size={12} /> },
      openfoodfacts: { label: 'OpenFood', color: 'bg-green-100 text-green-800', icon: <Check size={12} /> },
      usda: { label: 'USDA', color: 'bg-purple-100 text-purple-800', icon: <Star size={12} /> },
      manual: { label: 'Manual', color: 'bg-orange-100 text-orange-800', icon: <Info size={12} /> }
    }
    
    const config = sourceConfig[product.source]
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const getNutritionScore = () => {
    const { calories, protein, fiber } = adjustedNutrition
    const score = Math.min(100, Math.max(0, 
      50 + (protein * 2) + (fiber * 3) - (calories / 10)
    ))
    return Math.round(score)
  }

  const nutritionScore = getNutritionScore()
  const scoreColor = nutritionScore >= 80 ? 'text-green-600' : 
                    nutritionScore >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{product.productName}</CardTitle>
              {product.brand && (
                <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {getSourceBadge()}
                {product.verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    <Check size={12} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Product Image */}
          {product.imageUrl && (
            <div className="mt-3">
              <img 
                src={product.imageUrl} 
                alt={product.productName}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Serving Size Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Serving Size</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{product.servingSize}</span>
                <Scale size={14} className="text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementServings}
                disabled={servings <= 0.5}
              >
                <Minus size={14} />
              </Button>
              
              <div className="flex-1">
                <Input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  min="0.5"
                  max="10"
                  step="0.5"
                  className="text-center"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={incrementServings}
                disabled={servings >= 10}
              >
                <Plus size={14} />
              </Button>
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Total: {servings} × {product.servingSize}
              </span>
            </div>
          </div>

          <Separator />

          {/* Nutrition Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Nutrition Score</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${scoreColor}`}>{nutritionScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>  
            </div>
            <div className="flex items-center gap-2">
              <Heart size={14} className={scoreColor.replace('text-', 'text-')} />
              <span className="text-xs text-muted-foreground">
                Based on protein, fiber, and calorie density
              </span>
            </div>
          </div>

          {/* Main Macros */}
          <div className="space-y-1">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Zap className="text-orange-500" size={16} />
              Nutrition Facts
              <span className="text-xs text-muted-foreground ml-auto">
                Per {servings} serving{servings !== 1 ? 's' : ''}
              </span>
            </h4>
            
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <NutrientDisplay
                label="Calories"
                value={adjustedNutrition.calories}
                unit=""
                dailyValue={2000}
                color="text-orange-600"
                icon="🔥"
              />
              <Separator className="my-2" />
              <NutrientDisplay
                label="Protein"
                value={adjustedNutrition.protein}
                unit="g"
                dailyValue={50}
                color="text-blue-600"
                icon="💪"
              />
              <NutrientDisplay
                label="Carbohydrates"
                value={adjustedNutrition.carbs}
                unit="g"
                dailyValue={300}
                color="text-green-600"
                icon="🌾"
              />
              <NutrientDisplay
                label="Fat"
                value={adjustedNutrition.fat}
                unit="g"
                dailyValue={65}
                color="text-yellow-600"
                icon="🥑"
              />
            </div>
          </div>

          {/* Additional Nutrients */}
          {(adjustedNutrition.fiber > 0 || adjustedNutrition.sugar > 0 || adjustedNutrition.sodium > 0) && (
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Additional Nutrients</h4>
              <div className="space-y-1">
                {adjustedNutrition.fiber > 0 && (
                  <NutrientDisplay
                    label="Fiber"
                    value={adjustedNutrition.fiber}
                    unit="g"
                    dailyValue={25}
                    icon="🌿"
                  />
                )}
                {adjustedNutrition.sugar > 0 && (
                  <NutrientDisplay
                    label="Sugar"
                    value={adjustedNutrition.sugar}
                    unit="g"
                    dailyValue={50}
                    icon="🍯"
                  />
                )}
                {adjustedNutrition.sodium > 0 && (
                  <NutrientDisplay
                    label="Sodium"
                    value={adjustedNutrition.sodium}
                    unit="g"
                    dailyValue={2.3}
                    icon="🧂"
                  />
                )}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Ingredients</h4>
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                {product.ingredients.join(', ')}
              </div>
            </div>
          )}

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={14} />
                Allergens
              </h4>
              <div className="flex flex-wrap gap-1">
                {product.allergens.map((allergen, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add to Meal Button */}
          <Button 
            onClick={handleAddToMeal}
            disabled={isAdding}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Add to Meal ({adjustedNutrition.calories} cal)
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
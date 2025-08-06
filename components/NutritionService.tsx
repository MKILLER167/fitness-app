"use client"

import { useState, useEffect } from 'react'

export interface NutritionData {
  id?: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize?: string
  servingSizeUnit?: string
  verified?: boolean
  category?: string
}

export interface FoodItem {
  name: string
  brand?: string
  barcode?: string
  nutrition: NutritionData
  verified?: boolean
  source?: 'api' | 'database' | 'user'
}

export interface SearchResult {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
  servingSize: string
  servingSizeUnit?: string
  verified?: boolean
  confidence?: number
  matchType?: 'exact' | 'partial' | 'fuzzy'
}

class NutritionService {
  private static instance: NutritionService | null = null
  private foodDatabase: Map<string, FoodItem> = new Map()
  private searchCache: Map<string, SearchResult[]> = new Map()
  private isInitialized = false

  private constructor() {
    this.initializeDatabase()
  }

  static getInstance(): NutritionService {
    if (!NutritionService.instance) {
      NutritionService.instance = new NutritionService()
    }
    return NutritionService.instance
  }

  private async initializeDatabase(): Promise<void> {
    if (this.isInitialized) return

    // Load comprehensive food database
    const commonFoods: FoodItem[] = [
      // Proteins
      {
        name: 'Chicken Breast',
        nutrition: { 
          id: 'chicken-breast',
          name: 'Chicken Breast',
          calories: 165, 
          protein: 31, 
          carbs: 0, 
          fat: 3.6, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Protein'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Salmon',
        nutrition: { 
          id: 'salmon',
          name: 'Salmon',
          calories: 208, 
          protein: 20, 
          carbs: 0, 
          fat: 13, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Protein'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Eggs',
        nutrition: { 
          id: 'eggs',
          name: 'Eggs',
          calories: 155, 
          protein: 13, 
          carbs: 1.1, 
          fat: 11, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Protein'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Greek Yogurt',
        nutrition: { 
          id: 'greek-yogurt',
          name: 'Greek Yogurt',
          calories: 59, 
          protein: 10, 
          carbs: 3.6, 
          fat: 0.4, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Dairy'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Tofu',
        nutrition: { 
          id: 'tofu',
          name: 'Tofu',
          calories: 76, 
          protein: 8, 
          carbs: 1.9, 
          fat: 4.8, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Protein'
        },
        verified: true,
        source: 'database'
      },

      // Carbohydrates
      {
        name: 'Brown Rice',
        nutrition: { 
          id: 'brown-rice',
          name: 'Brown Rice',
          calories: 111, 
          protein: 2.6, 
          carbs: 23, 
          fat: 0.9, 
          fiber: 1.8, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Grains'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Quinoa',
        nutrition: { 
          id: 'quinoa',
          name: 'Quinoa',
          calories: 120, 
          protein: 4.4, 
          carbs: 22, 
          fat: 1.9, 
          fiber: 2.8, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Grains'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Sweet Potato',
        nutrition: { 
          id: 'sweet-potato',
          name: 'Sweet Potato',
          calories: 86, 
          protein: 1.6, 
          carbs: 20, 
          fat: 0.1, 
          fiber: 3, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Oats',
        nutrition: { 
          id: 'oats',
          name: 'Oats',
          calories: 389, 
          protein: 16.9, 
          carbs: 66, 
          fat: 6.9, 
          fiber: 10.6, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Grains'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Whole Wheat Bread',
        nutrition: { 
          id: 'whole-wheat-bread',
          name: 'Whole Wheat Bread',
          calories: 247, 
          protein: 13, 
          carbs: 41, 
          fat: 4.2, 
          fiber: 7, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Grains'
        },
        verified: true,
        source: 'database'
      },

      // Fruits
      {
        name: 'Apple',
        nutrition: { 
          id: 'apple',
          name: 'Apple',
          calories: 52, 
          protein: 0.3, 
          carbs: 14, 
          fat: 0.2, 
          fiber: 2.4, 
          sugar: 10, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Fruits'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Banana',
        nutrition: { 
          id: 'banana',
          name: 'Banana',
          calories: 89, 
          protein: 1.1, 
          carbs: 23, 
          fat: 0.3, 
          fiber: 2.6, 
          sugar: 12, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Fruits'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Blueberries',
        nutrition: { 
          id: 'blueberries',
          name: 'Blueberries',
          calories: 57, 
          protein: 0.7, 
          carbs: 14, 
          fat: 0.3, 
          fiber: 2.4, 
          sugar: 10, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Fruits'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Orange',
        nutrition: { 
          id: 'orange',
          name: 'Orange',
          calories: 47, 
          protein: 0.9, 
          carbs: 12, 
          fat: 0.1, 
          fiber: 2.4, 
          sugar: 9, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Fruits'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Avocado',
        nutrition: { 
          id: 'avocado',
          name: 'Avocado',
          calories: 160, 
          protein: 2, 
          carbs: 9, 
          fat: 15, 
          fiber: 7, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Fruits'
        },
        verified: true,
        source: 'database'
      },

      // Vegetables
      {
        name: 'Broccoli',
        nutrition: { 
          id: 'broccoli',
          name: 'Broccoli',
          calories: 34, 
          protein: 2.8, 
          carbs: 7, 
          fat: 0.4, 
          fiber: 2.6, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Spinach',
        nutrition: { 
          id: 'spinach',
          name: 'Spinach',
          calories: 23, 
          protein: 2.9, 
          carbs: 3.6, 
          fat: 0.4, 
          fiber: 2.2, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Carrots',
        nutrition: { 
          id: 'carrots',
          name: 'Carrots',
          calories: 41, 
          protein: 0.9, 
          carbs: 10, 
          fat: 0.2, 
          fiber: 2.8, 
          sugar: 4.7, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Bell Pepper',
        nutrition: { 
          id: 'bell-pepper',
          name: 'Bell Pepper',
          calories: 31, 
          protein: 1, 
          carbs: 7, 
          fat: 0.3, 
          fiber: 2.5, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Tomato',
        nutrition: { 
          id: 'tomato',
          name: 'Tomato',
          calories: 18, 
          protein: 0.9, 
          carbs: 3.9, 
          fat: 0.2, 
          fiber: 1.2, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Vegetables'
        },
        verified: true,
        source: 'database'
      },

      // Nuts and Seeds
      {
        name: 'Almonds',
        nutrition: { 
          id: 'almonds',
          name: 'Almonds',
          calories: 579, 
          protein: 21, 
          carbs: 22, 
          fat: 50, 
          fiber: 12, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Nuts & Seeds'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Walnuts',
        nutrition: { 
          id: 'walnuts',
          name: 'Walnuts',
          calories: 654, 
          protein: 15, 
          carbs: 14, 
          fat: 65, 
          fiber: 6.7, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Nuts & Seeds'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Chia Seeds',
        nutrition: { 
          id: 'chia-seeds',
          name: 'Chia Seeds',
          calories: 486, 
          protein: 17, 
          carbs: 42, 
          fat: 31, 
          fiber: 34, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Nuts & Seeds'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Peanut Butter',
        nutrition: { 
          id: 'peanut-butter',
          name: 'Peanut Butter',
          calories: 588, 
          protein: 25, 
          carbs: 20, 
          fat: 50, 
          fiber: 6, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Nuts & Seeds'
        },
        verified: true,
        source: 'database'
      },

      // Dairy
      {
        name: 'Milk',
        nutrition: { 
          id: 'milk',
          name: 'Milk',
          calories: 42, 
          protein: 3.4, 
          carbs: 5, 
          fat: 1, 
          servingSize: '100', 
          servingSizeUnit: 'ml',
          category: 'Dairy'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Cheddar Cheese',
        nutrition: { 
          id: 'cheddar-cheese',
          name: 'Cheddar Cheese',
          calories: 403, 
          protein: 25, 
          carbs: 1.3, 
          fat: 33, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Dairy'
        },
        verified: true,
        source: 'database'
      },
      {
        name: 'Cottage Cheese',
        nutrition: { 
          id: 'cottage-cheese',
          name: 'Cottage Cheese',
          calories: 98, 
          protein: 11, 
          carbs: 3.4, 
          fat: 4.3, 
          servingSize: '100', 
          servingSizeUnit: 'g',
          category: 'Dairy'
        },
        verified: true,
        source: 'database'
      }
    ]

    // Populate database
    commonFoods.forEach(food => {
      this.foodDatabase.set(food.name.toLowerCase(), food)
    })

    // Load saved custom foods from localStorage
    const savedFoods = localStorage.getItem('nutrition_custom_foods')
    if (savedFoods) {
      try {
        const customFoods: FoodItem[] = JSON.parse(savedFoods)
        customFoods.forEach(food => {
          this.foodDatabase.set(food.name.toLowerCase(), food)
        })
      } catch (error) {
        console.error('Error loading custom foods:', error)
      }
    }

    this.isInitialized = true
  }

  async searchFoods(query: string): Promise<SearchResult[]> {
    await this.initializeDatabase()

    // Check cache first
    const cacheKey = query.toLowerCase().trim()
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!
    }

    const results: SearchResult[] = []
    const queryWords = cacheKey.split(' ')

    // Search through database
    this.foodDatabase.forEach((food, key) => {
      let matchType: 'exact' | 'partial' | 'fuzzy' = 'fuzzy'
      let confidence = 0

      // Exact match
      if (key === cacheKey) {
        matchType = 'exact'
        confidence = 1.0
      }
      // Starts with query
      else if (key.startsWith(cacheKey)) {
        matchType = 'partial'
        confidence = 0.9
      }
      // Contains all query words
      else if (queryWords.every(word => key.includes(word))) {
        matchType = 'partial'
        confidence = 0.8
      }
      // Contains some query words
      else if (queryWords.some(word => key.includes(word))) {
        matchType = 'fuzzy'
        confidence = 0.6
      }
      // Brand or partial name match
      else if (food.brand && food.brand.toLowerCase().includes(cacheKey)) {
        matchType = 'fuzzy'
        confidence = 0.5
      }

      if (confidence > 0.4) {
        results.push({
          id: food.nutrition.id || key,
          name: food.name,
          category: food.nutrition.category || 'Other',
          calories: food.nutrition.calories,
          protein: food.nutrition.protein,
          carbs: food.nutrition.carbs,
          fat: food.nutrition.fat,
          fiber: food.nutrition.fiber,
          sugar: food.nutrition.sugar,
          sodium: food.nutrition.sodium,
          servingSize: food.nutrition.servingSize || '100g',
          servingSizeUnit: food.nutrition.servingSizeUnit || 'g',
          verified: food.verified,
          matchType,
          confidence
        })
      }
    })

    // Sort by confidence and match type
    results.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return (b.confidence || 0) - (a.confidence || 0)
      }
      const matchTypeOrder = { exact: 3, partial: 2, fuzzy: 1 }
      return (matchTypeOrder[b.matchType || 'fuzzy'] || 0) - (matchTypeOrder[a.matchType || 'fuzzy'] || 0)
    })

    // Cache results
    this.searchCache.set(cacheKey, results.slice(0, 20)) // Limit to top 20 results

    return results.slice(0, 20)
  }

  async getNutritionData(id: string): Promise<NutritionData | null> {
    await this.initializeDatabase()

    // Find by ID first
    for (const [key, food] of this.foodDatabase.entries()) {
      if (food.nutrition.id === id || key === id.toLowerCase()) {
        return food.nutrition
      }
    }

    return null
  }

  async getPopularFoods(): Promise<SearchResult[]> {
    await this.initializeDatabase()

    const popular = [
      'chicken breast', 'banana', 'brown rice', 'eggs', 'greek yogurt',
      'salmon', 'avocado', 'almonds', 'sweet potato', 'broccoli'
    ]

    return popular
      .map(name => {
        const food = this.foodDatabase.get(name)
        if (food) {
          return {
            id: food.nutrition.id || name,
            name: food.name,
            category: food.nutrition.category || 'Other',
            calories: food.nutrition.calories,
            protein: food.nutrition.protein,
            carbs: food.nutrition.carbs,
            fat: food.nutrition.fat,
            fiber: food.nutrition.fiber,
            sugar: food.nutrition.sugar,
            sodium: food.nutrition.sodium,
            servingSize: food.nutrition.servingSize || '100g',
            servingSizeUnit: food.nutrition.servingSizeUnit || 'g',
            verified: food.verified
          }
        }
        return null
      })
      .filter((food): food is SearchResult => food !== null)
  }

  async getFoodByBarcode(barcode: string): Promise<FoodItem | null> {
    await this.initializeDatabase()

    // Search for barcode in database
    for (const [key, food] of this.foodDatabase.entries()) {
      if (food.barcode === barcode) {
        return food
      }
    }

    // Try to fetch from external API (mock implementation)
    try {
      // In a real app, this would call an actual barcode API
      const mockProducts: { [key: string]: FoodItem } = {
        '123456789012': {
          name: 'Organic Whole Milk',
          brand: 'Organic Valley',
          barcode: '123456789012',
          nutrition: { 
            id: 'organic-milk',
            name: 'Organic Whole Milk',
            calories: 150, 
            protein: 8, 
            carbs: 12, 
            fat: 8, 
            servingSize: '240', 
            servingSizeUnit: 'ml',
            category: 'Dairy'
          },
          verified: true,
          source: 'api'
        },
        '987654321098': {
          name: 'Greek Yogurt Plain',
          brand: 'Fage',
          barcode: '987654321098',
          nutrition: { 
            id: 'fage-greek-yogurt',
            name: 'Greek Yogurt Plain',
            calories: 90, 
            protein: 15, 
            carbs: 6, 
            fat: 0, 
            servingSize: '170', 
            servingSizeUnit: 'g',
            category: 'Dairy'
          },
          verified: true,
          source: 'api'
        }
      }

      const product = mockProducts[barcode]
      if (product) {
        // Cache the product
        this.foodDatabase.set(product.name.toLowerCase(), product)
        this.saveCustomFood(product)
        return product
      }
    } catch (error) {
      console.error('Error fetching barcode data:', error)
    }

    return null
  }

  async addCustomFood(food: FoodItem): Promise<void> {
    await this.initializeDatabase()

    // Add to database
    this.foodDatabase.set(food.name.toLowerCase(), {
      ...food,
      source: 'user',
      verified: false
    })

    // Save to localStorage
    this.saveCustomFood(food)

    // Clear search cache
    this.searchCache.clear()
  }

  private saveCustomFood(food: FoodItem): void {
    const savedFoods = localStorage.getItem('nutrition_custom_foods')
    let customFoods: FoodItem[] = []

    if (savedFoods) {
      try {
        customFoods = JSON.parse(savedFoods)
      } catch (error) {
        console.error('Error parsing saved foods:', error)
      }
    }

    // Add or update food
    const existingIndex = customFoods.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase())
    if (existingIndex >= 0) {
      customFoods[existingIndex] = food
    } else {
      customFoods.push(food)
    }

    localStorage.setItem('nutrition_custom_foods', JSON.stringify(customFoods))
  }

  async getRecentSearches(): Promise<string[]> {
    const recent = localStorage.getItem('nutrition_recent_searches')
    if (recent) {
      try {
        return JSON.parse(recent)
      } catch (error) {
        console.error('Error parsing recent searches:', error)
      }
    }
    return []
  }

  saveRecentSearch(query: string): void {
    const recent = this.getRecentSearches()
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10)
    localStorage.setItem('nutrition_recent_searches', JSON.stringify(updated))
  }

  calculateNutritionForAmount(nutrition: NutritionData, amount: number, unit: string = 'g'): NutritionData {
    // Convert amount to grams if needed
    let amountInGrams = amount
    if (unit === 'oz') {
      amountInGrams = amount * 28.35
    } else if (unit === 'lb') {
      amountInGrams = amount * 453.592
    } else if (unit === 'ml' && nutrition.servingSizeUnit === 'ml') {
      amountInGrams = amount
    }

    // Calculate serving size in grams
    const servingSize = parseFloat(nutrition.servingSize || '100')
    const ratio = amountInGrams / servingSize

    return {
      ...nutrition,
      calories: Math.round(nutrition.calories * ratio),
      protein: Math.round(nutrition.protein * ratio * 10) / 10,
      carbs: Math.round(nutrition.carbs * ratio * 10) / 10,
      fat: Math.round(nutrition.fat * ratio * 10) / 10,
      fiber: nutrition.fiber ? Math.round(nutrition.fiber * ratio * 10) / 10 : undefined,
      sugar: nutrition.sugar ? Math.round(nutrition.sugar * ratio * 10) / 10 : undefined,
      sodium: nutrition.sodium ? Math.round(nutrition.sodium * ratio * 10) / 10 : undefined,
      servingSize: amountInGrams.toString(),
      servingSizeUnit: 'g'
    }
  }
}

// Create and export singleton instance
export const nutritionService = NutritionService.getInstance()

export default nutritionService
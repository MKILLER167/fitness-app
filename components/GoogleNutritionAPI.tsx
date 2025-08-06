"use client"

export interface NutritionData {
  name: string
  brand?: string
  calories: number
  servingSize: string
  servingUnit: string
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber?: number // grams
  sugar?: number // grams
  sodium?: number // mg
  image?: string
  barcode?: string
}

export interface SearchResult extends NutritionData {
  id: string
  description?: string
  confidence: number
}

class GoogleNutritionAPIService {
  private static readonly API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'
  private static readonly BASE_URL = 'https://www.googleapis.com/customsearch/v1'
  
  // Mock data for demonstration - replace with real API calls
  private static mockFoodDatabase: NutritionData[] = [
    {
      name: 'Apple',
      calories: 95,
      servingSize: '1',
      servingUnit: 'medium apple',
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19
    },
    {
      name: 'Banana',
      calories: 105,
      servingSize: '1',
      servingUnit: 'medium banana',
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14
    },
    {
      name: 'Chicken Breast',
      brand: 'Generic',
      calories: 165,
      servingSize: '100',
      servingUnit: 'grams',
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0
    },
    {
      name: 'Brown Rice',
      calories: 112,
      servingSize: '100',
      servingUnit: 'grams cooked',
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4
    },
    {
      name: 'Greek Yogurt',
      brand: 'Plain',
      calories: 100,
      servingSize: '170',
      servingUnit: 'grams',
      protein: 17,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sugar: 6
    },
    {
      name: 'Almonds',
      calories: 164,
      servingSize: '28',
      servingUnit: 'grams (24 nuts)',
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2
    },
    {
      name: 'Salmon',
      calories: 208,
      servingSize: '100',
      servingUnit: 'grams',
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0
    },
    {
      name: 'Avocado',
      calories: 160,
      servingSize: '100',
      servingUnit: 'grams',
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7
    },
    {
      name: 'Whole Wheat Bread',
      calories: 69,
      servingSize: '1',
      servingUnit: 'slice',
      protein: 3.6,
      carbs: 12,
      fat: 1.2,
      fiber: 1.9,
      sugar: 1.4
    },
    {
      name: 'Eggs',
      calories: 155,
      servingSize: '2',
      servingUnit: 'large eggs',
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1
    }
  ]

  static async searchFood(query: string): Promise<SearchResult[]> {
    try {
      // For demo purposes, we'll use the mock database
      // In production, replace this with actual Google Nutrition API calls
      
      const filteredResults = this.mockFoodDatabase
        .filter(food => 
          food.name.toLowerCase().includes(query.toLowerCase()) ||
          (food.brand && food.brand.toLowerCase().includes(query.toLowerCase()))
        )
        .map(food => ({
          ...food,
          id: `${food.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          confidence: this.calculateConfidence(food.name, query)
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return filteredResults
    } catch (error) {
      console.error('Error searching for food:', error)
      throw new Error('Failed to search for food items')
    }
  }

  static async getFoodByBarcode(barcode: string): Promise<NutritionData | null> {
    try {
      // Mock barcode lookup - replace with real API call
      const mockBarcodeData: { [key: string]: NutritionData } = {
        '1234567890': {
          name: 'Coca Cola',
          brand: 'Coca-Cola',
          calories: 140,
          servingSize: '355',
          servingUnit: 'ml can',
          protein: 0,
          carbs: 39,
          fat: 0,
          sugar: 39,
          barcode: '1234567890'
        }
      }

      await new Promise(resolve => setTimeout(resolve, 300))
      return mockBarcodeData[barcode] || null
    } catch (error) {
      console.error('Error looking up barcode:', error)
      return null
    }
  }

  static async getDetailedNutrition(foodId: string): Promise<NutritionData | null> {
    try {
      // In production, this would fetch detailed nutrition info from Google's API
      const food = this.mockFoodDatabase.find(f => 
        `${f.name.toLowerCase().replace(/\s+/g, '-')}` === foodId.split('-')[0]
      )
      
      if (food) {
        await new Promise(resolve => setTimeout(resolve, 200))
        return food
      }
      
      return null
    } catch (error) {
      console.error('Error getting detailed nutrition:', error)
      return null
    }
  }

  private static calculateConfidence(foodName: string, query: string): number {
    const food = foodName.toLowerCase()
    const search = query.toLowerCase()
    
    if (food === search) return 1.0
    if (food.startsWith(search)) return 0.9
    if (food.includes(search)) return 0.7
    
    // Calculate similarity based on word matches
    const foodWords = food.split(' ')
    const searchWords = search.split(' ')
    const matches = searchWords.filter(word => 
      foodWords.some(foodWord => foodWord.includes(word))
    ).length
    
    return matches / searchWords.length * 0.6
  }

  // Method to get nutrition recommendations based on goals
  static getNutritionRecommendations(goal: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'weight_loss': [
        'Focus on high-protein, low-calorie foods',
        'Include plenty of vegetables and fruits',
        'Choose lean proteins like chicken breast and fish',
        'Opt for whole grains over refined carbs'
      ],
      'muscle_gain': [
        'Increase protein intake to 1.6-2.2g per kg body weight',
        'Include complex carbohydrates for energy',
        'Add healthy fats like nuts and avocados',
        'Consider post-workout protein within 30 minutes'
      ],
      'maintenance': [
        'Maintain a balanced diet with all macronutrients',
        'Include a variety of colorful fruits and vegetables',
        'Stay hydrated with 8-10 glasses of water daily',
        'Practice portion control and mindful eating'
      ]
    }
    
    return recommendations[goal] || recommendations['maintenance']
  }
}

export default GoogleNutritionAPIService
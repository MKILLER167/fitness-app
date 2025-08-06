"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  Utensils, 
  Clock, 
  Target, 
  TrendingUp, 
  Apple, 
  Coffee,
  Star,
  ChefHat,
  Calendar,
  Download,
  Heart,
  Flame,
  Scale
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface Meal {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  prep_time: string
}

interface DietPlan {
  id: string
  name: string
  description: string
  total_calories: number
  target_audience: string[]
  benefits: string[]
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal[]
  }
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

interface DietPlansProps {
  userProfile?: UserProfile
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
}

export function DietPlans({ userProfile, onXPGain, subscriptionTier = 'free', onPremiumFeatureAccess }: DietPlansProps) {
  const [selectedCalorieRange, setSelectedCalorieRange] = useState<number>(2000)
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null)

  const dietPlans: Record<number, DietPlan[]> = {
    1000: [
      {
        id: '1000_plan_1',
        name: 'Quick Weight Loss',
        description: 'High protein, low carb plan for rapid weight loss',
        total_calories: 1000,
        target_audience: ['Weight Loss', 'Sedentary Lifestyle'],
        benefits: ['Rapid weight loss', 'Reduces appetite', 'Preserves muscle mass'],
        meals: {
          breakfast: {
            name: 'Protein Scramble',
            calories: 250,
            protein: 25,
            carbs: 5,
            fat: 12,
            ingredients: ['2 eggs', '30g spinach', '1 tbsp olive oil', '50g mushrooms'],
            prep_time: '10 min'
          },
          lunch: {
            name: 'Grilled Chicken Salad',
            calories: 300,
            protein: 35,
            carbs: 10,
            fat: 8,
            ingredients: ['100g chicken breast', '2 cups mixed greens', '1 tbsp olive oil', 'cucumber', 'tomatoes'],
            prep_time: '15 min'
          },
          dinner: {
            name: 'Baked Fish & Vegetables',
            calories: 350,
            protein: 30,
            carbs: 15,
            fat: 10,
            ingredients: ['120g white fish', '200g broccoli', '100g asparagus', '1 tbsp olive oil'],
            prep_time: '25 min'
          },
          snacks: [
            {
              name: 'Greek Yogurt',
              calories: 100,
              protein: 15,
              carbs: 8,
              fat: 0,
              ingredients: ['150g non-fat Greek yogurt', 'cinnamon'],
              prep_time: '2 min'
            }
          ]
        },
        macros: { protein: 45, carbs: 20, fat: 35 }
      },
      {
        id: '1000_plan_2',
        name: 'Balanced Deficit',
        description: 'Balanced approach with all food groups',
        total_calories: 1000,
        target_audience: ['Weight Loss', 'Beginners'],
        benefits: ['Sustainable approach', 'Includes all nutrients', 'Easy to follow'],
        meals: {
          breakfast: {
            name: 'Oatmeal Bowl',
            calories: 230,
            protein: 12,
            carbs: 35,
            fat: 6,
            ingredients: ['40g oats', '200ml almond milk', '1 tbsp almond butter', 'berries'],
            prep_time: '8 min'
          },
          lunch: {
            name: 'Turkey Wrap',
            calories: 320,
            protein: 25,
            carbs: 30,
            fat: 8,
            ingredients: ['1 whole wheat tortilla', '80g turkey breast', 'lettuce', 'tomato', '1 tbsp hummus'],
            prep_time: '10 min'
          },
          dinner: {
            name: 'Lean Beef Stir-fry',
            calories: 350,
            protein: 28,
            carbs: 25,
            fat: 12,
            ingredients: ['80g lean beef', '150g mixed vegetables', '50g brown rice', '1 tsp sesame oil'],
            prep_time: '20 min'
          },
          snacks: [
            {
              name: 'Apple & Almonds',
              calories: 100,
              protein: 3,
              carbs: 18,
              fat: 4,
              ingredients: ['1 medium apple', '10g almonds'],
              prep_time: '1 min'
            }
          ]
        },
        macros: { protein: 30, carbs: 45, fat: 25 }
      }
    ],
    1500: [
      {
        id: '1500_plan_1',
        name: 'Active Weight Loss',
        description: 'For those who exercise while losing weight',
        total_calories: 1500,
        target_audience: ['Weight Loss', 'Light Exercise'],
        benefits: ['Supports workout recovery', 'Steady weight loss', 'Maintains energy'],
        meals: {
          breakfast: {
            name: 'Protein Pancakes',
            calories: 350,
            protein: 25,
            carbs: 35,
            fat: 12,
            ingredients: ['40g oats', '1 scoop protein powder', '1 egg', '1 banana', '1 tsp coconut oil'],
            prep_time: '12 min'
          },
          lunch: {
            name: 'Quinoa Power Bowl',
            calories: 450,
            protein: 25,
            carbs: 45,
            fat: 15,
            ingredients: ['80g cooked quinoa', '100g grilled chicken', 'avocado', 'black beans', 'salsa'],
            prep_time: '15 min'
          },
          dinner: {
            name: 'Salmon & Sweet Potato',
            calories: 500,
            protein: 35,
            carbs: 35,
            fat: 18,
            ingredients: ['120g salmon', '150g baked sweet potato', '100g green beans', '1 tbsp olive oil'],
            prep_time: '30 min'
          },
          snacks: [
            {
              name: 'Protein Smoothie',
              calories: 200,
              protein: 20,
              carbs: 15,
              fat: 5,
              ingredients: ['1 scoop protein powder', '1 cup almond milk', '1/2 banana', 'spinach'],
              prep_time: '5 min'
            }
          ]
        },
        macros: { protein: 35, carbs: 40, fat: 25 }
      },
      {
        id: '1500_plan_2',
        name: 'Mediterranean Style',
        description: 'Heart-healthy Mediterranean approach',
        total_calories: 1500,
        target_audience: ['Heart Health', 'Weight Loss'],
        benefits: ['Heart healthy', 'Anti-inflammatory', 'Rich in antioxidants'],
        meals: {
          breakfast: {
            name: 'Greek Yogurt Parfait',
            calories: 300,
            protein: 20,
            carbs: 30,
            fat: 10,
            ingredients: ['200g Greek yogurt', 'mixed berries', '20g walnuts', 'honey'],
            prep_time: '5 min'
          },
          lunch: {
            name: 'Mediterranean Salad',
            calories: 450,
            protein: 18,
            carbs: 35,
            fat: 22,
            ingredients: ['mixed greens', 'cherry tomatoes', 'cucumber', 'feta cheese', 'olives', 'olive oil'],
            prep_time: '10 min'
          },
          dinner: {
            name: 'Herb Crusted Cod',
            calories: 400,
            protein: 30,
            carbs: 25,
            fat: 18,
            ingredients: ['120g cod', 'herbs', '100g roasted vegetables', '60g brown rice'],
            prep_time: '25 min'
          },
          snacks: [
            {
              name: 'Hummus & Vegetables',
              calories: 150,
              protein: 6,
              carbs: 15,
              fat: 8,
              ingredients: ['3 tbsp hummus', 'carrot sticks', 'cucumber', 'bell peppers'],
              prep_time: '3 min'
            },
            {
              name: 'Mixed Nuts',
              calories: 200,
              protein: 6,
              carbs: 8,
              fat: 16,
              ingredients: ['25g mixed nuts'],
              prep_time: '1 min'
            }
          ]
        },
        macros: { protein: 25, carbs: 35, fat: 40 }
      }
    ],
    2000: [
      {
        id: '2000_plan_1',
        name: 'Balanced Maintenance',
        description: 'Perfect for maintaining current weight',
        total_calories: 2000,
        target_audience: ['Maintenance', 'Moderate Exercise'],
        benefits: ['Weight maintenance', 'Balanced nutrition', 'Sustainable long-term'],
        meals: {
          breakfast: {
            name: 'Avocado Toast & Eggs',
            calories: 450,
            protein: 20,
            carbs: 35,
            fat: 22,
            ingredients: ['2 slices whole grain bread', '1/2 avocado', '2 eggs', 'tomato', 'everything seasoning'],
            prep_time: '10 min'
          },
          lunch: {
            name: 'Chicken Buddha Bowl',
            calories: 550,
            protein: 35,
            carbs: 45,
            fat: 20,
            ingredients: ['100g grilled chicken', '80g brown rice', 'roasted vegetables', 'tahini dressing'],
            prep_time: '20 min'
          },
          dinner: {
            name: 'Beef Stir Fry',
            calories: 600,
            protein: 40,
            carbs: 50,
            fat: 22,
            ingredients: ['120g lean beef', '100g jasmine rice', 'mixed vegetables', 'teriyaki sauce'],
            prep_time: '25 min'
          },
          snacks: [
            {
              name: 'Trail Mix',
              calories: 200,
              protein: 8,
              carbs: 20,
              fat: 12,
              ingredients: ['nuts', 'dried fruit', 'dark chocolate chips'],
              prep_time: '1 min'
            },
            {
              name: 'Cottage Cheese Bowl',
              calories: 200,
              protein: 25,
              carbs: 10,
              fat: 5,
              ingredients: ['200g cottage cheese', 'berries', 'honey'],
              prep_time: '3 min'
            }
          ]
        },
        macros: { protein: 30, carbs: 40, fat: 30 }
      },
      {
        id: '2000_plan_2',
        name: 'Active Lifestyle',
        description: 'For those with regular exercise routine',
        total_calories: 2000,
        target_audience: ['Regular Exercise', 'Athletes'],
        benefits: ['Supports recovery', 'Optimizes performance', 'Maintains muscle mass'],
        meals: {
          breakfast: {
            name: 'Power Smoothie Bowl',
            calories: 400,
            protein: 25,
            carbs: 45,
            fat: 15,
            ingredients: ['protein powder', 'banana', 'berries', 'granola', 'almond butter'],
            prep_time: '8 min'
          },
          lunch: {
            name: 'Turkey & Quinoa Salad',
            calories: 500,
            protein: 30,
            carbs: 40,
            fat: 18,
            ingredients: ['100g turkey breast', '80g quinoa', 'mixed greens', 'avocado', 'olive oil dressing'],
            prep_time: '15 min'
          },
          dinner: {
            name: 'Grilled Chicken Pasta',
            calories: 650,
            protein: 45,
            carbs: 60,
            fat: 20,
            ingredients: ['120g chicken breast', '100g whole wheat pasta', 'vegetables', 'pesto sauce'],
            prep_time: '30 min'
          },
          snacks: [
            {
              name: 'Protein Bar',
              calories: 250,
              protein: 20,
              carbs: 25,
              fat: 8,
              ingredients: ['1 protein bar'],
              prep_time: '1 min'
            },
            {
              name: 'Banana & Peanut Butter',
              calories: 200,
              protein: 8,
              carbs: 30,
              fat: 8,
              ingredients: ['1 large banana', '2 tbsp peanut butter'],
              prep_time: '2 min'
            }
          ]
        },
        macros: { protein: 32, carbs: 42, fat: 26 }
      }
    ],
    2500: [
      {
        id: '2500_plan_1',
        name: 'Lean Muscle Gain',
        description: 'Build muscle while staying lean',
        total_calories: 2500,
        target_audience: ['Muscle Building', 'Strength Training'],
        benefits: ['Lean muscle growth', 'Enhanced recovery', 'Improved strength'],
        meals: {
          breakfast: {
            name: 'Muscle Building Breakfast',
            calories: 550,
            protein: 35,
            carbs: 45,
            fat: 20,
            ingredients: ['3 eggs', '80g oats', '1 banana', '30g protein powder', '1 tbsp almond butter'],
            prep_time: '15 min'
          },
          lunch: {
            name: 'Power Packed Wrap',
            calories: 650,
            protein: 40,
            carbs: 50,
            fat: 25,
            ingredients: ['large tortilla', '120g chicken breast', 'rice', 'beans', 'avocado', 'salsa'],
            prep_time: '20 min'
          },
          dinner: {
            name: 'Steak & Potatoes',
            calories: 750,
            protein: 50,
            carbs: 55,
            fat: 28,
            ingredients: ['150g lean steak', '200g sweet potato', 'asparagus', '1 tbsp olive oil'],
            prep_time: '35 min'
          },
          snacks: [
            {
              name: 'Post-Workout Shake',
              calories: 300,
              protein: 30,
              carbs: 35,
              fat: 5,
              ingredients: ['protein powder', 'banana', 'milk', 'berries'],
              prep_time: '5 min'
            },
            {
              name: 'Overnight Oats',
              calories: 250,
              protein: 15,
              carbs: 30,
              fat: 8,
              ingredients: ['oats', 'Greek yogurt', 'chia seeds', 'honey'],
              prep_time: '5 min (prep night before)'
            }
          ]
        },
        macros: { protein: 34, carbs: 43, fat: 23 }
      },
      {
        id: '2500_plan_2',
        name: 'Performance Focused',
        description: 'Optimized for athletic performance',
        total_calories: 2500,
        target_audience: ['Athletes', 'High Intensity Training'],
        benefits: ['Peak performance', 'Quick recovery', 'Sustained energy'],
        meals: {
          breakfast: {
            name: 'Athletes Breakfast',
            calories: 500,
            protein: 30,
            carbs: 50,
            fat: 18,
            ingredients: ['2 whole eggs + 2 whites', 'whole grain toast', 'avocado', 'berries'],
            prep_time: '12 min'
          },
          lunch: {
            name: 'Recovery Bowl',
            calories: 600,
            protein: 35,
            carbs: 55,
            fat: 20,
            ingredients: ['salmon', 'quinoa', 'sweet potato', 'broccoli', 'olive oil'],
            prep_time: '25 min'
          },
          dinner: {
            name: 'High Protein Pasta',
            calories: 800,
            protein: 45,
            carbs: 75,
            fat: 25,
            ingredients: ['lean ground turkey', 'whole wheat pasta', 'marinara sauce', 'vegetables'],
            prep_time: '30 min'
          },
          snacks: [
            {
              name: 'Energy Balls',
              calories: 300,
              protein: 12,
              carbs: 35,
              fat: 15,
              ingredients: ['dates', 'nuts', 'protein powder', 'coconut'],
              prep_time: '10 min (make batch)'
            },
            {
              name: 'Greek Yogurt Parfait',
              calories: 300,
              protein: 25,
              carbs: 30,
              fat: 8,
              ingredients: ['Greek yogurt', 'granola', 'berries', 'honey'],
              prep_time: '5 min'
            }
          ]
        },
        macros: { protein: 29, carbs: 48, fat: 23 }
      }
    ],
    3000: [
      {
        id: '3000_plan_1',
        name: 'Serious Muscle Building',
        description: 'Heavy lifting and serious gains',
        total_calories: 3000,
        target_audience: ['Bodybuilding', 'Heavy Training'],
        benefits: ['Maximum muscle growth', 'Strength gains', 'Enhanced recovery'],
        meals: {
          breakfast: {
            name: 'Bulking Breakfast',
            calories: 700,
            protein: 40,
            carbs: 60,
            fat: 25,
            ingredients: ['4 eggs', '100g oats', '2 slices toast', 'peanut butter', 'banana'],
            prep_time: '20 min'
          },
          lunch: {
            name: 'Double Protein Bowl',
            calories: 800,
            protein: 55,
            carbs: 65,
            fat: 28,
            ingredients: ['150g chicken breast', '100g rice', 'beans', 'avocado', 'nuts'],
            prep_time: '25 min'
          },
          dinner: {
            name: 'Mass Gainer Meal',
            calories: 900,
            protein: 60,
            carbs: 80,
            fat: 35,
            ingredients: ['200g lean beef', 'large sweet potato', 'quinoa', 'vegetables', 'olive oil'],
            prep_time: '40 min'
          },
          snacks: [
            {
              name: 'Mass Gainer Shake',
              calories: 400,
              protein: 35,
              carbs: 40,
              fat: 12,
              ingredients: ['2 scoops protein powder', 'milk', 'banana', 'oats', 'peanut butter'],
              prep_time: '5 min'
            },
            {
              name: 'Nut Butter Sandwich',
              calories: 200,
              protein: 8,
              carbs: 25,
              fat: 10,
              ingredients: ['whole grain bread', 'almond butter', 'honey'],
              prep_time: '3 min'
            }
          ]
        },
        macros: { protein: 33, carbs: 45, fat: 22 }
      },
      {
        id: '3000_plan_2',
        name: 'Clean Bulk',
        description: 'Gain muscle with minimal fat gain',
        total_calories: 3000,
        target_audience: ['Clean Bulking', 'Lean Gains'],
        benefits: ['Quality muscle gain', 'Minimal fat gain', 'Better body composition'],
        meals: {
          breakfast: {
            name: 'Clean Bulk Breakfast',
            calories: 650,
            protein: 35,
            carbs: 55,
            fat: 22,
            ingredients: ['egg whites + 1 whole egg', 'oatmeal', 'berries', 'almonds', 'Greek yogurt'],
            prep_time: '18 min'
          },
          lunch: {
            name: 'Lean Protein Plate',
            calories: 750,
            protein: 50,
            carbs: 60,
            fat: 25,
            ingredients: ['150g turkey breast', '100g brown rice', 'vegetables', 'avocado'],
            prep_time: '25 min'
          },
          dinner: {
            name: 'Clean Dinner',
            calories: 850,
            protein: 55,
            carbs: 70,
            fat: 30,
            ingredients: ['180g white fish', 'quinoa', 'sweet potato', 'green vegetables', 'nuts'],
            prep_time: '35 min'
          },
          snacks: [
            {
              name: 'Protein Smoothie',
              calories: 350,
              protein: 30,
              carbs: 35,
              fat: 8,
              ingredients: ['protein powder', 'fruits', 'spinach', 'almond milk'],
              prep_time: '5 min'
            },
            {
              name: 'Rice Cakes & Protein',
              calories: 400,
              protein: 25,
              carbs: 40,
              fat: 12,
              ingredients: ['rice cakes', 'cottage cheese', 'berries', 'nuts'],
              prep_time: '5 min'
            }
          ]
        },
        macros: { protein: 33, carbs: 43, fat: 24 }
      }
    ],
    3500: [
      {
        id: '3500_plan_1',
        name: 'Elite Athlete',
        description: 'For elite athletes and heavy trainers',
        total_calories: 3500,
        target_audience: ['Elite Athletes', 'Multiple Daily Training'],
        benefits: ['Peak performance support', 'Rapid recovery', 'Sustained energy'],
        meals: {
          breakfast: {
            name: 'Champion\'s Breakfast',
            calories: 800,
            protein: 45,
            carbs: 70,
            fat: 30,
            ingredients: ['5 eggs', '120g oats', 'banana', 'berries', 'nuts', 'milk'],
            prep_time: '25 min'
          },
          lunch: {
            name: 'Performance Lunch',
            calories: 900,
            protein: 60,
            carbs: 80,
            fat: 35,
            ingredients: ['200g chicken breast', '150g rice', 'vegetables', 'avocado', 'olive oil'],
            prep_time: '30 min'
          },
          dinner: {
            name: 'Recovery Dinner',
            calories: 1000,
            protein: 70,
            carbs: 90,
            fat: 40,
            ingredients: ['250g salmon', 'large sweet potato', 'quinoa', 'vegetables', 'nuts'],
            prep_time: '45 min'
          },
          snacks: [
            {
              name: 'Pre-Workout Fuel',
              calories: 400,
              protein: 25,
              carbs: 50,
              fat: 10,
              ingredients: ['protein powder', 'banana', 'oats', 'honey'],
              prep_time: '5 min'
            },
            {
              name: 'Post-Workout Recovery',
              calories: 400,
              protein: 35,
              carbs: 40,
              fat: 12,
              ingredients: ['protein powder', 'chocolate milk', 'berries'],
              prep_time: '5 min'
            }
          ]
        },
        macros: { protein: 28, carbs: 48, fat: 24 }
      },
      {
        id: '3500_plan_2',
        name: 'Mass Building',
        description: 'Maximum muscle and weight gain',
        total_calories: 3500,
        target_audience: ['Hardgainers', 'Extreme Bulking'],
        benefits: ['Rapid weight gain', 'Maximum muscle growth', 'Strength increases'],
        meals: {
          breakfast: {
            name: 'Mass Building Breakfast',
            calories: 750,
            protein: 40,
            carbs: 65,
            fat: 28,
            ingredients: ['4 whole eggs', '100g oats', 'toast', 'peanut butter', 'milk'],
            prep_time: '20 min'
          },
          lunch: {
            name: 'Massive Meal',
            calories: 950,
            protein: 65,
            carbs: 85,
            fat: 38,
            ingredients: ['200g beef', '150g pasta', 'cheese', 'vegetables', 'olive oil'],
            prep_time: '35 min'
          },
          dinner: {
            name: 'Giant Dinner',
            calories: 1100,
            protein: 75,
            carbs: 100,
            fat: 45,
            ingredients: ['250g chicken', 'large potato', 'rice', 'vegetables', 'butter'],
            prep_time: '50 min'
          },
          snacks: [
            {
              name: 'Calorie Dense Shake',
              calories: 500,
              protein: 40,
              carbs: 50,
              fat: 20,
              ingredients: ['2 scoops protein', 'whole milk', 'banana', 'peanut butter', 'oats'],
              prep_time: '5 min'
            },
            {
              name: 'Trail Mix Extreme',
              calories: 200,
              protein: 8,
              carbs: 20,
              fat: 12,
              ingredients: ['mixed nuts', 'dried fruits', 'chocolate'],
              prep_time: '1 min'
            }
          ]
        },
        macros: { protein: 30, carbs: 45, fat: 25 }
      }
    ],
    4000: [
      {
        id: '4000_plan_1',
        name: 'Extreme Athlete',
        description: 'For extreme athletes and endurance sports',
        total_calories: 4000,
        target_audience: ['Endurance Athletes', 'Multiple Training Sessions'],
        benefits: ['Extreme performance support', 'Endurance optimization', 'Quick energy replenishment'],
        meals: {
          breakfast: {
            name: 'Endurance Breakfast',
            calories: 900,
            protein: 50,
            carbs: 80,
            fat: 35,
            ingredients: ['6 eggs', '150g oats', 'banana', 'berries', 'nuts', 'honey'],
            prep_time: '30 min'
          },
          lunch: {
            name: 'Midday Fuel',
            calories: 1100,
            protein: 70,
            carbs: 100,
            fat: 45,
            ingredients: ['250g chicken', '200g rice', 'vegetables', 'avocado', 'olive oil'],
            prep_time: '40 min'
          },
          dinner: {
            name: 'Recovery Feast',
            calories: 1200,
            protein: 80,
            carbs: 110,
            fat: 50,
            ingredients: ['300g lean beef', 'large sweet potato', 'pasta', 'vegetables', 'nuts'],
            prep_time: '60 min'
          },
          snacks: [
            {
              name: 'Energy Powerhouse',
              calories: 500,
              protein: 35,
              carbs: 55,
              fat: 18,
              ingredients: ['protein powder', 'banana', 'dates', 'almond butter', 'milk'],
              prep_time: '8 min'
            },
            {
              name: 'Quick Energy',
              calories: 300,
              protein: 15,
              carbs: 40,
              fat: 10,
              ingredients: ['energy bar', 'sports drink', 'banana'],
              prep_time: '2 min'
            }
          ]
        },
        macros: { protein: 25, carbs: 48, fat: 27 }
      },
      {
        id: '4000_plan_2',
        name: 'Powerlifter\'s Diet',
        description: 'For serious powerlifters and strength athletes',
        total_calories: 4000,
        target_audience: ['Powerlifters', 'Strongman Athletes'],
        benefits: ['Maximum strength gains', 'Heavy lifting support', 'Muscle mass increase'],
        meals: {
          breakfast: {
            name: 'Powerlifter\'s Start',
            calories: 850,
            protein: 45,
            carbs: 75,
            fat: 32,
            ingredients: ['5 whole eggs', '120g oats', 'toast', 'butter', 'orange juice'],
            prep_time: '25 min'
          },
          lunch: {
            name: 'Strength Lunch',
            calories: 1050,
            protein: 65,
            carbs: 95,
            fat: 42,
            ingredients: ['200g ground beef', '180g rice', 'bread', 'cheese', 'vegetables'],
            prep_time: '35 min'
          },
          dinner: {
            name: 'Power Dinner',
            calories: 1300,
            protein: 85,
            carbs: 120,
            fat: 55,
            ingredients: ['300g steak', 'large potato', 'bread', 'vegetables', 'butter'],
            prep_time: '55 min'
          },
          snacks: [
            {
              name: 'Strength Shake',
              calories: 500,
              protein: 40,
              carbs: 50,
              fat: 20,
              ingredients: ['2 scoops protein', 'whole milk', 'banana', 'peanut butter'],
              prep_time: '5 min'
            },
            {
              name: 'Power Snack',
              calories: 300,
              protein: 12,
              carbs: 35,
              fat: 15,
              ingredients: ['whole grain bagel', 'cream cheese', 'nuts'],
              prep_time: '3 min'
            }
          ]
        },
        macros: { protein: 31, carbs: 47, fat: 22 }
      }
    ]
  }

  const calorieRanges = [1000, 1500, 2000, 2500, 3000, 3500, 4000]

  const renderMealDetails = (meal: Meal) => (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{meal.name}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{meal.calories} cal</Badge>
          <Badge variant="outline" className="text-xs">
            <Clock size={12} className="mr-1" />
            {meal.prep_time}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="font-medium">{meal.protein}g</div>
          <div className="text-xs text-muted-foreground">Protein</div>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="font-medium">{meal.carbs}g</div>
          <div className="text-xs text-muted-foreground">Carbs</div>
        </div>
        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
          <div className="font-medium">{meal.fat}g</div>
          <div className="text-xs text-muted-foreground">Fat</div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Ingredients:</p>
        <div className="text-xs text-muted-foreground space-y-1">
          {meal.ingredients.map((ingredient, idx) => (
            <div key={idx}>• {ingredient}</div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Standard Diet Plans 🍽️</h1>
        <p className="text-muted-foreground">Professionally designed meal plans for every goal</p>
      </div>

      {/* Calorie Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" size={20} />
            Select Your Calorie Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {calorieRanges.map((calories) => (
              <Button
                key={calories}
                variant={selectedCalorieRange === calories ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedCalorieRange(calories)
                  setSelectedPlan(null)
                }}
                className="text-xs"
              >
                {calories}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diet Plans for Selected Calorie Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dietPlans[selectedCalorieRange]?.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="text-orange-500" size={20} />
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  {plan.total_calories} cal
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target Audience */}
              <div>
                <h4 className="font-medium mb-2">Perfect For:</h4>
                <div className="flex flex-wrap gap-1">
                  {plan.target_audience.map((audience, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-medium mb-2">Benefits:</h4>
                <div className="space-y-1">
                  {plan.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Star className="text-yellow-500" size={12} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Macro Breakdown */}
              <div>
                <h4 className="font-medium mb-2">Macro Split:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-medium">{plan.macros.protein}%</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-medium">{plan.macros.carbs}%</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <div className="font-medium">{plan.macros.fat}%</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setSelectedPlan(plan)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Heart size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Plan View */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="text-green-500" size={20} />
                {selectedPlan.name} - Detailed Meal Plan
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Breakfast */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Coffee className="text-amber-600" size={16} />
                Breakfast
              </h3>
              {renderMealDetails(selectedPlan.meals.breakfast)}
            </div>

            {/* Lunch */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Apple className="text-red-600" size={16} />
                Lunch
              </h3>
              {renderMealDetails(selectedPlan.meals.lunch)}
            </div>

            {/* Dinner */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Utensils className="text-purple-600" size={16} />
                Dinner
              </h3>
              {renderMealDetails(selectedPlan.meals.dinner)}
            </div>

            {/* Snacks */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Scale className="text-pink-600" size={16} />
                Snacks
              </h3>
              <div className="grid gap-3">
                {selectedPlan.meals.snacks.map((snack, idx) => (
                  <div key={idx}>
                    {renderMealDetails(snack)}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Calendar size={16} className="mr-2" />
                Add to Meal Planner
              </Button>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Heart size={16} className="mr-2" />
                Save to Favorites
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
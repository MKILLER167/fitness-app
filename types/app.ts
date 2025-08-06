export type AppState = 'login' | 'onboarding' | 'app' | 'subscription'

export type SubscriptionTier = 'free' | 'premium' | 'pro'

export interface UserProfile {
  name?: string
  email?: string
  age?: number
  height?: number
  weight?: number
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
  calorieTarget?: number
  targetCalories?: number
  language?: 'en' | 'ar'
  fitnessLevel?: string
}

export interface User {
  email: string
  isOnboarded: boolean
  profile?: UserProfile
  authMethod?: 'email' | 'google' | 'guest'
  displayName?: string
  isGuest?: boolean
  subscriptionTier?: SubscriptionTier
  subscriptionExpiry?: string
}

export interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

export const NAVIGATION_MESSAGES = {
  'workouts': { en: 'Opening Workout Hub', ar: 'فتح مركز التمارين' },
  'diet-plans': { en: 'Opening Diet Plans', ar: 'فتح خطط الحمية' },
  'workout-splits': { en: 'Opening Workout Splits', ar: 'فتح تقسيمات التمرين' },
  'strength': { en: 'Opening Strength Training', ar: 'فتح تدريب القوة' },
  'compare': { en: 'Opening Progress Compare', ar: 'فتح مقارنة التقدم' },
  'social': { en: 'Opening Social Hub', ar: 'فتح المجتمع' },
  'achievements': { en: 'Opening Achievements', ar: 'فتح الإنجازات' },
  'stats': { en: 'Opening Fitness Stats', ar: 'فتح الإحصائيات' },
  'guide': { en: 'Opening Fitness Guide', ar: 'فتح الدليل' }
} as const

export const STORAGE_KEYS = {
  USER: 'fittracker_user',
  USER_STATS: 'fittracker_user_stats',
  DARK_MODE: 'darkMode'
} as const
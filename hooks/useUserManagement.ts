import { useState, useCallback } from 'react'
import { toast } from 'sonner@2.0.3'
import { STORAGE_KEYS } from '../types/app'

interface User {
  id: string
  email: string
  profile?: UserProfile
  subscriptionTier: 'free' | 'premium' | 'pro'
  isOnboarded: boolean
  isGuest: boolean
  createdAt: Date
  lastLoginAt: Date
  preferences: UserPreferences
}

interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number
  weight: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle'
  calorieTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
}

interface UserPreferences {
  language: 'en' | 'ar'
  darkMode: boolean
  notifications: boolean
  units: 'metric' | 'imperial'
  privacy: {
    shareProgress: boolean
    allowAnalytics: boolean
  }
}

export function useUserManagement() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = useCallback((email: string, password: string, isGoogleAuth: boolean = false, isGuest: boolean = false) => {
    const userData: User = {
      id: isGuest ? 'guest_' + Date.now() : 'user_' + Date.now(),
      email: isGuest ? 'guest@fittracker.com' : email,
      subscriptionTier: 'free',
      isOnboarded: false,
      isGuest,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        language: 'en',
        darkMode: false,
        notifications: true,
        units: 'metric',
        privacy: {
          shareProgress: false,
          allowAnalytics: true
        }
      }
    }
    
    setUser(userData)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
    
    // Show welcome toast with proper styling
    toast.success('Welcome!', {
      description: isGuest 
        ? 'Continue as guest - you can create an account later'
        : 'Successfully signed in to FitTracker',
      duration: 4000,
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '2px solid var(--primary)',
        fontWeight: '500'
      }
    })
    
    return userData
  }, [])

  const handleOnboardingComplete = useCallback((profile: UserProfile, handleXPGain: (amount: number, reason: string) => void) => {
    if (!user) return null

    const updatedUser: User = {
      ...user,
      profile,
      isOnboarded: true
    }

    setUser(updatedUser)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
    
    // Award XP for completing onboarding
    handleXPGain(100, 'Completing profile setup')
    
    // Show welcome aboard toast with custom styling
    setTimeout(() => {
      toast.success('🎉 Welcome Aboard!', {
        description: `Welcome to FitTracker, ${profile.name}! Your fitness journey starts now.`,
        className: 'subscription-toast',
        duration: 6000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '2px solid var(--primary)',
          fontWeight: '600',
          fontSize: '15px'
        }
      })
    }, 1000)
    
    return updatedUser
  }, [user])

  const handleLogout = useCallback(() => {
    setUser(null)
    
    // Clear user data from localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Error clearing user data:', error)
    }
    
    // Show goodbye toast
    toast.success('Goodbye!', {
      description: 'You\'ve been signed out. See you soon!',
      duration: 3000,
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '2px solid var(--border)',
        fontWeight: '500'
      }
    })
  }, [])

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!user?.profile) return null

    const updatedUser: User = {
      ...user,
      profile: { ...user.profile, ...updates }
    }

    setUser(updatedUser)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
    
    // Show profile update toast
    toast.success('Profile Updated', {
      description: 'Your profile has been successfully updated.',
      duration: 3000,
      style: {
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '2px solid var(--primary)',
        fontWeight: '500'
      }
    })
    
    return updatedUser
  }, [user])

  const updateUserSubscription = useCallback((tier: 'free' | 'premium' | 'pro') => {
    if (!user) return null

    const updatedUser: User = {
      ...user,
      subscriptionTier: tier
    }

    setUser(updatedUser)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
    
    return updatedUser
  }, [user])

  const updateUserPreferences = useCallback((updates: Partial<UserPreferences>) => {
    if (!user) return null

    const updatedUser: User = {
      ...user,
      preferences: { ...user.preferences, ...updates }
    }

    setUser(updatedUser)
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error saving user data:', error)
    }
    
    return updatedUser
  }, [user])

  const loadUserFromStorage = useCallback(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLoginAt: new Date(userData.lastLoginAt)
        })
        return userData
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
    return null
  }, [])

  const getUserMembershipDuration = useCallback(() => {
    if (!user) return null
    
    const createdDate = new Date(user.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `Member since ${createdDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''} member`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} year${years > 1 ? 's' : ''} member`
    }
  }, [user])

  return {
    user,
    handleLogin,
    handleOnboardingComplete,
    handleLogout,
    updateUserProfile,
    updateUserSubscription,
    updateUserPreferences,
    loadUserFromStorage,
    getUserMembershipDuration
  }
}
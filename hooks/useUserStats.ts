import { useState, useCallback } from 'react'
import { toast } from 'sonner@2.0.3'
import { STORAGE_KEYS } from '../types/app'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
  streak: number
  weeklyGoal: number
  weeklyProgress: number
  totalCaloriesTracked: number
  totalWorkouts: number
  averageSessionTime: number
  lastActivityDate: Date
}

export function useUserStats() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)

  const defaultStats: UserStats = {
    totalXP: 0,
    level: 1,
    achievements: 0,
    workoutsCompleted: 0,
    tiersUnlocked: 2,
    streak: 0,
    weeklyGoal: 5,
    weeklyProgress: 0,
    totalCaloriesTracked: 0,
    totalWorkouts: 0,
    averageSessionTime: 0,
    lastActivityDate: new Date()
  }

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 100) + 1
  }

  const handleXPGain = useCallback((amount: number, reason: string) => {
    setUserStats(prevStats => {
      if (!prevStats) return prevStats

      const newXP = prevStats.totalXP + amount
      const newLevel = calculateLevel(newXP)
      const leveledUp = newLevel > prevStats.level
      
      const updatedStats = {
        ...prevStats,
        totalXP: newXP,
        level: newLevel,
        lastActivityDate: new Date()
      }

      // Show XP gain toast with custom styling
      toast.success(`+${amount} XP`, {
        description: reason,
        className: 'xp-toast',
        duration: 3000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '2px solid var(--primary)',
          fontWeight: '600',
          fontSize: '15px'
        }
      })

      // Show level up notification if leveled up
      if (leveledUp) {
        setTimeout(() => {
          toast.success('🎉 Level Up!', {
            description: `Congratulations! You've reached level ${newLevel}!`,
            className: 'achievement-toast',
            duration: 5000,
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '2px solid var(--primary)',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
            }
          })
        }, 500)
      }

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats))
      } catch (error) {
        console.error('Error saving user stats:', error)
      }

      return updatedStats
    })
  }, [])

  const updateWorkoutStats = useCallback((sessionTime: number) => {
    setUserStats(prevStats => {
      if (!prevStats) return prevStats

      const updatedStats = {
        ...prevStats,
        workoutsCompleted: prevStats.workoutsCompleted + 1,
        totalWorkouts: prevStats.totalWorkouts + 1,
        averageSessionTime: Math.round(
          (prevStats.averageSessionTime * (prevStats.totalWorkouts - 1) + sessionTime) / prevStats.totalWorkouts
        ),
        weeklyProgress: Math.min(prevStats.weeklyProgress + 1, prevStats.weeklyGoal),
        lastActivityDate: new Date()
      }

      // Check for weekly goal completion
      if (updatedStats.weeklyProgress >= updatedStats.weeklyGoal && 
          prevStats.weeklyProgress < prevStats.weeklyGoal) {
        toast.success('🎯 Weekly Goal Achieved!', {
          description: `You've completed ${updatedStats.weeklyGoal} workouts this week!`,
          className: 'achievement-toast',
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '700'
          }
        })
      }

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats))
      } catch (error) {
        console.error('Error saving user stats:', error)
      }

      return updatedStats
    })
  }, [])

  const updateNutritionStats = useCallback((calories: number) => {
    setUserStats(prevStats => {
      if (!prevStats) return prevStats

      const updatedStats = {
        ...prevStats,
        totalCaloriesTracked: prevStats.totalCaloriesTracked + calories,
        lastActivityDate: new Date()
      }

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats))
      } catch (error) {
        console.error('Error saving user stats:', error)
      }

      return updatedStats
    })
  }, [])

  const updateStreak = useCallback(() => {
    setUserStats(prevStats => {
      if (!prevStats) return prevStats

      const today = new Date().toDateString()
      const lastActivity = prevStats.lastActivityDate.toDateString()
      
      if (today === lastActivity) {
        return prevStats // Already updated today
      }

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      let newStreak = 1
      if (lastActivity === yesterday.toDateString()) {
        newStreak = prevStats.streak + 1
      }

      const updatedStats = {
        ...prevStats,
        streak: newStreak,
        lastActivityDate: new Date()
      }

      // Show streak milestone notifications
      if (newStreak === 7) {
        toast.success('🔥 Week Streak!', {
          description: 'Amazing! You\'ve maintained a 7-day streak!',
          className: 'achievement-toast',
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '700'
          }
        })
      } else if (newStreak === 30) {
        toast.success('🏆 Month Streak!', {
          description: 'Incredible! You\'ve reached a 30-day streak!',
          className: 'achievement-toast',
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '700'
          }
        })
      }

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats))
      } catch (error) {
        console.error('Error saving user stats:', error)
      }

      return updatedStats
    })
  }, [])

  const addAchievement = useCallback((achievementName: string) => {
    setUserStats(prevStats => {
      if (!prevStats) return prevStats

      const updatedStats = {
        ...prevStats,
        achievements: prevStats.achievements + 1,
        lastActivityDate: new Date()
      }

      // Show achievement unlock notification
      toast.success('🏅 Achievement Unlocked!', {
        description: achievementName,
        className: 'achievement-toast',
        duration: 6000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '2px solid var(--primary)',
          fontWeight: '700',
          transform: 'scale(1.02)'
        }
      })

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats))
      } catch (error) {
        console.error('Error saving user stats:', error)
      }

      return updatedStats
    })
  }, [])

  const loadStatsFromStorage = useCallback(() => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS)
      if (savedStats) {
        const stats = JSON.parse(savedStats)
        setUserStats({
          ...stats,
          lastActivityDate: new Date(stats.lastActivityDate)
        })
      } else {
        setUserStats(defaultStats)
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
      setUserStats(defaultStats)
    }
  }, [])

  const resetStats = useCallback(() => {
    setUserStats(defaultStats)
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_STATS)
    } catch (error) {
      console.error('Error clearing user stats:', error)
    }
  }, [])

  const initializeStats = useCallback((profile: any) => {
    const initialStats = {
      ...defaultStats,
      totalXP: 100, // Starting XP for completing onboarding
      level: 1,
      lastActivityDate: new Date()
    }
    
    setUserStats(initialStats)
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(initialStats))
    } catch (error) {
      console.error('Error saving initial user stats:', error)
    }
    
    return initialStats
  }, [])

  return {
    userStats,
    handleXPGain,
    updateWorkoutStats,
    updateNutritionStats,
    updateStreak,
    addAchievement,
    loadStatsFromStorage,
    resetStats,
    initializeStats
  }
}
"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner@2.0.3'

export interface WorkoutSession {
  id: string
  date: Date
  type: 'strength' | 'cardio' | 'flexibility' | 'planned'
  completed: boolean
  skipped?: boolean
  duration?: number
}

export interface MotivationSettings {
  enableNotifications: boolean
  skipThreshold: number // days before considering skipped
  encouragementLevel: 'gentle' | 'motivating' | 'intense'
  reminderTimes: string[] // Times to send reminders
}

class MotivationService {
  private static instance: MotivationService
  private settings: MotivationSettings
  private workoutHistory: WorkoutSession[] = []
  private lastWorkoutDate: Date | null = null
  private skipStreak: number = 0
  private notificationTimeouts: NodeJS.Timeout[] = []

  // Motivational quotes by intensity level
  private readonly motivationalQuotes = {
    gentle: [
      "Every small step counts. You've got this! 💪",
      "Your body deserves some love today. How about a quick workout?",
      "Remember why you started. One workout at a time! 🌟",
      "Progress isn't about perfection. Ready to move?",
      "Your future self will thank you for working out today!",
      "Even 10 minutes of movement is better than none! 🏃‍♀️",
      "You're stronger than you think. Let's prove it!",
      "Small progress is still progress. Ready to make some?",
      "Your health is an investment, not an expense. 💎",
      "Every champion was once a beginner who refused to give up!"
    ],
    motivating: [
      "Champions train when they don't feel like it! 🏆",
      "Your only competition is who you were yesterday!",
      "Success starts with a single rep. Let's go! 💥",
      "Pain is temporary, but quitting lasts forever!",
      "The best project you'll ever work on is YOU! 🔥",
      "Sweat is just fat crying. Make it weep! 💪",
      "You didn't come this far to only come this far!",
      "Discipline is choosing between what you want now vs what you want most!",
      "Your body can do it. It's your mind you need to convince! 🧠",
      "Make yourself proud. Hit the gym! ⚡"
    ],
    intense: [
      "STOP MAKING EXCUSES! Your goals won't achieve themselves! 🔥🔥",
      "While you're making excuses, someone else is getting stronger! 💪",
      "WEAK minds quit. STRONG minds find a way! Which are you?",
      "Your competition is working out RIGHT NOW! What are you doing? ⚡",
      "LEGENDS aren't made on comfortable days! GET UP!",
      "The gym doesn't care about your excuses. Results don't lie! 💥",
      "EVERY second you wait is a second your competition gets ahead!",
      "PAIN is just weakness leaving your body! EMBRACE IT! 🔥",
      "You PROMISED yourself you'd change. PROVE IT! 🏆",
      "ORDINARY people make excuses. EXTRAORDINARY people make results! 💪"
    ]
  }

  private readonly comebackQuotes = [
    "The comeback is always stronger than the setback! 🔥",
    "You took a break, now take your power back! 💪",
    "Every expert was once a beginner. Every pro was once an amateur! 🌟",
    "It's not about being perfect, it's about being consistent! ⚡",
    "Your body missed you. Welcome back, champion! 🏆",
    "The best time to restart was yesterday. The second best time is NOW!",
    "Fall seven times, stand up eight. You're standing up now! 💥",
    "Your journey doesn't end with a setback. It begins with a comeback!",
    "Every new day is a chance to be better than yesterday! 🌅",
    "You're not starting over, you're starting stronger! 💎"
  ]

  private readonly skipReasons = [
    "Too busy today",
    "Not feeling well",
    "No motivation",
    "Gym is closed",
    "Equipment not available",
    "Too tired",
    "Weather is bad",
    "Family obligations",
    "Work commitment",
    "Just not today"
  ]

  constructor() {
    this.settings = this.loadSettings()
    this.workoutHistory = this.loadWorkoutHistory()
    this.calculateSkipStreak()
    this.setupNotifications()
  }

  static getInstance(): MotivationService {
    if (!MotivationService.instance) {
      MotivationService.instance = new MotivationService()
    }
    return MotivationService.instance
  }

  private loadSettings(): MotivationSettings {
    const saved = localStorage.getItem('motivation_settings')
    if (saved) {
      return JSON.parse(saved)
    }
    
    return {
      enableNotifications: true,
      skipThreshold: 2,
      encouragementLevel: 'motivating',
      reminderTimes: ['09:00', '18:00']
    }
  }

  private saveSettings(): void {
    localStorage.setItem('motivation_settings', JSON.stringify(this.settings))
  }

  private loadWorkoutHistory(): WorkoutSession[] {
    const saved = localStorage.getItem('workout_history')
    if (saved) {
      return JSON.parse(saved).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }))
    }
    return []
  }

  private saveWorkoutHistory(): void {
    localStorage.setItem('workout_history', JSON.stringify(this.workoutHistory))
  }

  private calculateSkipStreak(): void {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let streak = 0
    for (let i = 1; i <= 30; i++) { // Check last 30 days
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      
      const hasWorkout = this.workoutHistory.some(session => {
        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0)
        return sessionDate.getTime() === checkDate.getTime() && session.completed
      })
      
      if (hasWorkout) {
        break
      }
      streak++
    }
    
    this.skipStreak = streak
    this.lastWorkoutDate = this.getLastWorkoutDate()
  }

  private getLastWorkoutDate(): Date | null {
    const completedWorkouts = this.workoutHistory
      .filter(session => session.completed)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    
    return completedWorkouts.length > 0 ? completedWorkouts[0].date : null
  }

  logWorkout(session: Omit<WorkoutSession, 'id'>): void {
    const newSession: WorkoutSession = {
      ...session,
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    this.workoutHistory.push(newSession)
    this.saveWorkoutHistory()
    this.calculateSkipStreak()
    
    if (session.completed) {
      this.showWorkoutCompleteMotivation()
    } else if (session.skipped) {
      this.handleWorkoutSkip()
    }
  }

  private showWorkoutCompleteMotivation(): void {
    const congratsMessages = [
      "🎉 Workout complete! You're absolutely crushing it!",
      "💪 Another step closer to your goals! Amazing work!",
      "🔥 Consistency is key, and you're mastering it!",
      "⚡ Your dedication is inspiring! Keep it up!",
      "🏆 Champions are made in moments like these!"
    ]
    
    const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)]
    toast.success(randomMessage, { duration: 4000 })
    
    // Reset skip streak
    this.skipStreak = 0
  }

  private handleWorkoutSkip(): void {
    this.skipStreak++
    
    // Show immediate skip message
    const skipMessage = this.getSkipMessage()
    toast.warning(skipMessage, { duration: 6000 })
    
    // Schedule follow-up motivation
    setTimeout(() => {
      this.showFollowUpMotivation()
    }, 3600000) // 1 hour later
  }

  private getSkipMessage(): string {
    const { encouragementLevel } = this.settings
    const quotes = this.motivationalQuotes[encouragementLevel]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  private showFollowUpMotivation(): void {
    if (this.skipStreak >= this.settings.skipThreshold) {
      const comebackMessage = this.comebackQuotes[Math.floor(Math.random() * this.comebackQuotes.length)]
      toast.info(comebackMessage, { 
        duration: 8000,
        action: {
          label: 'Start Workout',
          onClick: () => {
            // Navigate to workout section
            window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'exercises' }))
          }
        }
      })
    }
  }

  getDaysSinceLastWorkout(): number {
    if (!this.lastWorkoutDate) return 999
    
    const today = new Date()
    const diffTime = today.getTime() - this.lastWorkoutDate.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  getSkipStreak(): number {
    return this.skipStreak
  }

  getMotivationalQuote(level?: 'gentle' | 'motivating' | 'intense'): string {
    const targetLevel = level || this.settings.encouragementLevel
    const quotes = this.motivationalQuotes[targetLevel]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  showSkipDialog(): Promise<{ skipped: boolean; reason?: string }> {
    return new Promise((resolve) => {
      // Create a custom skip dialog
      const skipReasonIndex = Math.floor(Math.random() * this.skipReasons.length)
      const suggestedReason = this.skipReasons[skipReasonIndex]
      
      const confirmSkip = confirm(
        `Are you sure you want to skip today's workout?\n\n` +
        `"${this.getMotivationalQuote()}"\n\n` +
        `Suggested reason: ${suggestedReason}\n\n` +
        `Click OK to skip, Cancel to workout instead.`
      )
      
      if (confirmSkip) {
        resolve({ skipped: true, reason: suggestedReason })
      } else {
        resolve({ skipped: false })
      }
    })
  }

  setupNotifications(): void {
    if (!this.settings.enableNotifications) return
    
    // Clear existing timeouts
    this.notificationTimeouts.forEach(timeout => clearTimeout(timeout))
    this.notificationTimeouts = []
    
    // Setup daily reminders
    this.settings.reminderTimes.forEach(time => {
      this.scheduleNotification(time)
    })
  }

  private scheduleNotification(time: string): void {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setHours(hours, minutes, 0, 0)
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime()
    
    const timeout = setTimeout(() => {
      this.sendWorkoutReminder()
      // Schedule next day
      this.scheduleNotification(time)
    }, timeUntilNotification)
    
    this.notificationTimeouts.push(timeout)
  }

  private sendWorkoutReminder(): void {
    // Check if user already worked out today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const hasWorkedOutToday = this.workoutHistory.some(session => {
      const sessionDate = new Date(session.date)
      sessionDate.setHours(0, 0, 0, 0)
      return sessionDate.getTime() === today.getTime() && session.completed
    })
    
    if (!hasWorkedOutToday) {
      const reminderMessage = this.getMotivationalQuote()
      toast.info(reminderMessage, {
        duration: 10000,
        action: {
          label: 'Start Workout',
          onClick: () => {
            window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'exercises' }))
          }
        }
      })
    }
  }

  updateSettings(newSettings: Partial<MotivationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.saveSettings()
    this.setupNotifications()
  }

  getSettings(): MotivationSettings {
    return { ...this.settings }
  }

  getWorkoutStats(): {
    totalWorkouts: number
    workoutsThisWeek: number
    workoutsThisMonth: number
    longestStreak: number
    currentSkipStreak: number
    daysSinceLastWorkout: number
  } {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const completedWorkouts = this.workoutHistory.filter(session => session.completed)
    
    return {
      totalWorkouts: completedWorkouts.length,
      workoutsThisWeek: completedWorkouts.filter(session => session.date >= oneWeekAgo).length,
      workoutsThisMonth: completedWorkouts.filter(session => session.date >= oneMonthAgo).length,
      longestStreak: this.calculateLongestStreak(),
      currentSkipStreak: this.skipStreak,
      daysSinceLastWorkout: this.getDaysSinceLastWorkout()
    }
  }

  private calculateLongestStreak(): number {
    // Calculate longest consecutive workout streak
    let maxStreak = 0
    let currentStreak = 0
    
    const sortedWorkouts = this.workoutHistory
      .filter(session => session.completed)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      if (i === 0) {
        currentStreak = 1
      } else {
        const prevDate = new Date(sortedWorkouts[i - 1].date)
        const currDate = new Date(sortedWorkouts[i].date)
        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          currentStreak++
        } else {
          maxStreak = Math.max(maxStreak, currentStreak)
          currentStreak = 1
        }
      }
    }
    
    return Math.max(maxStreak, currentStreak)
  }
}

// Export singleton instance
export const motivationService = MotivationService.getInstance()

// React hook for using motivation service
export function useMotivation() {
  const [stats, setStats] = useState(motivationService.getWorkoutStats())
  const [settings, setSettings] = useState(motivationService.getSettings())
  
  useEffect(() => {
    // Update stats periodically
    const interval = setInterval(() => {
      setStats(motivationService.getWorkoutStats())
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])
  
  const logWorkout = (session: Omit<WorkoutSession, 'id'>) => {
    motivationService.logWorkout(session)
    setStats(motivationService.getWorkoutStats())
  }
  
  const updateSettings = (newSettings: Partial<MotivationSettings>) => {
    motivationService.updateSettings(newSettings)
    setSettings(motivationService.getSettings())
  }
  
  const getMotivationalQuote = (level?: 'gentle' | 'motivating' | 'intense') => {
    return motivationService.getMotivationalQuote(level)
  }
  
  const showSkipDialog = () => {
    return motivationService.showSkipDialog()
  }
  
  return {
    stats,
    settings,
    logWorkout,
    updateSettings,
    getMotivationalQuote,
    showSkipDialog
  }
}

export default motivationService
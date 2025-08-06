"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner@2.0.3'
import { Bell, Calendar, Clock, Utensils, AlertCircle, Check } from 'lucide-react'

interface MealReminder {
  id: string
  title: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string // HH:MM format
  days: number[] // 0 = Sunday, 1 = Monday, etc.
  isActive: boolean
  lastTriggered?: Date
  customMessage?: string
  soundEnabled: boolean
  vibrationEnabled: boolean
  persistentNotification: boolean
  createdAt: Date
  updatedAt: Date
}

interface WorkoutReminder {
  id: string
  title: string
  workoutType: string
  time: string
  days: number[]
  isActive: boolean
  lastTriggered?: Date
  customMessage?: string
  soundEnabled: boolean
  vibrationEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

interface ReminderNotification {
  id: string
  type: 'meal' | 'workout' | 'water' | 'medication'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionRequired?: boolean
  reminderId?: string
}

class ReminderService {
  private static instance: ReminderService | null = null
  private mealReminders: MealReminder[] = []
  private workoutReminders: WorkoutReminder[] = []
  private notifications: ReminderNotification[] = []
  private checkInterval: NodeJS.Timeout | null = null
  private permissionGranted = false
  private permissionRequested = false
  private listeners: ((notifications: ReminderNotification[]) => void)[] = []

  private constructor() {
    this.loadReminders()
    this.checkNotificationPermission()
    this.startReminderCheck()
  }

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService()
    }
    return ReminderService.instance
  }

  // Check current permission status without requesting
  private checkNotificationPermission(): void {
    if ('Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted'
    }
  }

  // Request permission only when needed
  private async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permissionRequested) {
      return this.permissionGranted
    }

    this.permissionRequested = true

    try {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        this.permissionGranted = permission === 'granted'
        
        if (this.permissionGranted) {
          console.log('Notification permission granted')
          toast.success('Notifications enabled! You\'ll receive meal and workout reminders.')
        } else {
          console.warn('Notification permission denied')
          toast.info('Notifications disabled. You can still use in-app reminders.')
        }
      } else {
        this.permissionGranted = Notification.permission === 'granted'
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      this.permissionGranted = false
    }

    return this.permissionGranted
  }

  // Load reminders from localStorage
  private loadReminders(): void {
    try {
      const savedMealReminders = localStorage.getItem('fitness_meal_reminders')
      if (savedMealReminders) {
        this.mealReminders = JSON.parse(savedMealReminders).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined
        }))
      }

      const savedWorkoutReminders = localStorage.getItem('fitness_workout_reminders')
      if (savedWorkoutReminders) {
        this.workoutReminders = JSON.parse(savedWorkoutReminders).map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined
        }))
      }

      const savedNotifications = localStorage.getItem('fitness_notifications')
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
      }
    } catch (error) {
      console.error('Error loading reminders:', error)
    }
  }

  // Save reminders to localStorage
  private saveReminders(): void {
    try {
      localStorage.setItem('fitness_meal_reminders', JSON.stringify(this.mealReminders))
      localStorage.setItem('fitness_workout_reminders', JSON.stringify(this.workoutReminders))
      localStorage.setItem('fitness_notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Error saving reminders:', error)
    }
  }

  // Start reminder checking
  private startReminderCheck(): void {
    // Check every minute
    this.checkInterval = setInterval(() => {
      this.checkReminders()
    }, 60000)

    // Also check immediately
    this.checkReminders()
  }

  // Check if any reminders should trigger
  private checkReminders(): void {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const currentDay = now.getDay()

    // Check meal reminders
    this.mealReminders.forEach(reminder => {
      if (this.shouldTriggerReminder(reminder, currentTime, currentDay, now)) {
        this.triggerMealReminder(reminder)
      }
    })

    // Check workout reminders
    this.workoutReminders.forEach(reminder => {
      if (this.shouldTriggerReminder(reminder, currentTime, currentDay, now)) {
        this.triggerWorkoutReminder(reminder)
      }
    })
  }

  // Check if reminder should trigger
  private shouldTriggerReminder(
    reminder: MealReminder | WorkoutReminder, 
    currentTime: string, 
    currentDay: number, 
    now: Date
  ): boolean {
    if (!reminder.isActive) return false
    if (reminder.time !== currentTime) return false
    if (!reminder.days.includes(currentDay)) return false

    // Check if already triggered today
    if (reminder.lastTriggered) {
      const lastTriggered = new Date(reminder.lastTriggered)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const lastTriggeredDate = new Date(lastTriggered.getFullYear(), lastTriggered.getMonth(), lastTriggered.getDate())
      
      if (today.getTime() === lastTriggeredDate.getTime()) {
        return false // Already triggered today
      }
    }

    return true
  }

  // Trigger meal reminder
  private async triggerMealReminder(reminder: MealReminder): Promise<void> {
    const message = reminder.customMessage || `Time for ${reminder.mealType}! Don't forget to track your meal.`
    
    // Create notification
    const notification: ReminderNotification = {
      id: Date.now().toString(),
      type: 'meal',
      title: reminder.title,
      message,
      timestamp: new Date(),
      isRead: false,
      actionRequired: true,
      reminderId: reminder.id
    }

    this.addNotification(notification)

    // Show browser notification (only if permission granted)
    if (this.permissionGranted) {
      try {
        const browserNotification = new Notification(reminder.title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `meal-${reminder.id}`,
          requireInteraction: reminder.persistentNotification,
          silent: !reminder.soundEnabled,
          vibrate: reminder.vibrationEnabled ? [200, 100, 200] : undefined
        })

        browserNotification.onclick = () => {
          window.focus()
          browserNotification.close()
          // Navigate to meals section
          if ((window as any).setActiveTab) {
            (window as any).setActiveTab('meals')
          }
        }
      } catch (error) {
        console.error('Error showing browser notification:', error)
      }
    }

    // Always show toast notification
    toast(reminder.title, {
      description: message,
      icon: <Utensils className="h-4 w-4" />,
      duration: 5000,
      action: {
        label: 'Log Meal',
        onClick: () => {
          if ((window as any).setActiveTab) {
            (window as any).setActiveTab('meals')
          }
        }
      }
    })

    // Update last triggered
    reminder.lastTriggered = new Date()
    this.updateMealReminder(reminder.id, { lastTriggered: reminder.lastTriggered })
  }

  // Trigger workout reminder
  private async triggerWorkoutReminder(reminder: WorkoutReminder): Promise<void> {
    const message = reminder.customMessage || `Time for your ${reminder.workoutType} workout! Let's get moving!`
    
    // Create notification
    const notification: ReminderNotification = {
      id: Date.now().toString(),
      type: 'workout',
      title: reminder.title,
      message,
      timestamp: new Date(),
      isRead: false,
      actionRequired: true,
      reminderId: reminder.id
    }

    this.addNotification(notification)

    // Show browser notification (only if permission granted)
    if (this.permissionGranted) {
      try {
        const browserNotification = new Notification(reminder.title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `workout-${reminder.id}`,
          requireInteraction: true,
          silent: !reminder.soundEnabled,
          vibrate: reminder.vibrationEnabled ? [200, 100, 200] : undefined
        })

        browserNotification.onclick = () => {
          window.focus()
          browserNotification.close()
          // Navigate to exercises section
          if ((window as any).setActiveTab) {
            (window as any).setActiveTab('exercises')
          }
        }
      } catch (error) {
        console.error('Error showing browser notification:', error)
      }
    }

    // Always show toast notification
    toast(reminder.title, {
      description: message,
      icon: <AlertCircle className="h-4 w-4" />,
      duration: 5000,
      action: {
        label: 'Start Workout',
        onClick: () => {
          if ((window as any).setActiveTab) {
            (window as any).setActiveTab('exercises')
          }
        }
      }
    })

    // Update last triggered
    reminder.lastTriggered = new Date()
    this.updateWorkoutReminder(reminder.id, { lastTriggered: reminder.lastTriggered })
  }

  // Meal reminder management
  async addMealReminder(reminderData: Omit<MealReminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Request permission when adding first reminder
    if (!this.permissionRequested) {
      await this.requestNotificationPermission()
    }

    const reminder: MealReminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.mealReminders.push(reminder)
    this.saveReminders()
    toast.success('Meal reminder added successfully!')
    return reminder.id
  }

  updateMealReminder(id: string, updates: Partial<MealReminder>): void {
    const index = this.mealReminders.findIndex(r => r.id === id)
    if (index >= 0) {
      this.mealReminders[index] = {
        ...this.mealReminders[index],
        ...updates,
        updatedAt: new Date()
      }
      this.saveReminders()
    }
  }

  deleteMealReminder(id: string): void {
    this.mealReminders = this.mealReminders.filter(r => r.id !== id)
    this.saveReminders()
    toast.success('Meal reminder deleted')
  }

  getMealReminders(): MealReminder[] {
    return [...this.mealReminders]
  }

  // Workout reminder management
  async addWorkoutReminder(reminderData: Omit<WorkoutReminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Request permission when adding first reminder
    if (!this.permissionRequested) {
      await this.requestNotificationPermission()
    }

    const reminder: WorkoutReminder = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.workoutReminders.push(reminder)
    this.saveReminders()
    toast.success('Workout reminder added successfully!')
    return reminder.id
  }

  updateWorkoutReminder(id: string, updates: Partial<WorkoutReminder>): void {
    const index = this.workoutReminders.findIndex(r => r.id === id)
    if (index >= 0) {
      this.workoutReminders[index] = {
        ...this.workoutReminders[index],
        ...updates,
        updatedAt: new Date()
      }
      this.saveReminders()
    }
  }

  deleteWorkoutReminder(id: string): void {
    this.workoutReminders = this.workoutReminders.filter(r => r.id !== id)
    this.saveReminders()
    toast.success('Workout reminder deleted')
  }

  getWorkoutReminders(): WorkoutReminder[] {
    return [...this.workoutReminders]
  }

  // Notification management
  private addNotification(notification: ReminderNotification): void {
    this.notifications.unshift(notification)
    // Keep only last 50 notifications
    this.notifications = this.notifications.slice(0, 50)
    this.saveReminders()
    this.notifyListeners()
  }

  getNotifications(): ReminderNotification[] {
    return [...this.notifications]
  }

  markNotificationAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
      this.saveReminders()
      this.notifyListeners()
    }
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.isRead = true)
    this.saveReminders()
    this.notifyListeners()
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.saveReminders()
    this.notifyListeners()
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length
  }

  // Quick meal reminders
  async addQuickMealReminder(mealType: MealReminder['mealType'], time: string): Promise<void> {
    // Request permission first if not already done
    await this.requestNotificationPermission()
    
    const reminderData = {
      title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Reminder`,
      mealType,
      time,
      days: [1, 2, 3, 4, 5, 6, 0], // All days
      isActive: true,
      soundEnabled: true,
      vibrationEnabled: true,
      persistentNotification: false
    }

    await this.addMealReminder(reminderData)
    
    // Show immediate confirmation
    toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} reminder set!`, {
      description: `You'll be reminded daily at ${time}`
    })
  }

  // Add test reminder function
  addTestReminder(): void {
    const now = new Date()
    const testTime = `${(now.getHours()).toString().padStart(2, '0')}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`
    
    const reminderData = {
      title: 'Test Reminder',
      mealType: 'snack' as const,
      time: testTime,
      days: [now.getDay()],
      isActive: true,
      soundEnabled: true,
      vibrationEnabled: true,
      persistentNotification: false
    }

    this.addMealReminder(reminderData)
    toast.success(`Test reminder set for ${testTime} (in 1 minute)`)
  }

  // Check permission status
  getPermissionStatus(): string {
    if (!('Notification' in window)) return 'not-supported'
    return Notification.permission
  }

  // Listener management
  addListener(listener: (notifications: ReminderNotification[]) => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: (notifications: ReminderNotification[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  // Cleanup
  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
    this.listeners = []
  }
}

// Hook for using reminder service
export function useReminderService() {
  const [reminderService] = useState(() => ReminderService.getInstance())
  const [notifications, setNotifications] = useState<ReminderNotification[]>([])

  useEffect(() => {
    const updateNotifications = (newNotifications: ReminderNotification[]) => {
      setNotifications(newNotifications)
    }

    reminderService.addListener(updateNotifications)
    setNotifications(reminderService.getNotifications())

    return () => {
      reminderService.removeListener(updateNotifications)
    }
  }, [reminderService])

  return {
    reminderService,
    notifications,
    unreadCount: reminderService.getUnreadCount()
  }
}

export default ReminderService
export type { MealReminder, WorkoutReminder, ReminderNotification }
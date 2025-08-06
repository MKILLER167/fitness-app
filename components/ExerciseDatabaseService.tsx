import { projectId, publicAnonKey } from '../utils/supabase/info'

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-896b3bbe`

export interface ExerciseSession {
  exerciseId: string
  weight: number
  reps: number
  sets: number
  duration?: number
  notes?: string
  date: string
  caloriesBurned?: number
}

export interface ExerciseStats {
  exerciseId: string
  totalSessions: number
  maxWeight: number
  maxReps: number
  totalVolume: number
  lastPerformed: string
  personalRecord: {
    weight: number
    reps: number
    date: string
  }
}

export interface WorkoutAnalytics {
  totalWorkouts: number
  totalVolume: number
  totalCalories: number
  exerciseBreakdown: { [exerciseId: string]: number }
  weeklyProgress: Array<{ date: string, volume: number, workouts: number }>
}

class ExerciseDatabaseService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Exercise Database Service Error (${endpoint}):`, error)
      throw error
    }
  }

  // Save exercise session
  async saveExerciseSession(userId: string, session: Omit<ExerciseSession, 'id'>) {
    try {
      const response = await this.makeRequest('/exercises/session', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          ...session
        }),
      })

      return {
        success: true,
        sessionId: response.sessionId
      }
    } catch (error) {
      console.error('Error saving exercise session:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get user exercise statistics
  async getUserExerciseStats(userId: string, exerciseId?: string): Promise<{ success: boolean, stats?: ExerciseStats | ExerciseStats[], error?: string }> {
    try {
      const query = exerciseId ? `?exerciseId=${exerciseId}` : ''
      const response = await this.makeRequest(`/exercises/stats/${userId}${query}`)

      return {
        success: true,
        stats: response.stats
      }
    } catch (error) {
      console.error('Error getting exercise stats:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get user exercise history
  async getUserExerciseHistory(userId: string, exerciseId?: string, limit = 50): Promise<{ success: boolean, sessions?: ExerciseSession[], error?: string }> {
    try {
      const params = new URLSearchParams()
      if (exerciseId) params.append('exerciseId', exerciseId)
      params.append('limit', limit.toString())
      
      const query = params.toString() ? `?${params.toString()}` : ''
      const response = await this.makeRequest(`/exercises/history/${userId}${query}`)

      return {
        success: true,
        sessions: response.sessions
      }
    } catch (error) {
      console.error('Error getting exercise history:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get personal records
  async getPersonalRecords(userId: string): Promise<{ success: boolean, personalRecords?: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }, error?: string }> {
    try {
      const response = await this.makeRequest(`/exercises/records/${userId}`)

      return {
        success: true,
        personalRecords: response.personalRecords
      }
    } catch (error) {
      console.error('Error getting personal records:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get workout analytics
  async getWorkoutAnalytics(userId: string, timeframe = '30'): Promise<{ success: boolean, analytics?: WorkoutAnalytics, error?: string }> {
    try {
      const response = await this.makeRequest(`/exercises/analytics/${userId}?timeframe=${timeframe}`)

      return {
        success: true,
        analytics: response.analytics
      }
    } catch (error) {
      console.error('Error getting workout analytics:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Delete exercise session
  async deleteExerciseSession(userId: string, sessionId: string) {
    try {
      await this.makeRequest(`/exercises/session/${userId}/${sessionId}`, {
        method: 'DELETE'
      })

      return { success: true }
    } catch (error) {
      console.error('Error deleting exercise session:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Save custom exercise
  async saveCustomExercise(userId: string, exercise: any) {
    try {
      const response = await this.makeRequest('/exercises/custom', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          ...exercise
        }),
      })

      return {
        success: true,
        exerciseId: response.exerciseId
      }
    } catch (error) {
      console.error('Error saving custom exercise:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get user custom exercises
  async getUserCustomExercises(userId: string) {
    try {
      const response = await this.makeRequest(`/exercises/custom/${userId}`)

      return {
        success: true,
        exercises: response.exercises
      }
    } catch (error) {
      console.error('Error getting custom exercises:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Calculate calories burned based on exercise and user data
  calculateCaloriesBurned(exerciseId: string, duration: number, userWeight: number = 70): number {
    // MET values for different exercises (metabolic equivalent of task)
    const metValues: { [key: string]: number } = {
      'bench_press': 6.0,
      'squat': 8.0,
      'deadlift': 8.0,
      'pull_up': 8.0,
      'push_ups': 7.0,
      'burpees': 10.0,
      'mountain_climbers': 8.0,
      'jumping_jacks': 7.0,
      'plank': 3.8,
      'lunges': 7.0,
      'overhead_press': 6.0,
      'lateral_raises': 4.0,
      'barbell_curls': 4.5,
      'tricep_dips': 7.0,
      'calf_raises': 3.5,
      'russian_twists': 5.0,
      'farmers_walk': 7.0,
      'turkish_getup': 6.5
    }

    const met = metValues[exerciseId] || 5.0 // Default MET value
    
    // Calories burned = MET × weight in kg × time in hours
    const caloriesBurned = met * userWeight * (duration / 60)
    
    return Math.round(caloriesBurned)
  }

  // Get exercise difficulty progression suggestions
  getProgressionSuggestions(exerciseId: string, currentWeight: number, currentReps: number): Array<{ type: string, suggestion: string }> {
    const suggestions = []

    // Weight progression
    if (currentReps >= 12) {
      suggestions.push({
        type: 'weight',
        suggestion: `Increase weight by 2.5-5kg and reduce reps to 8-10`
      })
    }

    // Rep progression
    if (currentReps < 15) {
      suggestions.push({
        type: 'reps',
        suggestion: `Try to add 1-2 more reps next session`
      })
    }

    // Time under tension
    suggestions.push({
      type: 'tempo',
      suggestion: `Try slowing down the negative (lowering) portion to 3 seconds`
    })

    // Volume progression
    suggestions.push({
      type: 'volume',
      suggestion: `Add an extra set if you can maintain good form`
    })

    return suggestions
  }

  // Get recommended rest time between sets
  getRecommendedRestTime(exerciseId: string, intensity: 'light' | 'moderate' | 'heavy'): number {
    const restTimes = {
      light: 60,      // 1 minute
      moderate: 120,  // 2 minutes  
      heavy: 180      // 3 minutes
    }

    // Compound exercises generally need more rest
    const compoundExercises = ['bench_press', 'squat', 'deadlift', 'overhead_press', 'pull_up']
    
    if (compoundExercises.includes(exerciseId)) {
      return restTimes[intensity] + 30 // Add 30 seconds for compound movements
    }

    return restTimes[intensity]
  }
}

export const exerciseDatabaseService = new ExerciseDatabaseService()
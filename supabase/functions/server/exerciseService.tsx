import { createClient } from 'jsr:@supabase/supabase-js@2.49.8'
import * as kv from './kv_store.tsx'

const client = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

export interface ExerciseRecord {
  id: string
  userId: string
  exerciseId: string
  weight: number
  reps: number
  sets: number
  duration?: number
  notes?: string
  date: string
  caloriesBurned?: number
}

export interface UserExerciseStats {
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

// Save exercise session
export async function saveExerciseSession(userId: string, session: Omit<ExerciseRecord, 'id' | 'userId'>) {
  try {
    const sessionId = `exercise_session_${userId}_${Date.now()}`
    const exerciseSession: ExerciseRecord = {
      id: sessionId,
      userId,
      ...session
    }
    
    await kv.set(`exercise_session:${sessionId}`, exerciseSession)
    
    // Update user stats
    await updateUserExerciseStats(userId, session.exerciseId, session)
    
    return { success: true, sessionId }
  } catch (error) {
    console.error('Error saving exercise session:', error)
    return { success: false, error: error.message }
  }
}

// Update user exercise statistics
async function updateUserExerciseStats(userId: string, exerciseId: string, session: Omit<ExerciseRecord, 'id' | 'userId'>) {
  try {
    const statsKey = `exercise_stats:${userId}:${exerciseId}`
    const existingStats = await kv.get(statsKey) as UserExerciseStats | null
    
    const volume = session.weight * session.reps * session.sets
    const currentDate = new Date(session.date)
    
    let updatedStats: UserExerciseStats
    
    if (existingStats) {
      // Update existing stats
      const isNewPR = session.weight > existingStats.personalRecord.weight || 
                     (session.weight === existingStats.personalRecord.weight && session.reps > existingStats.personalRecord.reps)
      
      updatedStats = {
        exerciseId,
        totalSessions: existingStats.totalSessions + 1,
        maxWeight: Math.max(existingStats.maxWeight, session.weight),
        maxReps: Math.max(existingStats.maxReps, session.reps),
        totalVolume: existingStats.totalVolume + volume,
        lastPerformed: session.date,
        personalRecord: isNewPR ? {
          weight: session.weight,
          reps: session.reps,
          date: session.date
        } : existingStats.personalRecord
      }
    } else {
      // Create new stats
      updatedStats = {
        exerciseId,
        totalSessions: 1,
        maxWeight: session.weight,
        maxReps: session.reps,
        totalVolume: volume,
        lastPerformed: session.date,
        personalRecord: {
          weight: session.weight,
          reps: session.reps,
          date: session.date
        }
      }
    }
    
    await kv.set(statsKey, updatedStats)
    return updatedStats
  } catch (error) {
    console.error('Error updating exercise stats:', error)
    throw error
  }
}

// Get user exercise statistics
export async function getUserExerciseStats(userId: string, exerciseId?: string) {
  try {
    if (exerciseId) {
      const stats = await kv.get(`exercise_stats:${userId}:${exerciseId}`)
      return { success: true, stats }
    }
    
    // Get all exercise stats for user
    const allStats = await kv.getByPrefix(`exercise_stats:${userId}:`)
    return { success: true, stats: allStats }
  } catch (error) {
    console.error('Error getting exercise stats:', error)
    return { success: false, error: error.message }
  }
}

// Get user exercise history
export async function getUserExerciseHistory(userId: string, exerciseId?: string, limit = 50) {
  try {
    const prefix = exerciseId 
      ? `exercise_session:${userId}:${exerciseId}:` 
      : `exercise_session:${userId}:`
    
    const sessions = await kv.getByPrefix(prefix)
    
    // Sort by date descending
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, limit)
    
    return { success: true, sessions: sortedSessions }
  } catch (error) {
    console.error('Error getting exercise history:', error)
    return { success: false, error: error.message }
  }
}

// Get personal records for all exercises
export async function getPersonalRecords(userId: string) {
  try {
    const allStats = await kv.getByPrefix(`exercise_stats:${userId}:`)
    
    const personalRecords: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } } = {}
    
    allStats.forEach((stats: UserExerciseStats) => {
      personalRecords[stats.exerciseId] = {
        weight: stats.personalRecord.weight,
        maxReps: stats.personalRecord.reps,
        date: new Date(stats.personalRecord.date)
      }
    })
    
    return { success: true, personalRecords }
  } catch (error) {
    console.error('Error getting personal records:', error)
    return { success: false, error: error.message }
  }
}

// Delete exercise session
export async function deleteExerciseSession(userId: string, sessionId: string) {
  try {
    // Verify session belongs to user
    const session = await kv.get(`exercise_session:${sessionId}`) as ExerciseRecord | null
    
    if (!session || session.userId !== userId) {
      return { success: false, error: 'Session not found or unauthorized' }
    }
    
    await kv.del(`exercise_session:${sessionId}`)
    
    // Note: In a production app, you might want to recalculate stats after deletion
    // For simplicity, we're not doing that here
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting exercise session:', error)
    return { success: false, error: error.message }
  }
}

// Get workout analytics
export async function getWorkoutAnalytics(userId: string, timeframe = '30') {
  try {
    const sessions = await kv.getByPrefix(`exercise_session:${userId}:`)
    
    const timeframeMs = parseInt(timeframe) * 24 * 60 * 60 * 1000
    const cutoffDate = new Date(Date.now() - timeframeMs)
    
    const recentSessions = sessions.filter(session => 
      new Date(session.date) >= cutoffDate
    )
    
    const analytics = {
      totalWorkouts: recentSessions.length,
      totalVolume: recentSessions.reduce((sum, session) => 
        sum + (session.weight * session.reps * session.sets), 0
      ),
      totalCalories: recentSessions.reduce((sum, session) => 
        sum + (session.caloriesBurned || 0), 0
      ),
      exerciseBreakdown: {} as { [exerciseId: string]: number },
      weeklyProgress: [] as { date: string, volume: number, workouts: number }[]
    }
    
    // Calculate exercise breakdown
    recentSessions.forEach(session => {
      analytics.exerciseBreakdown[session.exerciseId] = 
        (analytics.exerciseBreakdown[session.exerciseId] || 0) + 1
    })
    
    // Calculate weekly progress
    const weeklyData: { [week: string]: { volume: number, workouts: number } } = {}
    
    recentSessions.forEach(session => {
      const sessionDate = new Date(session.date)
      const weekStart = new Date(sessionDate)
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { volume: 0, workouts: 0 }
      }
      
      weeklyData[weekKey].volume += session.weight * session.reps * session.sets
      weeklyData[weekKey].workouts += 1
    })
    
    analytics.weeklyProgress = Object.entries(weeklyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return { success: true, analytics }
  } catch (error) {
    console.error('Error getting workout analytics:', error)
    return { success: false, error: error.message }
  }
}

// Custom exercise management
export async function saveCustomExercise(userId: string, exercise: any) {
  try {
    const exerciseId = `custom_exercise_${userId}_${Date.now()}`
    const customExercise = {
      ...exercise,
      id: exerciseId,
      userId,
      isCustom: true,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`custom_exercise:${userId}:${exerciseId}`, customExercise)
    
    return { success: true, exerciseId }
  } catch (error) {
    console.error('Error saving custom exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserCustomExercises(userId: string) {
  try {
    const customExercises = await kv.getByPrefix(`custom_exercise:${userId}:`)
    return { success: true, exercises: customExercises }
  } catch (error) {
    console.error('Error getting custom exercises:', error)
    return { success: false, error: error.message }
  }
}
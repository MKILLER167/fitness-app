export interface WorkoutRecord {
  id: string
  exerciseId: string
  date: Date
  sets: {
    reps: number
    weight: number
    restTime?: number
  }[]
  notes?: string
}

export interface WorkoutData {
  sets: { reps: number; weight: number }[]
  notes: string
}
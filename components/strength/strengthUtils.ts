import type { WorkoutRecord } from './strengthTypes'

export function getPersonalRecords(workoutRecords: WorkoutRecord[]): { [exerciseId: string]: { weight: number, maxReps: number, date: Date } } {
  const records: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } } = {}
  
  workoutRecords.forEach(record => {
    const maxWeight = Math.max(...record.sets.map(set => set.weight))
    const maxReps = Math.max(...record.sets.map(set => set.reps))
    
    if (!records[record.exerciseId] || maxWeight > records[record.exerciseId].weight) {
      records[record.exerciseId] = {
        weight: maxWeight,
        maxReps: maxReps,
        date: record.date
      }
    }
  })
  
  return records
}

export function checkTierRequirements(
  tier: import('./strengthTiers').StrengthTier, 
  personalRecords: { [exerciseId: string]: { weight: number, maxReps: number, date: Date } }
): boolean {
  return tier.requirements.every(req => {
    const pr = personalRecords[req.exerciseId]
    if (!pr) return false
    return pr.weight >= req.targetWeight && pr.maxReps >= req.targetReps
  })
}

export function loadWorkoutRecords(): WorkoutRecord[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('strength_records')
    if (saved) {
      return JSON.parse(saved).map((r: any) => ({
        ...r,
        date: new Date(r.date)
      }))
    }
  }
  return []
}

export function saveWorkoutRecords(records: WorkoutRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('strength_records', JSON.stringify(records))
  }
}
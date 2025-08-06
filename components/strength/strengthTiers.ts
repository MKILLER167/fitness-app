export interface StrengthTier {
  id: string
  name: string
  level: number
  requirements: {
    exerciseId: string
    exerciseName: string
    targetWeight: number
    targetReps: number
  }[]
  rewards: {
    xp: number
    title: string
    badge: string
  }
  unlocked: boolean
}

export const DEFAULT_STRENGTH_TIERS: StrengthTier[] = [
  {
    id: 'novice',
    name: 'Novice Lifter',
    level: 1,
    requirements: [
      { exerciseId: 'bench_press', exerciseName: 'Bench Press', targetWeight: 60, targetReps: 5 },
      { exerciseId: 'squat', exerciseName: 'Back Squat', targetWeight: 80, targetReps: 5 },
      { exerciseId: 'deadlift', exerciseName: 'Deadlift', targetWeight: 100, targetReps: 5 }
    ],
    rewards: { xp: 100, title: 'Iron Novice', badge: '🥉' },
    unlocked: false
  },
  {
    id: 'intermediate',
    name: 'Intermediate Lifter',
    level: 2,
    requirements: [
      { exerciseId: 'bench_press', exerciseName: 'Bench Press', targetWeight: 80, targetReps: 5 },
      { exerciseId: 'squat', exerciseName: 'Back Squat', targetWeight: 120, targetReps: 5 },
      { exerciseId: 'deadlift', exerciseName: 'Deadlift', targetWeight: 140, targetReps: 5 }
    ],
    rewards: { xp: 250, title: 'Steel Warrior', badge: '🥈' },
    unlocked: false
  },
  {
    id: 'advanced',
    name: 'Advanced Lifter',
    level: 3,
    requirements: [
      { exerciseId: 'bench_press', exerciseName: 'Bench Press', targetWeight: 100, targetReps: 5 },
      { exerciseId: 'squat', exerciseName: 'Back Squat', targetWeight: 160, targetReps: 5 },
      { exerciseId: 'deadlift', exerciseName: 'Deadlift', targetWeight: 180, targetReps: 5 }
    ],
    rewards: { xp: 500, title: 'Iron Champion', badge: '🥇' },
    unlocked: false
  },
  {
    id: 'elite',
    name: 'Elite Lifter',
    level: 4,
    requirements: [
      { exerciseId: 'bench_press', exerciseName: 'Bench Press', targetWeight: 140, targetReps: 5 },
      { exerciseId: 'squat', exerciseName: 'Back Squat', targetWeight: 200, targetReps: 5 },
      { exerciseId: 'deadlift', exerciseName: 'Deadlift', targetWeight: 220, targetReps: 5 }
    ],
    rewards: { xp: 1000, title: 'Strength Legend', badge: '👑' },
    unlocked: false
  }
]
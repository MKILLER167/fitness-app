export interface ExerciseTier {
  id: string
  name: string
  description: string
  icon: string
  weightRequirement: number // in kg
  repsRequirement?: number
  color: string
  gradient: string
  level: number
  badge3d: string
  achievement: {
    title: string
    subtitle: string
    xpReward: number
    badgeType: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary'
  }
}

export interface ExerciseTierProgress {
  exerciseId: string
  currentTier: number
  highestWeight: number
  highestReps: number
  unlockedTiers: number[]
  totalWorkouts: number
  lastWorkout?: Date
}

// Tier definitions for each exercise
export const EXERCISE_TIERS: Record<string, ExerciseTier[]> = {
  bench_press: [
    {
      id: 'bench_rookie',
      name: 'Rookie Presser',
      description: 'First steps into bench pressing',
      icon: '🥉',
      weightRequirement: 40,
      repsRequirement: 5,
      color: 'from-amber-600 to-yellow-500',
      gradient: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      level: 1,
      badge3d: '🏅',
      achievement: {
        title: 'Rookie Presser',
        subtitle: 'First bench press milestone achieved!',
        xpReward: 100,
        badgeType: 'bronze'
      }
    },
    {
      id: 'bench_warrior',
      name: 'Bench Warrior',
      description: 'Building serious chest strength',
      icon: '🥈',
      weightRequirement: 60,
      repsRequirement: 5,
      color: 'from-gray-400 to-gray-600',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600',
      level: 2,
      badge3d: '🛡️',
      achievement: {
        title: 'Bench Warrior',
        subtitle: 'Chest strength is growing strong!',
        xpReward: 200,
        badgeType: 'silver'
      }
    },
    {
      id: 'bench_champion',
      name: 'Bench Champion',
      description: 'Elite level bench pressing',
      icon: '🥇',
      weightRequirement: 80,
      repsRequirement: 5,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      level: 3,
      badge3d: '👑',
      achievement: {
        title: 'Bench Champion',
        subtitle: 'You are a bench press master!',
        xpReward: 300,
        badgeType: 'gold'
      }
    },
    {
      id: 'bench_legend',
      name: 'Bench Legend',
      description: 'Legendary pressing power',
      icon: '💎',
      weightRequirement: 100,
      repsRequirement: 5,
      color: 'from-purple-600 to-blue-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
      level: 4,
      badge3d: '💎',
      achievement: {
        title: 'Bench Legend',
        subtitle: 'Legendary strength achieved!',
        xpReward: 500,
        badgeType: 'platinum'
      }
    },
    {
      id: 'bench_titan',
      name: 'Bench Titan',
      description: 'Titan-level strength',
      icon: '⚡',
      weightRequirement: 120,
      repsRequirement: 5,
      color: 'from-cyan-400 to-blue-600',
      gradient: 'bg-gradient-to-r from-cyan-400 to-blue-600',
      level: 5,
      badge3d: '⚡',
      achievement: {
        title: 'Bench Titan',
        subtitle: 'Titan strength unlocked!',
        xpReward: 750,
        badgeType: 'diamond'
      }
    },
    {
      id: 'bench_supreme',
      name: 'Bench Supreme',
      description: 'Supreme pressing mastery',
      icon: '🌟',
      weightRequirement: 150,
      repsRequirement: 5,
      color: 'from-pink-500 to-purple-600',
      gradient: 'bg-gradient-to-r from-pink-500 to-purple-600',
      level: 6,
      badge3d: '🌟',
      achievement: {
        title: 'Bench Supreme',
        subtitle: 'Supreme mastery achieved!',
        xpReward: 1000,
        badgeType: 'legendary'
      }
    }
  ],
  squat: [
    {
      id: 'squat_rookie',
      name: 'Squat Apprentice',
      description: 'Learning the king of exercises',
      icon: '🥉',
      weightRequirement: 50,
      repsRequirement: 5,
      color: 'from-amber-600 to-yellow-500',
      gradient: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      level: 1,
      badge3d: '🏅',
      achievement: {
        title: 'Squat Apprentice',
        subtitle: 'First squat milestone reached!',
        xpReward: 100,
        badgeType: 'bronze'
      }
    },
    {
      id: 'squat_warrior',
      name: 'Leg Warrior',
      description: 'Building powerful legs',
      icon: '🥈',
      weightRequirement: 80,
      repsRequirement: 5,
      color: 'from-gray-400 to-gray-600',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600',
      level: 2,
      badge3d: '🦵',
      achievement: {
        title: 'Leg Warrior',
        subtitle: 'Leg power is building up!',
        xpReward: 200,
        badgeType: 'silver'
      }
    },
    {
      id: 'squat_champion',
      name: 'Squat King',
      description: 'Mastering the squat',
      icon: '🥇',
      weightRequirement: 100,
      repsRequirement: 5,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      level: 3,
      badge3d: '👑',
      achievement: {
        title: 'Squat King',
        subtitle: 'You rule the squat rack!',
        xpReward: 300,
        badgeType: 'gold'
      }
    },
    {
      id: 'squat_legend',
      name: 'Squat Titan',
      description: 'Legendary leg strength',
      icon: '💎',
      weightRequirement: 140,
      repsRequirement: 5,
      color: 'from-purple-600 to-blue-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
      level: 4,
      badge3d: '💎',
      achievement: {
        title: 'Squat Titan',
        subtitle: 'Titanium legs achieved!',
        xpReward: 500,
        badgeType: 'platinum'
      }
    },
    {
      id: 'squat_supreme',
      name: 'Squat Supreme',
      description: 'Supreme squatting power',
      icon: '🌟',
      weightRequirement: 180,
      repsRequirement: 5,
      color: 'from-pink-500 to-purple-600',
      gradient: 'bg-gradient-to-r from-pink-500 to-purple-600',
      level: 5,
      badge3d: '🌟',
      achievement: {
        title: 'Squat Supreme',
        subtitle: 'Supreme leg power unlocked!',
        xpReward: 1000,
        badgeType: 'legendary'
      }
    }
  ],
  deadlift: [
    {
      id: 'deadlift_rookie',
      name: 'Deadlift Novice',
      description: 'Starting the journey of pulls',
      icon: '🥉',
      weightRequirement: 60,
      repsRequirement: 5,
      color: 'from-amber-600 to-yellow-500',
      gradient: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      level: 1,
      badge3d: '🏅',
      achievement: {
        title: 'Deadlift Novice',
        subtitle: 'First pull from the ground!',
        xpReward: 100,
        badgeType: 'bronze'
      }
    },
    {
      id: 'deadlift_warrior',
      name: 'Pull Warrior',
      description: 'Building serious pulling power',
      icon: '🥈',
      weightRequirement: 100,
      repsRequirement: 5,
      color: 'from-gray-400 to-gray-600',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600',
      level: 2,
      badge3d: '💪',
      achievement: {
        title: 'Pull Warrior',
        subtitle: 'Back strength is growing!',
        xpReward: 200,
        badgeType: 'silver'
      }
    },
    {
      id: 'deadlift_champion',
      name: 'Deadlift Master',
      description: 'Elite pulling strength',
      icon: '🥇',
      weightRequirement: 140,
      repsRequirement: 5,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      level: 3,
      badge3d: '👑',
      achievement: {
        title: 'Deadlift Master',
        subtitle: 'You master the deadlift!',
        xpReward: 300,
        badgeType: 'gold'
      }
    },
    {
      id: 'deadlift_legend',
      name: 'Pull Titan',
      description: 'Legendary deadlifting power',
      icon: '💎',
      weightRequirement: 180,
      repsRequirement: 5,
      color: 'from-purple-600 to-blue-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
      level: 4,
      badge3d: '💎',
      achievement: {
        title: 'Pull Titan',
        subtitle: 'Legendary pulling power!',
        xpReward: 500,
        badgeType: 'platinum'
      }
    },
    {
      id: 'deadlift_supreme',
      name: 'Deadlift Supreme',
      description: 'Supreme pulling strength',
      icon: '🌟',
      weightRequirement: 220,
      repsRequirement: 5,
      color: 'from-pink-500 to-purple-600',
      gradient: 'bg-gradient-to-r from-pink-500 to-purple-600',
      level: 5,
      badge3d: '🌟',
      achievement: {
        title: 'Deadlift Supreme',
        subtitle: 'Supreme strength achieved!',
        xpReward: 1000,
        badgeType: 'legendary'
      }
    }
  ],
  overhead_press: [
    {
      id: 'ohp_rookie',
      name: 'Press Novice',
      description: 'Learning overhead strength',
      icon: '🥉',
      weightRequirement: 30,
      repsRequirement: 5,
      color: 'from-amber-600 to-yellow-500',
      gradient: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      level: 1,
      badge3d: '🏅',
      achievement: {
        title: 'Press Novice',
        subtitle: 'First overhead press!',
        xpReward: 100,
        badgeType: 'bronze'
      }
    },
    {
      id: 'ohp_warrior',
      name: 'Shoulder Warrior',
      description: 'Building shoulder strength',
      icon: '🥈',
      weightRequirement: 50,
      repsRequirement: 5,
      color: 'from-gray-400 to-gray-600',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600',
      level: 2,
      badge3d: '💪',
      achievement: {
        title: 'Shoulder Warrior',
        subtitle: 'Strong shoulders achieved!',
        xpReward: 200,
        badgeType: 'silver'
      }
    },
    {
      id: 'ohp_champion',
      name: 'Press Champion',
      description: 'Elite overhead pressing',
      icon: '🥇',
      weightRequirement: 70,
      repsRequirement: 5,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      level: 3,
      badge3d: '👑',
      achievement: {
        title: 'Press Champion',
        subtitle: 'Overhead press mastery!',
        xpReward: 300,
        badgeType: 'gold'
      }
    },
    {
      id: 'ohp_legend',
      name: 'Press Legend',
      description: 'Legendary pressing power',
      icon: '💎',
      weightRequirement: 90,
      repsRequirement: 5,
      color: 'from-purple-600 to-blue-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
      level: 4,
      badge3d: '💎',
      achievement: {
        title: 'Press Legend',
        subtitle: 'Legendary overhead strength!',
        xpReward: 500,
        badgeType: 'platinum'
      }
    }
  ],
  pull_up: [
    {
      id: 'pullup_rookie',
      name: 'Pull Rookie',
      description: 'First pull-ups achieved',
      icon: '🥉',
      weightRequirement: 0, // bodyweight
      repsRequirement: 5,
      color: 'from-amber-600 to-yellow-500',
      gradient: 'bg-gradient-to-r from-amber-600 to-yellow-500',
      level: 1,
      badge3d: '🏅',
      achievement: {
        title: 'Pull Rookie',
        subtitle: 'First 5 pull-ups completed!',
        xpReward: 100,
        badgeType: 'bronze'
      }
    },
    {
      id: 'pullup_warrior',
      name: 'Pull Warrior',
      description: 'Strong pulling power',
      icon: '🥈',
      weightRequirement: 0,
      repsRequirement: 10,
      color: 'from-gray-400 to-gray-600',
      gradient: 'bg-gradient-to-r from-gray-400 to-gray-600',
      level: 2,
      badge3d: '💪',
      achievement: {
        title: 'Pull Warrior',
        subtitle: '10 pull-ups mastered!',
        xpReward: 200,
        badgeType: 'silver'
      }
    },
    {
      id: 'pullup_champion',
      name: 'Pull Champion',
      description: 'Elite pulling endurance',
      icon: '🥇',
      weightRequirement: 0,
      repsRequirement: 15,
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      level: 3,
      badge3d: '👑',
      achievement: {
        title: 'Pull Champion',
        subtitle: '15 pull-ups champion!',
        xpReward: 300,
        badgeType: 'gold'
      }
    },
    {
      id: 'pullup_legend',
      name: 'Pull Legend',
      description: 'Legendary pull-up power',
      icon: '💎',
      weightRequirement: 0,
      repsRequirement: 20,
      color: 'from-purple-600 to-blue-600',
      gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
      level: 4,
      badge3d: '💎',
      achievement: {
        title: 'Pull Legend',
        subtitle: '20 pull-ups legend!',
        xpReward: 500,
        badgeType: 'platinum'
      }
    }
  ]
}

// Utility functions for tier management
export const getTierForExercise = (exerciseId: string, weight: number, reps: number): ExerciseTier | null => {
  const tiers = EXERCISE_TIERS[exerciseId]
  if (!tiers) return null

  // Find the highest tier that the user qualifies for
  for (let i = tiers.length - 1; i >= 0; i--) {
    const tier = tiers[i]
    const meetsWeight = weight >= tier.weightRequirement
    const meetsReps = !tier.repsRequirement || reps >= tier.repsRequirement
    
    if (meetsWeight && meetsReps) {
      return tier
    }
  }
  
  return null
}

export const getNextTierForExercise = (exerciseId: string, weight: number, reps: number): ExerciseTier | null => {
  const tiers = EXERCISE_TIERS[exerciseId]
  if (!tiers) return null

  const currentTier = getTierForExercise(exerciseId, weight, reps)
  if (!currentTier) return tiers[0] // Return first tier if no tier achieved

  const currentIndex = tiers.findIndex(tier => tier.id === currentTier.id)
  if (currentIndex >= 0 && currentIndex < tiers.length - 1) {
    return tiers[currentIndex + 1]
  }
  
  return null // Already at highest tier
}

export const calculateTierProgress = (exerciseId: string, weight: number, reps: number): number => {
  const nextTier = getNextTierForExercise(exerciseId, weight, reps)
  if (!nextTier) return 100 // At max tier

  const weightProgress = Math.min((weight / nextTier.weightRequirement) * 100, 100)
  const repsProgress = nextTier.repsRequirement ? Math.min((reps / nextTier.repsRequirement) * 100, 100) : 100
  
  return Math.min(weightProgress, repsProgress)
}
"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import type { UserProfile } from './Onboarding'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface FitnessStats {
  physical: number
  mental: number
  nutrition: number
  discipline: number
  endurance: number
  motivation: number
  overall: number
}

interface FitnessRadarChartProps {
  userProfile?: UserProfile
  userStats?: UserStats
  className?: string
}

export function FitnessRadarChart({ userProfile, userStats, className = "" }: FitnessRadarChartProps) {
  const [fitnessStats, setFitnessStats] = useState<FitnessStats>({
    physical: 25,
    mental: 45,
    nutrition: 53,
    discipline: 20,
    endurance: 30,
    motivation: 43,
    overall: 37
  })

  const { language, direction } = useLanguage()

  // Calculate fitness stats based on user data
  useEffect(() => {
    if (!userStats || !userProfile) {
      // Use exact values from the image
      setFitnessStats({
        physical: 25,
        mental: 45,
        nutrition: 53,
        discipline: 20,
        endurance: 30,
        motivation: 43,
        overall: 37
      })
      return
    }

    // Calculate stats based on actual user data
    const physical = Math.min(100, (userStats.tiersUnlocked * 15) + (userStats.workoutsCompleted * 2) + 25)
    const mental = Math.min(100, (userStats.level * 10) + (userStats.achievements * 5) + 35)
    const nutrition = Math.min(100, Math.random() * 40 + 40)
    const discipline = Math.min(100, (userStats.workoutsCompleted * 3) + 20)
    const endurance = Math.min(100, (userStats.workoutsCompleted * 2.5) + 30)
    const motivation = Math.min(100, (userStats.level * 8) + (userStats.achievements * 3) + 40)
    const overall = Math.round((physical + mental + nutrition + discipline + endurance + motivation) / 6)

    setFitnessStats({
      physical,
      mental,
      nutrition,
      discipline,
      endurance,
      motivation,
      overall
    })
  }, [userStats, userProfile])

  // Attributes positioned around the circle
  const attributes = [
    { 
      key: 'physical', 
      label: language === 'ar' ? 'جسدي' : 'PHYSICAL',
      angle: 0,
      value: fitnessStats.physical
    },
    { 
      key: 'nutrition', 
      label: language === 'ar' ? 'تغذية' : 'NUTRITION',
      angle: 60,
      value: fitnessStats.nutrition
    },
    { 
      key: 'discipline', 
      label: language === 'ar' ? 'انضباط' : 'DISCIPLINE',
      angle: 120,
      value: fitnessStats.discipline
    },
    { 
      key: 'mental', 
      label: language === 'ar' ? 'عقلي' : 'MENTAL',
      angle: 180,
      value: fitnessStats.mental
    },
    { 
      key: 'endurance', 
      label: language === 'ar' ? 'تحمل' : 'ENDURANCE',
      angle: 240,
      value: fitnessStats.endurance
    },
    { 
      key: 'motivation', 
      label: language === 'ar' ? 'حافز' : 'MOTIVATION',
      angle: 300,
      value: fitnessStats.motivation
    }
  ]

  return (
    <div className={`relative ${className}`} dir={direction}>
      {/* Circular Chart */}
      <div className="relative w-72 h-72 mx-auto mb-8">
        
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-2 border-border opacity-20"></div>
        
        {/* Attribute Labels positioned around the circle */}
        {attributes.map((attr, index) => {
          const angle = (attr.angle - 90) * (Math.PI / 180)
          const radius = 120
          const x = 144 + radius * Math.cos(angle)
          const y = 144 + radius * Math.sin(angle)
          
          return (
            <motion.div
              key={attr.key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            >
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {attr.label}
              </div>
              <div className="text-base font-semibold text-foreground ltr-numbers">
                {Math.round(attr.value)}
              </div>
            </motion.div>
          )
        })}

        {/* Center Total Score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center bg-background rounded-full w-24 h-24 flex flex-col items-center justify-center border border-border shadow-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-2xl font-bold text-foreground ltr-numbers">
              {fitnessStats.overall}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {language === 'ar' ? 'الإجمالي' : 'TOTAL'}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Organized Attribute Grid */}
      <motion.div
        className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {attributes.map((attr) => (
          <div key={`grid-${attr.key}`} className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
              {attr.label}
            </div>
            <div className="text-sm font-semibold text-foreground ltr-numbers">
              {Math.round(attr.value)}%
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
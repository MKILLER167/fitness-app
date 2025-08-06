"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Trophy, 
  Star, 
  Sparkles, 
  X, 
  Share2,
  Bookmark,
  Play
} from 'lucide-react'
import { ExerciseTier } from './exerciseTiers'
import { toast } from 'sonner@2.0.3'

interface TierAchievementPopupProps {
  tier: ExerciseTier | null
  exerciseName: string
  isVisible: boolean
  onClose: () => void
  onShare?: () => void
  onSaveToFavorites?: () => void
}

export function TierAchievementPopup({ 
  tier, 
  exerciseName, 
  isVisible, 
  onClose, 
  onShare, 
  onSaveToFavorites 
}: TierAchievementPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible && tier) {
      setShowConfetti(true)
      // Auto-hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, tier])

  if (!tier) return null

  const getBadgeStyle = (badgeType: string) => {
    switch (badgeType) {
      case 'bronze':
        return 'from-amber-600 to-yellow-600 text-white'
      case 'silver':
        return 'from-gray-400 to-gray-600 text-white'
      case 'gold':
        return 'from-yellow-400 to-orange-500 text-white'
      case 'platinum':
        return 'from-purple-500 to-blue-600 text-white'
      case 'diamond':
        return 'from-cyan-400 to-blue-600 text-white'
      case 'legendary':
        return 'from-pink-500 to-purple-600 text-white'
      default:
        return 'from-gray-400 to-gray-600 text-white'
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      navigator.clipboard.writeText(
        `🎉 Just unlocked ${tier.achievement.title} in ${exerciseName}! 💪 #FitTracker #Achievement`
      )
      toast.success('Achievement copied to clipboard!')
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -10,
                    opacity: 1,
                    scale: Math.random() * 0.8 + 0.2
                  }}
                  animate={{
                    y: window.innerHeight + 10,
                    x: Math.random() * window.innerWidth,
                    opacity: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    ease: "easeOut",
                    delay: Math.random() * 1
                  }}
                  className={`absolute w-3 h-3 ${
                    Math.random() > 0.5 ? 'bg-yellow-400' : 
                    Math.random() > 0.5 ? 'bg-orange-500' : 'bg-red-500'
                  } rounded-full`}
                />
              ))}
            </div>
          )}

          {/* Main Achievement Card */}
          <motion.div
            initial={{ scale: 0, rotateY: -180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0, rotateY: 180, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 300,
              duration: 0.8
            }}
            className="relative w-full max-w-md z-10"
          >
            <Card className="overflow-hidden border-2 border-golden bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
              
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full bg-white/80 hover:bg-white/90 dark:bg-gray-800/80"
                >
                  <X size={16} />
                </Button>
              </div>

              <CardContent className="p-8 text-center space-y-6">
                {/* Achievement Badge with 3D Effect */}
                <motion.div
                  initial={{ scale: 0, rotateY: -90 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                  className="relative"
                >
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} rounded-full shadow-lg transform rotate-3`} />
                    <div className={`absolute inset-1 bg-gradient-to-br ${tier.color} rounded-full shadow-inner`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl drop-shadow-lg">{tier.badge3d}</span>
                    </div>
                    {/* Sparkle effects */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="text-yellow-400" size={16} />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute -bottom-2 -left-2"
                    >
                      <Star className="text-orange-400" size={14} />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Achievement Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      🎉 NEW ACHIEVEMENT! 🎉
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {tier.achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.achievement.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exercise: <span className="font-bold">{exerciseName}</span>
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        className={`bg-gradient-to-r ${getBadgeStyle(tier.achievement.badgeType)} border-0 shadow-md`}
                      >
                        {tier.achievement.badgeType.toUpperCase()} TIER
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        +{tier.achievement.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Requirements Met */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Requirements Met
                    </span>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                    {tier.weightRequirement > 0 && (
                      <div>Weight: {tier.weightRequirement}kg+</div>
                    )}
                    {tier.repsRequirement && (
                      <div>Reps: {tier.repsRequirement}+</div>
                    )}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    onClick={handleShare}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Share2 size={16} className="mr-1" />
                    Share
                  </Button>
                  {onSaveToFavorites && (
                    <Button
                      variant="outline"
                      onClick={onSaveToFavorites}
                      className="flex-1"
                    >
                      <Bookmark size={16} className="mr-1" />
                      Save
                    </Button>
                  )}
                </motion.div>

                {/* Continue Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    className="w-full mt-2 text-muted-foreground hover:text-foreground"
                  >
                    Continue Training
                    <Play size={16} className="ml-1" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
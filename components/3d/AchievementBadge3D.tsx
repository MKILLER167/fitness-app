"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LucideIcon, Star, Trophy, Medal, Crown, Award } from 'lucide-react'

interface AchievementBadge3DProps {
  title: string
  description: string
  icon?: LucideIcon
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  unlocked?: boolean
  progress?: number
  showUnlockAnimation?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  glowIntensity?: 'low' | 'medium' | 'high'
}

export function AchievementBadge3D({
  title,
  description,
  icon,
  tier,
  unlocked = false,
  progress = 0,
  showUnlockAnimation = false,
  onClick,
  size = 'md',
  glowIntensity = 'medium'
}: AchievementBadge3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  const tierConfigs = {
    bronze: {
      gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)',
      shadowColor: '#CD7F32',
      icon: Medal,
      glow: 'rgba(205, 127, 50, 0.4)'
    },
    silver: {
      gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
      shadowColor: '#C0C0C0',
      icon: Award,
      glow: 'rgba(192, 192, 192, 0.4)'
    },
    gold: {
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      shadowColor: '#FFD700',
      icon: Trophy,
      glow: 'rgba(255, 215, 0, 0.5)'
    },
    platinum: {
      gradient: 'linear-gradient(135deg, #E5E4E2 0%, #B8B8B8 100%)',
      shadowColor: '#E5E4E2',
      icon: Star,
      glow: 'rgba(229, 228, 226, 0.5)'
    },
    diamond: {
      gradient: 'linear-gradient(135deg, #B9F2FF 0%, #00BFFF 100%)',
      shadowColor: '#B9F2FF',
      icon: Crown,
      glow: 'rgba(185, 242, 255, 0.6)'
    }
  }

  const sizeConfigs = {
    sm: { width: 80, height: 80, iconSize: 20 },
    md: { width: 100, height: 100, iconSize: 24 },
    lg: { width: 120, height: 120, iconSize: 28 }
  }

  const tierConfig = tierConfigs[tier]
  const sizeConfig = sizeConfigs[size]
  const IconComponent = icon || tierConfig.icon

  // Trigger particle animation on unlock
  useEffect(() => {
    if (showUnlockAnimation && unlocked) {
      setShowParticles(true)
      const timer = setTimeout(() => setShowParticles(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showUnlockAnimation, unlocked])

  const glowOpacity = {
    low: 0.3,
    medium: 0.5,
    high: 0.7
  }

  return (
    <div className="relative inline-block">
      <motion.div
        className="achievement-badge-3d relative cursor-pointer"
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          perspective: '300px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          y: isHovered ? -8 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: showUnlockAnimation ? 0.5 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Main Badge */}
        <motion.div
          className="badge-face absolute inset-0 rounded-full border-2 border-white/20"
          style={{
            background: unlocked ? tierConfig.gradient : 'linear-gradient(135deg, #333 0%, #666 100%)',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)'
          }}
          animate={{
            rotateY: isHovered ? 15 : 0,
            rotateX: isHovered ? -10 : 0,
            boxShadow: unlocked 
              ? `0 15px 35px ${tierConfig.glow}, 0 5px 15px rgba(0,0,0,0.3)`
              : '0 8px 20px rgba(0,0,0,0.3)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotateZ: unlocked && isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ 
                rotateZ: { duration: 0.6 },
                scale: { duration: 0.2 }
              }}
            >
              <IconComponent 
                size={sizeConfig.iconSize} 
                className={unlocked ? 'text-white' : 'text-gray-400'}
              />
            </motion.div>
          </div>

          {/* Progress Ring */}
          {!unlocked && progress > 0 && (
            <motion.svg
              className="absolute inset-0 w-full h-full"
              style={{ transform: 'rotate(-90deg)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  pathLength: progress / 100,
                  strokeDasharray: '1 1',
                  strokeDashoffset: 0
                }}
              />
            </motion.svg>
          )}
        </motion.div>

        {/* Badge Depth Layers */}
        <motion.div
          className="absolute inset-1 rounded-full opacity-60"
          style={{
            background: unlocked ? tierConfig.gradient : 'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)',
            transform: 'translateZ(5px)',
            filter: 'brightness(0.8)'
          }}
          animate={{
            rotateY: isHovered ? 12 : 0,
            rotateX: isHovered ? -8 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-2 rounded-full opacity-40"
          style={{
            background: unlocked ? tierConfig.gradient : 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
            transform: 'translateZ(0px)',
            filter: 'brightness(0.6)'
          }}
          animate={{
            rotateY: isHovered ? 8 : 0,
            rotateX: isHovered ? -5 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow Effect */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: tierConfig.gradient,
              filter: 'blur(15px)',
              opacity: glowOpacity[glowIntensity],
              zIndex: -1
            }}
            animate={{
              scale: isHovered ? 1.5 : 1.2,
              opacity: isHovered ? glowOpacity[glowIntensity] * 1.5 : glowOpacity[glowIntensity]
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Shine Effect */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: [-100, 200],
                rotate: [0, 360]
              }}
              transition={{
                x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
              style={{ transform: 'rotate(45deg)' }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Particles Effect */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: tierConfig.gradient,
                  left: '50%',
                  top: '50%'
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 30) * 60,
                  y: Math.sin(i * 30) * 60,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: i * 0.1
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50"
          style={{ minWidth: '150px' }}
        >
          <div className="font-semibold">{title}</div>
          <div className="text-gray-300 text-xs mt-1">{description}</div>
          {!unlocked && progress > 0 && (
            <div className="text-xs text-blue-400 mt-1">
              Progress: {progress}%
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
        </motion.div>
      )}
    </div>
  )
}
"use client"

import { useState } from 'react'
import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface FlipCard3DProps {
  frontTitle: string
  frontDescription: string
  frontIcon?: LucideIcon
  backTitle: string
  backDescription: string
  backContent?: React.ReactNode
  gradient?: string
  onAction?: () => void
  actionLabel?: string
  badge?: string
  autoFlip?: boolean
  autoFlipDelay?: number
  size?: 'sm' | 'md' | 'lg'
  glowEffect?: boolean
}

export function FlipCard3D({
  frontTitle,
  frontDescription,
  frontIcon: FrontIcon,
  backTitle,
  backDescription,
  backContent,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  onAction,
  actionLabel = 'Explore',
  badge,
  autoFlip = false,
  autoFlipDelay = 3000,
  size = 'md',
  glowEffect = true
}: FlipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-72 h-48',
    lg: 'w-80 h-56'
  }

  // Auto flip functionality
  useState(() => {
    if (autoFlip) {
      const interval = setInterval(() => {
        setIsFlipped(prev => !prev)
      }, autoFlipDelay)
      return () => clearInterval(interval)
    }
  }, [autoFlip, autoFlipDelay])

  return (
    <div 
      className={`flip-card-container ${sizeClasses[size]} cursor-pointer`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="flip-card-inner relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ 
          transformStyle: 'preserve-3d',
          background: gradient
        }}
      >
        {/* Front Side */}
        <div 
          className="flip-card-face flip-card-front absolute inset-0 w-full h-full rounded-xl p-6 flex flex-col justify-between"
          style={{ 
            backfaceVisibility: 'hidden',
            background: gradient
          }}
        >
          {badge && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
              className="self-start"
            >
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {badge}
              </Badge>
            </motion.div>
          )}
          
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {FrontIcon && (
              <motion.div
                className="mb-4 p-3 bg-white/20 rounded-full"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 360,
                  rotateX: 180
                }}
                transition={{ duration: 0.6 }}
              >
                <FrontIcon className="text-white" size={32} />
              </motion.div>
            )}
            
            <motion.h3 
              className="text-xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {frontTitle}
            </motion.h3>
            
            <motion.p 
              className="text-white/80 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {frontDescription}
            </motion.p>
          </div>
          
          <motion.div
            className="text-center text-white/60 text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to flip
          </motion.div>
        </div>

        {/* Back Side */}
        <div 
          className="flip-card-face flip-card-back absolute inset-0 w-full h-full rounded-xl p-6 flex flex-col"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.9) 100%), ${gradient}`
          }}
        >
          <motion.h3 
            className="text-xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isFlipped ? 1 : 0, x: isFlipped ? 0 : -20 }}
            transition={{ delay: isFlipped ? 0.4 : 0 }}
          >
            {backTitle}
          </motion.h3>
          
          <motion.p 
            className="text-white/80 text-sm mb-4 flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isFlipped ? 1 : 0, x: isFlipped ? 0 : -20 }}
            transition={{ delay: isFlipped ? 0.5 : 0 }}
          >
            {backDescription}
          </motion.p>
          
          {backContent && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: isFlipped ? 0.6 : 0 }}
            >
              {backContent}
            </motion.div>
          )}
          
          {onAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: isFlipped ? 0.7 : 0 }}
            >
              <Button 
                onClick={(e) => {
                  e.stopPropagation()
                  onAction()
                }}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                {actionLabel}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Glow Effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: gradient,
            filter: 'blur(20px)',
            opacity: 0.3,
            zIndex: -1
          }}
          animate={{
            scale: isFlipped ? 1.1 : 1,
            opacity: isFlipped ? 0.5 : 0.3
          }}
          transition={{ duration: 0.8 }}
        />
      )}

      <style>{`
        .flip-card-container {
          margin: 20px;
        }
        
        .flip-card-inner {
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .flip-card-face {
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .flip-card-container:hover .flip-card-inner {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  )
}
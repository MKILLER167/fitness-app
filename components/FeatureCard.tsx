"use client"

import { useState } from 'react'
import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface FeatureCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  gradient?: string
  onClick?: () => void
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient = 'linear-gradient(to left, #f7ba2b 0%, #ea5358 100%)',
  onClick,
  badge,
  badgeVariant = 'outline',
  disabled = false,
  className = '',
  children,
  size = 'md'
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: 'w-40 h-52',
    md: 'w-48 h-64',
    lg: 'w-56 h-72'
  }

  const contentPadding = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <motion.div
      className={`feature-card ${sizeClasses[size]} ${className}`}
      style={{ 
        '--gradient': gradient,
        background: gradient
      } as React.CSSProperties}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`feature-card-info ${contentPadding[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
          {badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant={badgeVariant} className="mb-2 bg-white/20 text-white border-white/30">
                {badge}
              </Badge>
            </motion.div>
          )}
          
          {Icon && (
            <motion.div
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="text-white" size={24} />
            </motion.div>
          )}
          
          <motion.h3 
            className="feature-card-title text-white font-bold text-lg leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
          
          {description && (
            <motion.p 
              className="text-white/80 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
          
          {children}
          
          {onClick && !disabled && (
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                Explore
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .feature-card {
          padding: 5px;
          border-radius: 1rem;
          overflow: visible;
          position: relative;
          z-index: 1;
        }

        .feature-card::after {
          position: absolute;
          content: "";
          top: 30px;
          left: 0;
          right: 0;
          z-index: -1;
          height: 100%;
          width: 100%;
          transform: scale(0.8);
          filter: blur(25px);
          background: var(--gradient);
          transition: opacity 0.5s;
        }

        .feature-card-info {
          background: #181818;
          color: #181818;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: visible;
          border-radius: 0.7rem;
        }

        .feature-card-title {
          font-weight: bold;
          letter-spacing: 0.1em;
        }

        /* Hover effects */
        .feature-card:hover::after {
          opacity: 0;
        }

        .feature-card:hover .feature-card-info {
          color: #f7ba2b;
          transition: color 1s;
        }

        .feature-card:hover .feature-card-title {
          color: #f7ba2b;
          transition: color 1s;
        }
      `}</style>
    </motion.div>
  )
}
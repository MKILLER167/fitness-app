"use client"

import { useState } from 'react'
import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface FloatingButton3DProps {
  icon: LucideIcon
  label?: string
  onClick: () => void
  gradient?: string
  size?: 'sm' | 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  disabled?: boolean
  badge?: string | number
  pulse?: boolean
  tooltip?: string
}

export function FloatingButton3D({
  icon: Icon,
  label,
  onClick,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  size = 'md',
  position = 'bottom-right',
  disabled = false,
  badge,
  pulse = false,
  tooltip
}: FloatingButton3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const sizeClasses = {
    sm: { width: 48, height: 48, iconSize: 20 },
    md: { width: 56, height: 56, iconSize: 24 },
    lg: { width: 64, height: 64, iconSize: 28 }
  }

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
    'center': 'relative'
  }

  const currentSize = sizeClasses[size]

  return (
    <motion.div
      className={`${positionClasses[position]} z-50`}
      style={{ perspective: '200px' }}
    >
      {/* Tooltip */}
      {tooltip && isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black" />
        </motion.div>
      )}

      <motion.button
        className="floating-button-3d relative rounded-full shadow-lg overflow-hidden"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          background: gradient,
          transformStyle: 'preserve-3d'
        }}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={disabled}
        initial={{ 
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          y: 0
        }}
        animate={{ 
          rotateX: isPressed ? 15 : isHovered ? -10 : 0,
          rotateY: isHovered ? 10 : 0,
          scale: isPressed ? 0.95 : isHovered ? 1.1 : 1,
          y: isHovered ? -4 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Main button surface */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{
            background: gradient,
            transform: 'translateZ(8px)',
            borderRadius: '50%'
          }}
          animate={{
            boxShadow: isHovered 
              ? '0 12px 25px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)'
              : '0 8px 15px rgba(0,0,0,0.3)'
          }}
        >
          <motion.div
            animate={{ 
              rotateZ: isHovered ? 360 : 0,
              scale: isPressed ? 0.8 : 1
            }}
            transition={{ 
              rotateZ: { duration: 0.6 },
              scale: { duration: 0.1 }
            }}
          >
            <Icon size={currentSize.iconSize} />
          </motion.div>
        </motion.div>

        {/* Side faces for 3D effect */}
        <div
          className="absolute inset-0 rounded-full opacity-70"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)`,
            transform: 'rotateY(90deg) translateZ(4px)'
          }}
        />
        
        <div
          className="absolute inset-0 rounded-full opacity-70"
          style={{
            background: `linear-gradient(0deg, transparent, rgba(0,0,0,0.2), transparent)`,
            transform: 'rotateX(90deg) translateZ(4px)'
          }}
        />

        {/* Pulse effect */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: gradient }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            style={{ fontSize: '0.7rem' }}
          >
            {badge}
          </motion.div>
        )}

        {/* Disabled overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-gray-400 opacity-50 rounded-full" />
        )}
      </motion.button>

      {/* Label */}
      {label && (
        <motion.div
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-center font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.div>
      )}

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: gradient,
          filter: 'blur(12px)',
          opacity: 0.3,
          zIndex: -1
        }}
        animate={{
          scale: isHovered ? 1.4 : 1.1,
          opacity: isHovered ? 0.5 : 0.3
        }}
        transition={{ duration: 0.3 }}
      />

      <style>{`
        .floating-button-3d {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-button-3d:hover {
          filter: brightness(1.1);
        }
        
        .floating-button-3d:disabled {
          cursor: not-allowed;
          filter: grayscale(0.5);
        }
      `}</style>
    </motion.div>
  )
}
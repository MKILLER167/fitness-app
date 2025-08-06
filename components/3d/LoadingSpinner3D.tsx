"use client"

import { motion } from 'motion/react'

interface LoadingSpinner3DProps {
  size?: number
  color?: string
  speed?: number
}

export function LoadingSpinner3D({ 
  size = 24, 
  color = '#ffffff', 
  speed = 1 
}: LoadingSpinner3DProps) {
  return (
    <div 
      className="relative inline-block"
      style={{ 
        width: size, 
        height: size,
        perspective: '100px'
      }}
    >
      {/* Main rotating ring */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-full"
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          rotateZ: 360,
          rotateY: 180
        }}
        transition={{
          duration: 1 / speed,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner rotating ring */}
      <motion.div
        className="absolute inset-1 border-2 border-transparent rounded-full"
        style={{
          borderLeftColor: color,
          borderBottomColor: `${color}60`,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          rotateZ: -360,
          rotateX: 180
        }}
        transition={{
          duration: 1.5 / speed,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
        style={{ 
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          transformStyle: 'preserve-3d'
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotateZ: 360
        }}
        transition={{
          duration: 2 / speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
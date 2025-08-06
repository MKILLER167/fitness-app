"use client"

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface CubeFace {
  icon?: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  color: string
  gradient: string
}

interface RotatingCube3DProps {
  faces: CubeFace[]
  autoRotate?: boolean
  rotationSpeed?: number
  size?: number
  onFaceClick?: (faceIndex: number) => void
  glowEffect?: boolean
}

export function RotatingCube3D({
  faces,
  autoRotate = true,
  rotationSpeed = 3000,
  size = 120,
  onFaceClick,
  glowEffect = true
}: RotatingCube3DProps) {
  const [currentFace, setCurrentFace] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto rotation
  useEffect(() => {
    if (autoRotate && !isHovered) {
      const interval = setInterval(() => {
        setCurrentFace(prev => (prev + 1) % faces.length)
      }, rotationSpeed)
      return () => clearInterval(interval)
    }
  }, [autoRotate, rotationSpeed, isHovered, faces.length])

  const getRotation = () => {
    switch (currentFace) {
      case 0: return { rotateX: 0, rotateY: 0 }
      case 1: return { rotateX: 0, rotateY: 90 }
      case 2: return { rotateX: 0, rotateY: 180 }
      case 3: return { rotateX: 0, rotateY: -90 }
      case 4: return { rotateX: 90, rotateY: 0 }
      case 5: return { rotateX: -90, rotateY: 0 }
      default: return { rotateX: 0, rotateY: 0 }
    }
  }

  const handleFaceClick = (faceIndex: number) => {
    setCurrentFace(faceIndex)
    onFaceClick?.(faceIndex)
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className="cube-container relative"
        style={{ 
          width: size,
          height: size,
          perspective: '600px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="cube relative"
          style={{
            width: size,
            height: size,
            transformStyle: 'preserve-3d'
          }}
          animate={getRotation()}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Front Face */}
          {faces[0] && (
            <CubeFaceComponent
              face={faces[0]}
              position="front"
              size={size}
              onClick={() => handleFaceClick(0)}
            />
          )}
          
          {/* Right Face */}
          {faces[1] && (
            <CubeFaceComponent
              face={faces[1]}
              position="right"
              size={size}
              onClick={() => handleFaceClick(1)}
            />
          )}
          
          {/* Back Face */}
          {faces[2] && (
            <CubeFaceComponent
              face={faces[2]}
              position="back"
              size={size}
              onClick={() => handleFaceClick(2)}
            />
          )}
          
          {/* Left Face */}
          {faces[3] && (
            <CubeFaceComponent
              face={faces[3]}
              position="left"
              size={size}
              onClick={() => handleFaceClick(3)}
            />
          )}
          
          {/* Top Face */}
          {faces[4] && (
            <CubeFaceComponent
              face={faces[4]}
              position="top"
              size={size}
              onClick={() => handleFaceClick(4)}
            />
          )}
          
          {/* Bottom Face */}
          {faces[5] && (
            <CubeFaceComponent
              face={faces[5]}
              position="bottom"
              size={size}
              onClick={() => handleFaceClick(5)}
            />
          )}
        </motion.div>

        {/* Glow Effect */}
        {glowEffect && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: faces[currentFace]?.gradient || 'linear-gradient(45deg, #667eea, #764ba2)',
              filter: 'blur(15px)',
              opacity: 0.4,
              zIndex: -1
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0.4,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      {/* Face Indicators */}
      <div className="flex gap-2 mt-4">
        {faces.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentFace === index ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => handleFaceClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  )
}

interface CubeFaceComponentProps {
  face: CubeFace
  position: 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom'
  size: number
  onClick: () => void
}

function CubeFaceComponent({ face, position, size, onClick }: CubeFaceComponentProps) {
  const getTransform = () => {
    const halfSize = size / 2
    switch (position) {
      case 'front':
        return `translateZ(${halfSize}px)`
      case 'right':
        return `rotateY(90deg) translateZ(${halfSize}px)`
      case 'back':
        return `rotateY(180deg) translateZ(${halfSize}px)`
      case 'left':
        return `rotateY(-90deg) translateZ(${halfSize}px)`
      case 'top':
        return `rotateX(90deg) translateZ(${halfSize}px)`
      case 'bottom':
        return `rotateX(-90deg) translateZ(${halfSize}px)`
    }
  }

  const Icon = face.icon

  return (
    <motion.div
      className="cube-face absolute border border-white/20 rounded-lg cursor-pointer overflow-hidden"
      style={{
        width: size,
        height: size,
        transform: getTransform(),
        background: face.gradient,
        backfaceVisibility: 'hidden'
      }}
      onClick={onClick}
      whileHover={{ 
        boxShadow: '0 0 20px rgba(255,255,255,0.3)',
        scale: 1.02
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center text-center p-3 text-white">
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <Icon size={size > 100 ? 24 : 18} />
          </motion.div>
        )}
        
        <motion.div
          className="font-bold text-lg"
          style={{ fontSize: size > 100 ? '1.2rem' : '1rem' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {face.value}
        </motion.div>
        
        <motion.div
          className="text-xs font-medium opacity-90"
          style={{ fontSize: size > 100 ? '0.75rem' : '0.65rem' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {face.title}
        </motion.div>
        
        {face.subtitle && (
          <motion.div
            className="text-xs opacity-70 mt-1"
            style={{ fontSize: size > 100 ? '0.65rem' : '0.55rem' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {face.subtitle}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
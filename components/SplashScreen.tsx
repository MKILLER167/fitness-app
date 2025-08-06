"use client"

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Activity, Dumbbell, Target, TrendingUp, Zap, Heart } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { Card } from './ui/card'
import { Progress } from './ui/progress'

interface SplashScreenProps {
  onComplete: () => void
  isDarkMode: boolean
}

export function SplashScreen({ onComplete, isDarkMode }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { language, direction } = useLanguage()

  const loadingMessages = {
    en: [
      'Initializing FitTracker...',
      'Loading your fitness journey...',
      'Preparing personalized experience...',
      'Setting up your dashboard...',
      'Almost ready!'
    ],
    ar: [
      'تهيئة فيت تراكر...',
      'تحميل رحلتك الرياضية...',
      'إعداد التجربة الشخصية...',
      'تحضير لوحة التحكم...',
      'تقريباً جاهز!'
    ]
  }

  const floatingIcons = [
    { icon: Dumbbell, delay: 0, x: -20, y: -30 },
    { icon: Target, delay: 0.5, x: 20, y: -20 },
    { icon: TrendingUp, delay: 1, x: -30, y: 20 },
    { icon: Heart, delay: 1.5, x: 30, y: 30 },
    { icon: Zap, delay: 2, x: 0, y: -40 },
    { icon: Activity, delay: 2.5, x: -15, y: 35 }
  ]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => 
        prev < loadingMessages[language].length - 1 ? prev + 1 : prev
      )
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [language, onComplete])

  return (
    <div 
      className={`
        min-h-screen relative overflow-hidden
        ${isDarkMode ? 'bg-black' : 'bg-white'}
        flex items-center justify-center
      `}
      dir={direction}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full
              ${isDarkMode ? 'bg-white' : 'bg-black'}
              opacity-20
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto px-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateY: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1,
          rotateY: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Logo Container with 3D Effects */}
        <motion.div
          className="relative mb-8"
          animate={{
            rotateX: [0, 10, -10, 0],
            rotateZ: [0, 2, -2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Logo Shadow */}
          <div 
            className={`
              absolute inset-0 rounded-full blur-xl opacity-30
              ${isDarkMode ? 'bg-white' : 'bg-black'}
              transform translate-y-4 scale-110
            `}
            style={{ transform: 'translateZ(-20px)' }}
          />
          
          {/* Main Logo */}
          <Card 
            className={`
              relative w-32 h-32 rounded-full border-4
              ${isDarkMode 
                ? 'bg-black border-white shadow-2xl shadow-white/20' 
                : 'bg-white border-black shadow-2xl shadow-black/20'
              }
              flex items-center justify-center overflow-hidden
              backdrop-blur-sm
            `}
            style={{
              transform: 'translateZ(0px)',
              boxShadow: isDarkMode 
                ? '0 25px 50px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 25px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Logo Content */}
            <motion.div
              className="relative"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Activity 
                className={`
                  w-16 h-16
                  ${isDarkMode ? 'text-white' : 'text-black'}
                `}
                strokeWidth={2}
              />
            </motion.div>

            {/* Floating Fitness Icons */}
            {floatingIcons.map(({ icon: Icon, delay, x, y }, index) => (
              <motion.div
                key={index}
                className={`
                  absolute w-6 h-6
                  ${isDarkMode ? 'text-white' : 'text-black'}
                  opacity-40
                `}
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: -12,
                  marginTop: -12,
                }}
                animate={{
                  x: [0, x, x * 1.5, x, 0],
                  y: [0, y, y * 1.5, y, 0],
                  opacity: [0, 0.6, 0.3, 0.6, 0],
                  scale: [0, 1, 1.2, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
              >
                <Icon size={24} />
              </motion.div>
            ))}
          </Card>
        </motion.div>

        {/* App Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: [0, 5, -5, 0]
          }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            rotateX: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          <h1 
            className={`
              text-4xl md:text-5xl font-bold mb-2
              ${isDarkMode ? 'text-white' : 'text-black'}
              tracking-tight
            `}
            style={{
              fontFamily: language === 'ar' ? 'Cairo, system-ui' : 'Inter, system-ui',
              textShadow: isDarkMode 
                ? '0 4px 20px rgba(255, 255, 255, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            FitTracker
          </h1>
          <motion.p 
            className={`
              text-lg
              ${isDarkMode ? 'text-white/70' : 'text-black/70'}
            `}
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {language === 'ar' ? 'رحلتك الرياضية تبدأ هنا' : 'Your Fitness Journey Starts Here'}
          </motion.p>
        </motion.div>

        {/* Loading Section */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotateY: [0, 2, -2, 0]
          }}
          transition={{
            delay: 1,
            duration: 0.6,
            rotateY: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Progress Bar Container */}
          <div 
            className={`
              relative p-6 rounded-2xl border-2 backdrop-blur-sm
              ${isDarkMode 
                ? 'bg-black/50 border-white/20 shadow-2xl shadow-white/10' 
                : 'bg-white/50 border-black/20 shadow-2xl shadow-black/10'
              }
            `}
            style={{
              transform: 'translateZ(10px)',
            }}
          >
            {/* Loading Message */}
            <motion.p 
              className={`
                text-center mb-4 h-6
                ${isDarkMode ? 'text-white' : 'text-black'}
              `}
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loadingMessages[language][currentMessage]}
            </motion.p>

            {/* Enhanced Progress Bar */}
            <div className="relative">
              <Progress 
                value={progress}
                className={`
                  h-3 rounded-full
                  ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}
                `}
                style={{
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Progress Glow Effect */}
              <motion.div
                className={`
                  absolute inset-0 rounded-full
                  ${isDarkMode ? 'bg-white' : 'bg-black'}
                  opacity-20 blur-md
                `}
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.1s ease-out'
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Progress Percentage */}
            <motion.p 
              className={`
                text-center mt-3 text-sm
                ${isDarkMode ? 'text-white/60' : 'text-black/60'}
                font-mono
              `}
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
        </motion.div>

        {/* Loading Dots Animation */}
        <motion.div
          className="flex space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`
                w-2 h-2 rounded-full
                ${isDarkMode ? 'bg-white' : 'bg-black'}
              `}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Corner Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Top Left */}
        <motion.div
          className={`
            absolute top-8 left-8 w-20 h-20 rounded-full border-2
            ${isDarkMode ? 'border-white/10' : 'border-black/10'}
          `}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Top Right */}
        <motion.div
          className={`
            absolute top-12 right-12 w-16 h-16 rounded-full border
            ${isDarkMode ? 'border-white/10' : 'border-black/10'}
          `}
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Bottom Left */}
        <motion.div
          className={`
            absolute bottom-16 left-12 w-12 h-12 rounded-full border
            ${isDarkMode ? 'border-white/10' : 'border-black/10'}
          `}
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1]
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Bottom Right */}
        <motion.div
          className={`
            absolute bottom-8 right-8 w-24 h-24 rounded-full border-2
            ${isDarkMode ? 'border-white/10' : 'border-black/10'}
          `}
          animate={{
            rotate: -360,
            scale: [1, 1.05, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Exit Animation Overlay */}
      {!isLoading && (
        <motion.div
          className={`
            absolute inset-0 z-50
            ${isDarkMode ? 'bg-black' : 'bg-white'}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  )
}
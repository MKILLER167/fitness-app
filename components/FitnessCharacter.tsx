"use client"

import { useState, useEffect, useRef } from 'react'
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  Zap, 
  Heart, 
  Trophy, 
  MessageCircle, 
  X, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Settings,
  Home,
  Dumbbell,
  Utensils,
  BookOpen,
  Award,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from './LanguageContext'
import { toast } from 'sonner@2.0.3'

interface FitnessCharacterProps {
  userStats?: {
    totalXP: number
    level: number
    achievements: number
    workoutsCompleted: number
  }
  currentPage?: string
  onInteraction?: (type: string, data?: any) => void
}

interface CharacterState {
  mood: 'happy' | 'excited' | 'motivated' | 'concerned' | 'proud' | 'sleeping' | 'thinking'
  animation: 'idle' | 'bounce' | 'flex' | 'cheer' | 'wave' | 'think' | 'sleep' | 'spin' | 'pulse'
  message: string
  isVisible: boolean
  position: 'bottom-right' | 'center' | 'bottom-left'
  size: 'small' | 'medium' | 'large'
}

interface CharacterMessage {
  text: string
  textAr: string
  mood: CharacterState['mood']
  animation: CharacterState['animation']
  duration: number
  action?: {
    label: string
    labelAr: string
    onClick: () => void
  }
}

export function FitnessCharacter({ userStats, currentPage = 'home', onInteraction }: FitnessCharacterProps) {
  const { language, direction } = useLanguage()
  const [character, setCharacter] = useState<CharacterState>({
    mood: 'happy',
    animation: 'idle',
    message: language === 'ar' ? "مرحباً! أنا فليكس، مدربك الشخصي! 💪" : "Hey there, fitness champion! I'm Flex, your personal trainer! 💪",
    isVisible: true,
    position: 'bottom-right',
    size: 'medium'
  })
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messageQueue, setMessageQueue] = useState<CharacterMessage[]>([])
  const [hasInteracted, setHasInteracted] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const animationRef = useRef<any>()
  const messageTimeoutRef = useRef<NodeJS.Timeout>()

  // Character personality based on user stats
  const getCharacterPersonality = () => {
    if (!userStats) return 'beginner'
    
    if (userStats.level >= 10 && userStats.workoutsCompleted >= 50) return 'expert'
    if (userStats.level >= 5 && userStats.workoutsCompleted >= 20) return 'intermediate'
    return 'beginner'
  }

  // Enhanced contextual messages with Arabic support
  const getContextualMessage = (): CharacterMessage => {
    const personality = getCharacterPersonality()
    const level = userStats?.level || 1
    
    const messages: Record<string, CharacterMessage[]> = {
      home: [
        {
          text: `Welcome back, Level ${level} warrior! Ready to conquer today? 🏆`,
          textAr: `مرحباً بعودتك، محارب المستوى ${level}! مستعد لقهر اليوم؟ 🏆`,
          mood: 'excited',
          animation: 'cheer',
          duration: 4000,
          action: {
            label: 'Start Workout',
            labelAr: 'ابدأ التمرين',
            onClick: () => onInteraction?.('navigate_to', 'exercises')
          }
        },
        {
          text: "Your dashboard looks amazing! Those numbers are going up! 📈",
          textAr: "لوحة القيادة تبدو رائعة! الأرقام ترتفع! 📈",
          mood: 'proud',
          animation: 'flex',
          duration: 3500
        },
        {
          text: "I see great potential in you! Let's make today count! ⚡",
          textAr: "أرى إمكانات عظيمة فيك! دعنا نجعل اليوم يحسب! ⚡",
          mood: 'motivated',
          animation: 'bounce',
          duration: 4000
        },
        {
          text: "Want to see your week's progress? Click on the stats! 📊",
          textAr: "تريد رؤية تقدم الأسبوع؟ انقر على الإحصائيات! 📊",
          mood: 'thinking',
          animation: 'think',
          duration: 4000,
          action: {
            label: 'View Stats',
            labelAr: 'عرض الإحصائيات',
            onClick: () => onInteraction?.('navigate_to', 'profile')
          }
        }
      ],
      meals: [
        {
          text: "Fuel your body right! Nutrition is 70% of your success! 🥗",
          textAr: "زود جسمك بالوقود الصحيح! التغذية 70% من نجاحك! 🥗",
          mood: 'motivated',
          animation: 'think',
          duration: 4000
        },
        {
          text: "Love the QR scanner! Technology meets nutrition! 📱✨",
          textAr: "أحب ماسح الباركود! التكنولوجيا تلتقي بالتغذية! 📱✨",
          mood: 'excited',
          animation: 'bounce',
          duration: 3500
        },
        {
          text: "Remember: you can't out-train a bad diet! Choose wisely! 🍎",
          textAr: "تذكر: لا يمكنك التغلب على نظام غذائي سيء بالتمرين! اختر بحكمة! 🍎",
          mood: 'concerned',
          animation: 'wave',
          duration: 4500
        },
        {
          text: "Track every bite! Small changes lead to big results! 📝",
          textAr: "تتبع كل قضمة! التغييرات الصغيرة تؤدي لنتائج كبيرة! 📝",
          mood: 'happy',
          animation: 'pulse',
          duration: 4000
        }
      ],
      exercises: [
        {
          text: "TIME TO GET STRONG! Let's crush this workout! 💪🔥",
          textAr: "وقت القوة! دعنا نسحق هذا التمرين! 💪🔥",
          mood: 'excited',
          animation: 'flex',
          duration: 4000,
          action: {
            label: 'Start Now',
            labelAr: 'ابدأ الآن',
            onClick: () => {
              onInteraction?.('start_workout')
              toast.success(language === 'ar' ? 'بدء التمرين! وقت الإنجاز!' : 'Workout started! Time to achieve!')
            }
          }
        },
        {
          text: "Every rep counts! Form over speed, always! 🎯",
          textAr: "كل تكرار مهم! الأداء أهم من السرعة، دائماً! 🎯",
          mood: 'motivated',
          animation: 'think',
          duration: 4000
        },
        {
          text: "You're getting stronger every day! I can see it! 🚀",
          textAr: "تصبح أقوى كل يوم! أستطيع رؤية ذلك! 🚀",
          mood: 'proud',
          animation: 'cheer',
          duration: 3500
        },
        {
          text: "Push-ups, squats, or cardio? What's your mood today? 🤔",
          textAr: "ضغط، سكوات، أم كارديو؟ ما مزاجك اليوم؟ 🤔",
          mood: 'thinking',
          animation: 'think',
          duration: 4000
        }
      ],
      strength: [
        {
          text: "BEAST MODE ACTIVATED! Time to lift heavy! 🏋️‍♀️",
          textAr: "تم تفعيل وضع الوحش! وقت الرفع الثقيل! 🏋️‍♀️",
          mood: 'excited',
          animation: 'flex',
          duration: 4000
        },
        {
          text: "Progressive overload is the key! Add that weight! 📊",
          textAr: "التحميل التدريجي هو المفتاح! أضف هذا الوزن! 📊",
          mood: 'motivated',
          animation: 'bounce',
          duration: 4000
        },
        {
          text: "I'm tracking your PRs! You're becoming legendary! 🏆",
          textAr: "أتتبع أرقامك القياسية! تصبح أسطورياً! 🏆",
          mood: 'proud',
          animation: 'cheer',
          duration: 4500
        }
      ],
      profile: [
        {
          text: "Look how far you've come! I'm so proud of you! 🌟",
          textAr: "انظر كم قطعت من طريق! أنا فخور بك جداً! 🌟",
          mood: 'proud',
          animation: 'cheer',
          duration: 4000
        },
        {
          text: "Your progress tells an amazing story! Keep writing it! 📖",
          textAr: "تقدمك يحكي قصة مذهلة! استمر في كتابتها! 📖",
          mood: 'motivated',
          animation: 'wave',
          duration: 4000
        }
      ],
      guide: [
        {
          text: "Knowledge is power! These guides will transform you! 📚",
          textAr: "المعرفة قوة! هذه الأدلة ستحولك! 📚",
          mood: 'excited',
          animation: 'bounce',
          duration: 4000
        },
        {
          text: "Reading about fitness? Smart move! Learn and apply! 🧠",
          textAr: "تقرأ عن اللياقة؟ خطوة ذكية! تعلم وطبق! 🧠",
          mood: 'thinking',
          animation: 'think',
          duration: 4000
        }
      ],
      achievements: [
        {
          text: "Achievements unlock! You're building an empire! 👑",
          textAr: "فتح الإنجازات! تبني إمبراطورية! 👑",
          mood: 'excited',
          animation: 'cheer',
          duration: 4000
        }
      ]
    }

    const pageMessages = messages[currentPage] || messages.home
    return pageMessages[Math.floor(Math.random() * pageMessages.length)]
  }

  // Enhanced special messages for milestones
  const getMilestoneMessage = (type: string, value: number): CharacterMessage => {
    const milestoneMessages: Record<string, CharacterMessage> = {
      level_up: {
        text: `🎉 LEVEL UP! You're now Level ${value}! Absolutely incredible! 🚀`,
        textAr: `🎉 ترقية مستوى! أنت الآن مستوى ${value}! لا يصدق تماماً! 🚀`,
        mood: 'excited',
        animation: 'cheer',
        duration: 6000
      },
      workout_complete: {
        text: `Workout SMASHED! 💥 That's ${value} workouts total! On fire! 🔥`,
        textAr: `تمرين محطم! 💥 هذا ${value} تمرين إجمالي! مشتعل! 🔥`,
        mood: 'proud',
        animation: 'flex',
        duration: 5000
      },
      achievement_unlock: {
        text: `NEW ACHIEVEMENT UNLOCKED! 🏆 You're becoming legendary! ⭐`,
        textAr: `إنجاز جديد مفتوح! 🏆 تصبح أسطورياً! ⭐`,
        mood: 'excited',
        animation: 'cheer',
        duration: 5000
      },
      streak_milestone: {
        text: `${value} day streak! You're officially unstoppable! 🔥💪`,
        textAr: `سلسلة ${value} يوم! أنت رسمياً لا يُوقف! 🔥💪`,
        mood: 'proud',
        animation: 'bounce',
        duration: 5000
      }
    }

    return milestoneMessages[type] || {
      text: "Amazing progress! Keep it up! 🌟",
      textAr: "تقدم مذهل! استمر! 🌟",
      mood: 'happy',
      animation: 'wave',
      duration: 3000
    }
  }

  // Idle animations with more variety
  const idleAnimations = ['idle', 'wave', 'think', 'bounce', 'pulse']
  
  useEffect(() => {
    if (isMinimized) return
    
    // Set up idle animation cycle
    const idleInterval = setInterval(() => {
      if (!isSpeaking && character.animation === 'idle') {
        const randomAnimation = idleAnimations[Math.floor(Math.random() * idleAnimations.length)]
        setCharacter(prev => ({ 
          ...prev, 
          animation: randomAnimation as any
        }))
        
        // Return to idle after animation
        setTimeout(() => {
          setCharacter(prev => ({ ...prev, animation: 'idle' }))
        }, 2000)
      }
    }, 10000 + Math.random() * 5000) // Random interval between 10-15 seconds

    return () => clearInterval(idleInterval)
  }, [isSpeaking, character.animation, isMinimized])

  // Handle character interactions
  useEffect(() => {
    if (!hasInteracted && !isMinimized) {
      // Initial greeting after 3 seconds
      setTimeout(() => {
        showMessage(getContextualMessage())
        setHasInteracted(true)
      }, 3000)
    }
  }, [hasInteracted, isMinimized])

  // Page change reactions
  useEffect(() => {
    if (hasInteracted && !isMinimized) {
      setTimeout(() => {
        showMessage(getContextualMessage())
      }, 1500)
    }
  }, [currentPage])

  // Periodic motivational messages
  useEffect(() => {
    if (!isMinimized) {
      const motivationInterval = setInterval(() => {
        if (!isSpeaking && Math.random() > 0.7) { // 30% chance
          showMessage(getContextualMessage())
        }
      }, 60000) // Every minute

      return () => clearInterval(motivationInterval)
    }
  }, [isSpeaking, isMinimized])

  const showMessage = (message: CharacterMessage) => {
    if (isMinimized) return
    
    setIsSpeaking(true)
    setCharacter(prev => ({
      ...prev,
      message: language === 'ar' ? message.textAr : message.text,
      mood: message.mood,
      animation: message.animation
    }))

    // Clear existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current)
    }

    // Auto-hide message
    messageTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false)
      setCharacter(prev => ({ ...prev, animation: 'idle' }))
    }, message.duration)
  }

  const handleCharacterClick = () => {
    setInteractionCount(prev => prev + 1)
    
    if (isSpeaking) {
      // Skip current message
      setIsSpeaking(false)
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    } else {
      // Show random contextual message
      showMessage(getContextualMessage())
    }
    
    onInteraction?.('character_click', { count: interactionCount + 1 })
    
    // Special interactions based on click count
    if (interactionCount === 5) {
      toast.success(language === 'ar' ? 'فليكس يحبك! 💕' : 'Flex loves you! 💕')
    } else if (interactionCount === 10) {
      toast.success(language === 'ar' ? 'أنت صديق فليكس المفضل! 🌟' : "You're Flex's favorite friend! 🌟")
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      showMessage({
        text: "Want to see my full potential? I'm here to help you succeed! 🌟",
        textAr: "تريد رؤية إمكاناتي الكاملة؟ أنا هنا لمساعدتك على النجاح! 🌟",
        mood: 'happy',
        animation: 'wave',
        duration: 3000
      })
    }
  }

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
    if (isMinimized) {
      setTimeout(() => {
        showMessage({
          text: "I'm back! Did you miss me? 😄",
          textAr: "عدت! هل اشتقت لي؟ 😄",
          mood: 'excited',
          animation: 'bounce',
          duration: 3000
        })
      }, 500)
    }
  }

  const getCharacterEmoji = () => {
    const animations = {
      idle: '🧘‍♂️',
      bounce: '🤸‍♂️',
      flex: '💪',
      cheer: '🎉',
      wave: '👋',
      think: '🤔',
      sleep: '😴',
      spin: '🌟',
      pulse: '❤️'
    }
    return animations[character.animation] || '💪'
  }

  const getMoodColor = () => {
    const colors = {
      happy: 'from-yellow-400 to-orange-500',
      excited: 'from-pink-500 to-purple-600',
      motivated: 'from-blue-500 to-indigo-600',
      concerned: 'from-orange-500 to-red-500',
      proud: 'from-green-500 to-emerald-600',
      sleeping: 'from-slate-400 to-slate-600',
      thinking: 'from-purple-400 to-indigo-500'
    }
    return colors[character.mood] || colors.happy
  }

  const getSizeClass = () => {
    const sizes = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-20 h-20'
    }
    return sizes[character.size]
  }

  const getQuickActions = () => [
    {
      icon: Home,
      label: language === 'ar' ? 'الرئيسية' : 'Home',
      onClick: () => onInteraction?.('navigate_to', 'home')
    },
    {
      icon: Dumbbell,
      label: language === 'ar' ? 'تمارين' : 'Exercises',
      onClick: () => onInteraction?.('navigate_to', 'exercises')
    },
    {
      icon: Utensils,
      label: language === 'ar' ? 'وجبات' : 'Meals',
      onClick: () => onInteraction?.('navigate_to', 'meals')
    },
    {
      icon: BookOpen,
      label: language === 'ar' ? 'دليل' : 'Guide',
      onClick: () => onInteraction?.('navigate_to', 'guide')
    }
  ]

  if (!character.isVisible) return null

  return (
    <>
      {/* Minimized Character */}
      {isMinimized ? (
        <motion.button
          className={`fixed z-40 ${direction === 'rtl' ? 'bottom-20 left-4' : 'bottom-20 right-4'} md:bottom-6 w-8 h-8 bg-gradient-to-br ${getMoodColor()} rounded-full flex items-center justify-center shadow-lg border border-white`}
          onClick={toggleMinimized}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <span className="text-sm">💪</span>
        </motion.button>
      ) : (
        /* Full Character */
        <motion.div
          className={`fixed z-40 ${direction === 'rtl' ? 'bottom-20 left-4' : 'bottom-20 right-4'} md:bottom-6`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            className={`relative cursor-pointer select-none`}
            onClick={handleCharacterClick}
            onDoubleClick={toggleExpanded}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: character.animation === 'bounce' ? [-5, 0, -5] : 0,
              rotate: character.animation === 'wave' ? [0, 10, -10, 0] : 
                     character.animation === 'spin' ? 360 : 0,
              scale: character.animation === 'flex' ? [1, 1.2, 1] :
                     character.animation === 'pulse' ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: character.animation === 'bounce' ? 0.6 : 
                       character.animation === 'spin' ? 2 : 0.8,
              repeat: character.animation !== 'idle' && character.animation !== 'spin' ? 3 : 
                     character.animation === 'spin' ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Character Avatar */}
            <div className={`${getSizeClass()} rounded-full bg-gradient-to-br ${getMoodColor()} flex items-center justify-center shadow-lg border-2 border-white relative overflow-hidden`}>
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Character emoji */}
              <span className="text-2xl relative z-10 filter drop-shadow-sm">
                {getCharacterEmoji()}
              </span>
              
              {/* Special effects */}
              {character.mood === 'excited' && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              )}
              
              {character.mood === 'proud' && (
                <motion.div
                  className="absolute -top-2 -left-2"
                  animate={{ y: [-5, -10, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-3 h-3 text-yellow-400" />
                </motion.div>
              )}
            </div>

            {/* Status indicators */}
            <div className={`absolute -top-1 ${direction === 'rtl' ? '-left-1' : '-right-1'} flex flex-col gap-1`}>
              {userStats && userStats.level > 1 && (
                <Badge className="h-5 px-1 text-xs bg-blue-500 hover:bg-blue-600">
                  L{userStats.level}
                </Badge>
              )}
              {isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Minimize button */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute -top-2 ${direction === 'rtl' ? '-right-2' : '-left-2'} w-5 h-5 p-0 bg-gray-200 hover:bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
              onClick={(e) => {
                e.stopPropagation()
                toggleMinimized()
              }}
            >
              <Minimize2 size={10} />
            </Button>
          </motion.div>

          {/* Speech bubble */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`absolute bottom-full mb-2 ${direction === 'rtl' ? 'left-0' : 'right-0'} w-64 max-w-xs`}
              >
                <Card className="p-3 bg-white dark:bg-gray-800 shadow-xl border-2 border-gray-200 dark:border-gray-700 relative">
                  <p className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {character.message}
                  </p>
                  
                  {/* Speech bubble arrow */}
                  <div className={`absolute top-full ${direction === 'rtl' ? 'left-4' : 'right-4'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800`} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quick Actions Floating Menu */}
      {!isMinimized && !isSpeaking && (
        <motion.div
          className={`fixed z-30 ${direction === 'rtl' ? 'bottom-32 left-4' : 'bottom-32 right-4'} space-y-2`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          {getQuickActions().map((action, index) => (
            <motion.button
              key={index}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              onClick={action.onClick}
              whileHover={{ scale: 1.1, x: direction === 'rtl' ? 5 : -5 }}
              whileTap={{ scale: 0.9 }}
              title={action.label}
            >
              <action.icon size={16} />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Expanded Character Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{getCharacterEmoji()}</span>
                  {language === 'ar' ? 'تعرف على فليكس!' : 'Meet Flex!'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === 'ar' ? 
                    'أنا رفيقك الشخصي في اللياقة البدنية! سأشجعك وأعطيك النصائح وأساعدك على البقاء متحفزاً في رحلة اللياقة.' :
                    "I'm your personal fitness companion! I'll cheer you on, give you tips, and help you stay motivated on your fitness journey."
                  }
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-xs font-medium">
                      {language === 'ar' ? 'يركز على الأهداف' : 'Goal Focused'}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    <div className="text-xs font-medium">
                      {language === 'ar' ? 'داعم دائماً' : 'Always Supportive'}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-xs font-medium">
                      {language === 'ar' ? 'متتبع التقدم' : 'Progress Tracker'}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                    <MessageCircle className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                    <div className="text-xs font-medium">
                      {language === 'ar' ? 'ثرثار دائماً' : 'Always Chatty'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex-1"
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    {soundEnabled ? 
                      (language === 'ar' ? 'الصوت مفعل' : 'Sound On') : 
                      (language === 'ar' ? 'الصوت مطفأ' : 'Sound Off')
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showMessage(getContextualMessage())}
                    className="flex-1"
                  >
                    <RotateCcw size={16} />
                    {language === 'ar' ? 'نصيحة جديدة' : 'New Tip'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'ar' ? 
                      `لقد تفاعلت معي ${interactionCount} مرة!` :
                      `You've interacted with me ${interactionCount} times!`
                    }
                  </p>
                  {userStats && (
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 
                        `مستواك ${userStats.level} مع ${userStats.totalXP} نقطة خبرة` :
                        `You're level ${userStats.level} with ${userStats.totalXP} XP`
                      }
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => setIsExpanded(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {language === 'ar' ? 'هيا بنا! 💪' : "Let's Go! 💪"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick expand button */}
      {!isMinimized && (
        <motion.button
          className={`fixed bottom-2 ${direction === 'rtl' ? 'left-20 md:left-24' : 'right-20 md:right-24'} z-30 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg text-white text-xs`}
          onClick={toggleExpanded}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          ?
        </motion.button>
      )}
    </>
  )
}

// Enhanced hook for easy character integration
export function useFitnessCharacter() {
  const [character, setCharacter] = useState<any>(null)

  const showMilestone = (type: string, value: number) => {
    // This would trigger the character to show a milestone message
    console.log(`Character milestone: ${type} - ${value}`)
    // Could dispatch a custom event that the character listens to
    const event = new CustomEvent('characterMilestone', {
      detail: { type, value }
    })
    window.dispatchEvent(event)
  }

  const celebrateAchievement = (achievement: string) => {
    // This would trigger the character to celebrate
    console.log(`Character celebration: ${achievement}`)
    const event = new CustomEvent('characterCelebration', {
      detail: { achievement }
    })
    window.dispatchEvent(event)
  }

  const encourageUser = (context?: string) => {
    // This would trigger encouraging message
    console.log(`Character encouragement: ${context}`)
    const event = new CustomEvent('characterEncouragement', {
      detail: { context }
    })
    window.dispatchEvent(event)
  }

  const speakMessage = (message: string, messageAr: string) => {
    const event = new CustomEvent('characterSpeak', {
      detail: { message, messageAr }
    })
    window.dispatchEvent(event)
  }

  return {
    showMilestone,
    celebrateAchievement,
    encourageUser,
    speakMessage
  }
}
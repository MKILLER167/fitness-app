"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import { 
  Trophy,
  Star,
  Award,
  Target,
  Flame,
  Calendar,
  Dumbbell,
  Users,
  CheckCircle,
  Lock,
  Zap,
  Medal,
  Crown,
  Gem
} from 'lucide-react'
import { AchievementBadge3D } from './3d/AchievementBadge3D'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
  streak: number
  weeklyGoal: number
  weeklyProgress: number
}

interface Achievement {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  category: 'workout' | 'nutrition' | 'streak' | 'social' | 'milestone'
  isUnlocked: boolean
  progress: number
  maxProgress: number
  xpReward: number
  unlockedAt?: Date
  icon: any
}

interface AchievementsDisplayProps {
  userStats?: UserStats
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  compact?: boolean
}

export function AchievementsDisplay({ 
  userStats, 
  onXPGain, 
  subscriptionTier = 'free',
  compact = false 
}: AchievementsDisplayProps) {
  const { language, direction } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [achievements, setAchievements] = useState<Achievement[]>([])

  // Initialize achievements
  useEffect(() => {
    const achievementsList: Achievement[] = [
      // Workout Achievements
      {
        id: 'first_workout',
        title: 'First Steps',
        titleAr: 'المبتدئ',
        description: 'Complete your first workout',
        descriptionAr: 'أول تمرين مكتمل',
        tier: 'bronze',
        category: 'workout',
        isUnlocked: (userStats?.workoutsCompleted || 0) > 0,
        progress: Math.min(userStats?.workoutsCompleted || 0, 1),
        maxProgress: 1,
        xpReward: 50,
        icon: Dumbbell
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        titleAr: 'محارب الأسبوع',
        description: 'Workout 7 days in a row',
        descriptionAr: '7 أيام متتالية',
        tier: 'silver',
        category: 'workout',
        isUnlocked: (userStats?.streak || 0) >= 7,
        progress: Math.min(userStats?.streak || 0, 7),
        maxProgress: 7,
        xpReward: 100,
        icon: Calendar
      },
      {
        id: 'strength_pro',
        title: 'Strength Pro',
        titleAr: 'محترف القوة',
        description: 'Unlock new strength tier',
        descriptionAr: 'فتح مستوى قوة جديد',
        tier: 'gold',
        category: 'workout',
        isUnlocked: (userStats?.tiersUnlocked || 0) > 0,
        progress: Math.min(userStats?.tiersUnlocked || 0, 3),
        maxProgress: 3,
        xpReward: 200,
        icon: Trophy
      },
      
      // Streak Achievements
      {
        id: 'fire_starter',
        title: 'Fire Starter',
        titleAr: 'مشعل النار',
        description: 'Start a 3-day streak',
        descriptionAr: '3 أيام متتالية',
        tier: 'bronze',
        category: 'streak',
        isUnlocked: (userStats?.streak || 0) >= 3,
        progress: Math.min(userStats?.streak || 0, 3),
        maxProgress: 3,
        xpReward: 30,
        icon: Flame
      },
      {
        id: 'consistency_king',
        title: 'Consistency King',
        titleAr: 'ملك الثبات',
        description: 'Maintain a 30-day streak',
        descriptionAr: '30 يوم متتالي',
        tier: 'platinum',
        category: 'streak',
        isUnlocked: (userStats?.streak || 0) >= 30,
        progress: Math.min(userStats?.streak || 0, 30),
        maxProgress: 30,
        xpReward: 500,
        icon: Crown
      },
      
      // Milestone Achievements
      {
        id: 'level_up',
        title: 'Level Up',
        titleAr: 'ارتقاء المستوى',
        description: 'Reach level 5',
        descriptionAr: 'الوصول للمستوى 5',
        tier: 'silver',
        category: 'milestone',
        isUnlocked: (userStats?.level || 1) >= 5,
        progress: Math.min(userStats?.level || 1, 5),
        maxProgress: 5,
        xpReward: 150,
        icon: Star
      },
      {
        id: 'xp_master',
        title: 'XP Master',
        titleAr: 'سيد التجربة',
        description: 'Earn 1000 total XP',
        descriptionAr: '1000 نقطة تجربة',
        tier: 'gold',
        category: 'milestone',
        isUnlocked: (userStats?.totalXP || 0) >= 1000,
        progress: Math.min(userStats?.totalXP || 0, 1000),
        maxProgress: 1000,
        xpReward: 250,
        icon: Gem
      },
      
      // Social Achievements (Premium/Pro only)
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        titleAr: 'الفراشة الاجتماعية',
        description: 'Join 5 challenges',
        descriptionAr: 'انضم لـ 5 تحديات',
        tier: 'silver',
        category: 'social',
        isUnlocked: false, // Would be based on social stats
        progress: 0,
        maxProgress: 5,
        xpReward: 100,
        icon: Users
      }
    ]

    setAchievements(achievementsList)
  }, [userStats])

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All', icon: Trophy },
    { id: 'workout', label: language === 'ar' ? 'التمارين' : 'Workouts', icon: Dumbbell },
    { id: 'streak', label: language === 'ar' ? 'التتالي' : 'Streaks', icon: Flame },
    { id: 'milestone', label: language === 'ar' ? 'المعالم' : 'Milestones', icon: Star },
    { id: 'social', label: language === 'ar' ? 'الاجتماعي' : 'Social', icon: Users }
  ]

  const getFilteredAchievements = () => {
    let filtered = achievements
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === selectedCategory)
    }
    
    // Hide social achievements for free users
    if (subscriptionTier === 'free') {
      filtered = filtered.filter(achievement => achievement.category !== 'social')
    }
    
    // Sort by unlocked first, then by tier
    return filtered.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1
      }
      
      const tierOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 }
      return tierOrder[b.tier] - tierOrder[a.tier]
    })
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600 bg-amber-100 dark:bg-amber-950/30'
      case 'silver': return 'text-gray-600 bg-gray-100 dark:bg-gray-950/30'
      case 'gold': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950/30'
      case 'platinum': return 'text-purple-600 bg-purple-100 dark:bg-purple-950/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950/30'
    }
  }

  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalPoints = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0)

  if (compact) {
    // Compact version for home screen
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              {language === 'ar' ? 'الإنجازات الحديثة' : 'Recent Achievements'}
            </CardTitle>
            <Badge variant="outline">
              {unlockedCount}/{achievements.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            {getFilteredAchievements().slice(0, 3).map((achievement) => (
              <AchievementBadge3D
                key={achievement.id}
                title={language === 'ar' ? achievement.titleAr : achievement.title}
                description={language === 'ar' ? achievement.descriptionAr : achievement.description}
                tier={achievement.tier}
                unlocked={achievement.isUnlocked}
                progress={achievement.progress / achievement.maxProgress * 100}
                showUnlockAnimation={false}
                onClick={() => {}}
                size="sm"
                glowIntensity="medium"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full achievements screen
  return (
    <div className="space-y-6" dir={direction}>
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-950/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-lg font-bold">{unlockedCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'ar' ? 'مفتوحة' : 'Unlocked'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold ltr-numbers">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'ar' ? 'نقاط XP' : 'XP Points'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-bold">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'ar' ? 'مكتمل' : 'Complete'}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <category.icon className="h-3 w-3 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {getFilteredAchievements().map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`${achievement.isUnlocked ? 'border-primary/20' : 'border-muted'} transition-all duration-300 hover:shadow-md`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.isUnlocked 
                      ? getTierColor(achievement.tier)
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.isUnlocked ? (
                      <achievement.icon className="h-6 w-6" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {language === 'ar' ? achievement.titleAr : achievement.title}
                      </h3>
                      <Badge variant="outline" className={`text-xs ${getTierColor(achievement.tier)}`}>
                        {achievement.tier}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'ar' ? achievement.descriptionAr : achievement.description}
                    </p>
                    
                    {!achievement.isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium ltr-numbers">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                    
                    {achievement.isUnlocked && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          +{achievement.xpReward} XP {language === 'ar' ? 'حصلت عليها' : 'Earned'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Achievements Promotion */}
      {subscriptionTier === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'إنجازات حصرية' : 'Exclusive Achievements'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar' 
                  ? 'افتح المزيد من الإنجازات والتحديات الاجتماعية مع العضوية المميزة'
                  : 'Unlock more achievements and social challenges with Premium membership'
                }
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                {language === 'ar' ? 'ترقية الآن' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
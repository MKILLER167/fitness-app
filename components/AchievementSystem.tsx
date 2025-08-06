"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { useLanguage } from './LanguageContext'
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Award, 
  Crown, 
  Zap, 
  Medal,
  TrendingUp,
  Calendar,
  Dumbbell,
  Apple
} from 'lucide-react'
import { FeatureCard } from './FeatureCard'
import { AchievementBadge3D } from './3d/AchievementBadge3D'
import { FlipCard3D } from './3d/FlipCard3D'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  category: 'fitness' | 'nutrition' | 'consistency' | 'milestone'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  xpReward: number
  target: number
  progress: number
  unlocked: boolean
  unlockedAt?: Date
  condition: string
}

export interface UserProgress {
  level: number
  totalXP: number
  currentLevelXP: number
  nextLevelXP: number
  streak: number
  workoutsCompleted: number
  mealsLogged: number
  daysActive: number
}

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface AchievementSystemProps {
  userStats?: UserStats
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  userProgress?: UserProgress
  achievements?: Achievement[]
  onAchievementUnlock?: (achievement: Achievement) => void
}

export function AchievementSystem({ 
  userStats,
  onXPGain,
  subscriptionTier = 'free',
  userProgress: initialProgress, 
  achievements: initialAchievements,
  onAchievementUnlock 
}: AchievementSystemProps) {
  const { t } = useLanguage()
  
  const [userProgress, setUserProgress] = useState<UserProgress>(initialProgress || {
    level: 1,
    totalXP: 350,
    currentLevelXP: 350,
    nextLevelXP: 500,
    streak: 7,
    workoutsCompleted: 12,
    mealsLogged: 48,
    daysActive: 15
  })

  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements || [
    {
      id: 'first_workout',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: Dumbbell,
      category: 'fitness',
      tier: 'bronze',
      xpReward: 50,
      target: 1,
      progress: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      condition: 'Complete 1 workout'
    },
    {
      id: 'nutrition_tracker',
      title: 'Nutrition Tracker',
      description: 'Log your first meal',
      icon: Apple,
      category: 'nutrition',
      tier: 'bronze',
      xpReward: 25,
      target: 1,
      progress: 1,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      condition: 'Log 1 meal'
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      category: 'consistency',
      tier: 'silver',
      xpReward: 100,
      target: 7,
      progress: 7,
      unlocked: true,
      unlockedAt: new Date(),
      condition: 'Maintain 7-day streak'
    },
    {
      id: 'workout_machine',
      title: 'Workout Machine',
      description: 'Complete 10 workouts',
      icon: Target,
      category: 'fitness',
      tier: 'silver',
      xpReward: 150,
      target: 10,
      progress: 12,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      condition: 'Complete 10 workouts'
    },
    {
      id: 'meal_master',
      title: 'Meal Master',
      description: 'Log 50 meals',
      icon: Crown,
      category: 'nutrition',
      tier: 'gold',
      xpReward: 200,
      target: 50,
      progress: 48,
      unlocked: false,
      condition: 'Log 50 meals'
    },
    {
      id: 'fitness_legend',
      title: 'Fitness Legend',
      description: 'Reach level 10',
      icon: Trophy,
      category: 'milestone',
      tier: 'platinum',
      xpReward: 500,
      target: 10,
      progress: 1,
      unlocked: false,
      condition: 'Reach level 10'
    },
    {
      id: 'diamond_dedication',
      title: 'Diamond Dedication',
      description: 'Maintain a 30-day streak',
      icon: Medal,
      category: 'consistency',
      tier: 'diamond',
      xpReward: 1000,
      target: 30,
      progress: 7,
      unlocked: false,
      condition: 'Maintain 30-day streak'
    }
  ])

  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'diamond': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'fitness': return Dumbbell
      case 'nutrition': return Apple
      case 'consistency': return Flame
      case 'milestone': return Trophy
      default: return Star
    }
  }

  const levelProgress = (userProgress.currentLevelXP / userProgress.nextLevelXP) * 100

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="space-y-6">
      {/* User Level & XP */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl">Level {userProgress.level}</h3>
              <p className="text-sm text-muted-foreground">
                {userProgress.currentLevelXP} / {userProgress.nextLevelXP} XP
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userProgress.level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="text-orange-500" size={16} />
                <span className="font-semibold text-orange-600">{userProgress.streak}</span>
              </div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Dumbbell className="text-blue-500" size={16} />
                <span className="font-semibold text-blue-600">{userProgress.workoutsCompleted}</span>
              </div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Apple className="text-green-500" size={16} />
                <span className="font-semibold text-green-600">{userProgress.mealsLogged}</span>
              </div>
              <div className="text-xs text-muted-foreground">Meals Logged</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="text-purple-500" size={16} />
                <span className="font-semibold text-purple-600">{userProgress.daysActive}</span>
              </div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3D Achievement Badges */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-6 flex-wrap">
              {unlockedAchievements
                .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
                .slice(0, 6)
                .map((achievement) => (
                  <AchievementBadge3D
                    key={achievement.id}
                    title={achievement.title}
                    description={achievement.description}
                    icon={achievement.icon}
                    tier={achievement.tier}
                    unlocked={achievement.unlocked}
                    showUnlockAnimation={
                      achievement.unlockedAt && 
                      Date.now() - achievement.unlockedAt.getTime() < 5000 // Recent unlock
                    }
                    size="lg"
                    glowIntensity="high"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3D Flip Cards for Featured Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-purple-500" size={20} />
            Special Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FlipCard3D
              frontTitle="Elite Performer"
              frontDescription="Reach level 10 and unlock elite status"
              frontIcon={Crown}
              backTitle="Elite Benefits"
              backDescription="Unlock exclusive features, advanced analytics, and priority support"
              backContent={
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current Level:</span>
                    <span className="font-bold">{userProgress.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress:</span>
                    <span className="font-bold">{Math.round((userProgress.level / 10) * 100)}%</span>
                  </div>
                </div>
              }
              gradient="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
              badge="Legendary"
              size="md"
            />
            
            <FlipCard3D
              frontTitle="Consistency Master"
              frontDescription="Maintain perfect streaks and discipline"
              frontIcon={Flame}
              backTitle="Streak Rewards"
              backDescription="Daily streaks unlock bonus XP and exclusive achievement badges"
              backContent={
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Best Streak:</span>
                    <span className="font-bold">15 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span className="font-bold">{userProgress.daysActive}</span>
                  </div>
                </div>
              }
              gradient="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
              badge="Epic"
              size="md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" size={20} />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lockedAchievements.map((achievement) => {
              const Icon = achievement.icon
              const progress = Math.min((achievement.progress / achievement.target) * 100, 100)
              
              return (
                <div key={achievement.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icon className="text-muted-foreground" size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant="outline" className={getTierColor(achievement.tier)}>
                              {achievement.tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">+{achievement.xpReward} XP</div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress} / {achievement.target}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{achievement.condition}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Featured Achievements with Animated Cards */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Featured Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            title="Diamond Elite"
            description="Reach 30-day streak and unlock ultimate dedication badge"
            icon={Medal}
            gradient="linear-gradient(to left, #a8edea 0%, #fed6e3 100%)"
            badge="Legendary"
            badgeVariant="destructive"
            size="md"
            disabled={achievements.find(a => a.id === 'diamond_dedication')?.unlocked === false}
          />
          
          <FeatureCard
            title="Fitness Legend"
            description="Reach level 10 and join the elite fitness community"
            icon={Trophy}
            gradient="linear-gradient(to left, #ffecd2 0%, #fcb69f 100%)"
            badge="Epic"
            badgeVariant="outline"
            size="md"
            disabled={achievements.find(a => a.id === 'fitness_legend')?.unlocked === false}
          />
          
          <FeatureCard
            title="Strength Master"
            description="Complete 100 workouts and become a true athlete"
            icon={Dumbbell}
            gradient="linear-gradient(to left, #a18cd1 0%, #fbc2eb 100%)"
            badge="Rare"
            badgeVariant="secondary"
            size="md"
          />
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['fitness', 'nutrition', 'consistency', 'milestone'].map((category) => {
          const categoryAchievements = achievements.filter(a => a.category === category)
          const unlockedCount = categoryAchievements.filter(a => a.unlocked).length
          const CategoryIcon = getCategoryIcon(category as Achievement['category'])
          
          return (
            <Card key={category} className="text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CategoryIcon className="text-primary" size={24} />
                </div>
                <h4 className="font-medium capitalize mb-2">{category}</h4>
                <div className="text-2xl font-bold text-primary mb-1">
                  {unlockedCount}/{categoryAchievements.length}
                </div>
                <div className="text-xs text-muted-foreground">Unlocked</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
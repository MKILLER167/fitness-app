"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy, 
  Flame,
  Camera,
  Plus,
  TrendingUp,
  Award,
  Target,
  Clock
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface SocialHubProps {
  userProfile?: UserProfile
  userStats?: UserStats
  onXPGain?: (xp: number, reason: string) => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onPremiumFeatureAccess?: (featureName: string) => boolean
  onProFeatureAccess?: (featureName: string) => boolean
}

export function SocialHub({ 
  userProfile, 
  userStats, 
  onXPGain, 
  subscriptionTier = 'free', 
  onPremiumFeatureAccess, 
  onProFeatureAccess 
}: SocialHubProps) {
  const [selectedTab, setSelectedTab] = useState('feed')
  
  const feedPosts = [
    {
      id: 1,
      user: { name: "Sarah Johnson", avatar: "SJ", level: 15 },
      content: "Just crushed my morning HIIT session! 💪 Feeling stronger every day!",
      image: "💪",
      stats: { workout: "HIIT Cardio", duration: "30 min", calories: 320 },
      likes: 24,
      comments: 8,
      timeAgo: "2h ago",
      achievements: ["7-Day Streak", "Early Bird"]
    },
    {
      id: 2,
      user: { name: "Mike Chen", avatar: "MC", level: 22 },
      content: "New PR on deadlifts today! 🔥 Thanks for all the motivation from this amazing community!",
      image: "🏋️",
      stats: { exercise: "Deadlift", weight: "140kg", reps: "5x5" },
      likes: 67,
      comments: 15,
      timeAgo: "4h ago",
      achievements: ["Strength Beast", "PR Master"]
    },
    {
      id: 3,
      user: { name: "Emma Wilson", avatar: "EW", level: 8 },
      content: "Meal prep Sunday done! 🥗 This week's menu is looking delicious and healthy!",
      image: "🥗",
      stats: { meals: 21, calories: "avg 1,800", protein: "125g avg" },
      likes: 31,
      comments: 12,
      timeAgo: "6h ago",
      achievements: ["Meal Prep Pro"]
    }
  ]

  const challenges = [
    {
      id: 1,
      title: "March Madness Step Challenge",
      participants: 1247,
      timeLeft: "12 days",
      myRank: 34,
      prize: "Premium Workout Bundle",
      progress: 75
    },
    {
      id: 2,
      title: "Hydration Heroes",
      participants: 892,
      timeLeft: "5 days",
      myRank: 12,
      prize: "Smart Water Bottle",
      progress: 88
    }
  ]

  const leaderboard = [
    { rank: 1, name: "Alex Thompson", points: 2847, streak: 28, avatar: "AT" },
    { rank: 2, name: "Jessica Lee", points: 2756, streak: 25, avatar: "JL" },
    { rank: 3, name: "David Kim", points: 2689, streak: 31, avatar: "DK" },
    { rank: 4, name: "You", points: 2654, streak: 15, avatar: "YU", isUser: true },
    { rank: 5, name: "Maria Garcia", points: 2612, streak: 22, avatar: "MG" }
  ]

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-2xl">Social Hub 🌟</h1>
        <p className="text-muted-foreground">Connect, compete, and celebrate together</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        {[
          { id: 'feed', label: 'Feed', icon: Users },
          { id: 'challenges', label: 'Challenges', icon: Trophy },
          { id: 'leaderboard', label: 'Rankings', icon: TrendingUp }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={selectedTab === tab.id ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setSelectedTab(tab.id)}
          >
            <tab.icon size={16} className="mr-1" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Feed Tab */}
      {selectedTab === 'feed' && (
        <div className="space-y-4">
          {/* Share Something */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    Share your fitness win today...
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Camera size={16} className="mr-1" />
                  Progress Photo
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Trophy size={16} className="mr-1" />
                  Achievement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          {feedPosts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{post.user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{post.user.name}</p>
                        <Badge variant="outline" className="text-xs">Lv.{post.user.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mb-3">{post.content}</p>

                {/* Stats */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-3">
                  <div className="flex items-center justify-center text-4xl mb-2">
                    {post.image}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    {Object.entries(post.stats).map(([key, value]) => (
                      <div key={key}>
                        <div className="font-medium">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="flex gap-2 mb-3">
                  {post.achievements.map(achievement => (
                    <Badge key={achievement} variant="secondary" className="text-xs">
                      🏆 {achievement}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm">
                      <Heart size={16} className="mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle size={16} className="mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Challenges Tab */}
      {selectedTab === 'challenges' && (
        <div className="space-y-4">
          {/* Active Challenges */}
          <div>
            <h3 className="font-medium mb-3">Active Challenges</h3>
            {challenges.map(challenge => (
              <Card key={challenge.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{challenge.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>🏆 {challenge.prize}</span>
                        <span>👥 {challenge.participants} participants</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Rank #{challenge.myRank}</div>
                      <div className="text-xs text-muted-foreground">{challenge.timeLeft} left</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Join New Challenge */}
          <Card>
            <CardContent className="p-4 text-center">
              <Plus className="mx-auto mb-2 text-muted-foreground" size={32} />
              <h4 className="font-medium mb-1">Join More Challenges</h4>
              <p className="text-sm text-muted-foreground mb-3">Compete with the community and win prizes</p>
              <Button className="w-full">Browse Challenges</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-4">
          {/* Time Period Selector */}
          <div className="flex gap-2">
            {['Weekly', 'Monthly', 'All Time'].map(period => (
              <Button key={period} variant="outline" size="sm">
                {period}
              </Button>
            ))}
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Weekly Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map(user => (
                <div 
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.isUser ? 'bg-primary/10 border border-primary/20' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200'
                    }`}>
                      {user.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flame size={12} />
                        {user.streak} day streak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.points.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
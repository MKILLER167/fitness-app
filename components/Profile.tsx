"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Edit, Target, Award, Calendar, Settings, Flame, TrendingUp, LogOut, Scale, Ruler, Key, Wifi, WifiOff, Crown, Sparkles, CreditCard } from 'lucide-react'
import type { UserProfile } from './Onboarding'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { FitnessRadarChart } from "./FitnessRadarChart"
// Import OAuth service dynamically to avoid initialization issues

interface ProfileProps {
  userProfile?: UserProfile
  userStats?: {
    totalXP: number
    level: number
    achievements: number
    workoutsCompleted: number
    tiersUnlocked: number
  }
  onLogout: () => void
  subscriptionTier?: 'free' | 'premium' | 'pro'
  onManageSubscription?: () => void
}

export function Profile({ userProfile, userStats: propUserStats, onLogout, subscriptionTier = 'free', onManageSubscription }: ProfileProps) {
  const [editMode, setEditMode] = useState(false)
  const [oauthStatus, setOAuthStatus] = useState({
    isConfigured: false,
    isDemoMode: true
  })
  
  // Check if user is signed in with Google
  const googleUser = localStorage.getItem('google_user') 
    ? JSON.parse(localStorage.getItem('google_user')!) 
    : null

  // Check OAuth status on mount
  useEffect(() => {
    checkOAuthStatus()
  }, [])

  const checkOAuthStatus = async () => {
    try {
      const { default: googleOAuthService } = await import('./GoogleOAuthService')
      const config = googleOAuthService.getConfig()
      setOAuthStatus({
        isConfigured: !config.isDemoMode,
        isDemoMode: config.isDemoMode
      })
    } catch (error) {
      console.error('Error checking OAuth status:', error)
    }
  }
  
  // Use user profile or fallback to default stats
  const userStats = {
    name: userProfile?.name || googleUser?.name || "User",
    age: userProfile?.age || 25,
    height: userProfile ? `${userProfile.height} cm` : "170 cm",
    currentWeight: userProfile?.weight || 70,
    goalWeight: userProfile?.targetWeight || 68,
    joinDate: "March 2024",
    streakDays: 15,
    totalWorkouts: propUserStats?.workoutsCompleted || 89,
    caloriesBurned: 12450,
    activityLevel: userProfile?.activityLevel || 'moderate',
    fitnessGoal: userProfile?.fitnessGoal || 'maintain',
    dailyCalories: userProfile?.dailyCalorieGoal || 2000,
    workoutFrequency: userProfile?.workoutFrequency || 3,
    level: propUserStats?.level || 1,
    totalXP: propUserStats?.totalXP || 0,
    achievements: propUserStats?.achievements || 0
  }

  const achievements = [
    { title: "First Week Complete", icon: "🎯", date: "Jan 15, 2024", description: "Completed your first week of tracking" },
    { title: "Calorie Deficit Master", icon: "🔥", date: "Feb 1, 2024", description: "Maintained calorie deficit for 2 weeks" },
    { title: "Workout Warrior", icon: "💪", date: "Feb 20, 2024", description: "Completed 50 workouts" },
    { title: "Consistency Champion", icon: "⭐", date: "Mar 5, 2024", description: "15-day tracking streak" },
  ]

  const weeklyStats = [
    { day: 'Mon', calories: 2100, goal: 2000 },
    { day: 'Tue', calories: 1950, goal: 2000 },
    { day: 'Wed', calories: 2200, goal: 2000 },
    { day: 'Thu', calories: 1850, goal: 2000 },
    { day: 'Fri', calories: 2050, goal: 2000 },
    { day: 'Sat', calories: 2300, goal: 2000 },
    { day: 'Sun', calories: 1900, goal: 2000 },
  ]

  const goals = [
    { title: "Lose 2kg", progress: 75, target: "March 31", type: "Weight" },
    { title: "Exercise 5x/week", progress: 80, target: "Ongoing", type: "Activity" },
    { title: "10,000 steps daily", progress: 60, target: "Daily", type: "Activity" },
    { title: "Drink 8 glasses water", progress: 90, target: "Daily", type: "Nutrition" },
  ]

  const weightProgress = ((userStats.currentWeight - userStats.goalWeight) / (75 - userStats.goalWeight)) * 100

  const handleOAuthConfig = () => {
    // Trigger the main OAuth config modal from App.tsx
    window.dispatchEvent(new CustomEvent('showOAuthConfig'))
  }

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={googleUser?.picture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"} />
          <AvatarFallback>{userStats.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl">{userStats.name}</h1>
          <p className="text-muted-foreground">
            Member since {userStats.joinDate}
            {googleUser && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          <Edit size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="mx-auto mb-2 text-orange-500" size={24} />
            <div className="text-xl">{userStats.streakDays}</div>
            <p className="text-sm text-muted-foreground">Day streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-xl">{userStats.totalWorkouts}</div>
            <p className="text-sm text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-xl">L{userStats.level}</div>
            <p className="text-sm text-muted-foreground">Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-xl">{userStats.totalXP}</div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management Card */}
      <Card className={`${
        subscriptionTier === 'pro' ? 'border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20' :
        subscriptionTier === 'premium' ? 'border-orange-200 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20' :
        'border-border bg-muted/20'
      } transition-all duration-300`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {subscriptionTier === 'pro' ? (
              <Sparkles className="text-purple-500" size={20} />
            ) : subscriptionTier === 'premium' ? (
              <Crown className="text-orange-500" size={20} />
            ) : (
              <CreditCard className="text-muted-foreground" size={20} />
            )}
            Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {subscriptionTier === 'pro' ? '✨ Pro Plan' : 
                 subscriptionTier === 'premium' ? '👑 Premium Plan' : 
                 '🆓 Free Plan'}
              </p>
              <p className="text-sm text-muted-foreground">
                {subscriptionTier === 'pro' ? 'All features + AI recommendations & coaching' : 
                 subscriptionTier === 'premium' ? 'Advanced tracking & nutrition features' : 
                 'Basic fitness tracking features'}
              </p>
            </div>
            <div className="text-right">
              {subscriptionTier !== 'free' ? (
                <div>
                  <p className="font-bold text-lg">
                    ${subscriptionTier === 'pro' ? '19.99' : '9.99'}
                  </p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              ) : (
                <Badge variant="outline" className="bg-muted">
                  Free
                </Badge>
              )}
            </div>
          </div>
          
          {/* Current Plan Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Your Plan Includes:</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              {subscriptionTier === 'pro' ? (
                <>
                  <p>✅ Everything in Premium</p>
                  <p>✅ AI meal recommendations</p>
                  <p>✅ Advanced strength tiers</p>
                  <p>✅ Social features & coaching</p>
                  <p>✅ Data export & reports</p>
                  <p>✅ 24/7 premium support</p>
                </>
              ) : subscriptionTier === 'premium' ? (
                <>
                  <p>✅ Advanced nutrition tracking</p>
                  <p>✅ Custom workout plans</p>
                  <p>✅ Detailed analytics</p>
                  <p>✅ Barcode scanning</p>
                  <p>✅ Progress photos</p>
                  <p>✅ Priority support</p>
                </>
              ) : (
                <>
                  <p>✅ Basic calorie tracking</p>
                  <p>✅ Simple workout logging</p>
                  <p>✅ Basic progress stats</p>
                  <p>⭐ Upgrade for more features</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={subscriptionTier === 'free' ? 'default' : 'outline'}
              size="sm"
              onClick={onManageSubscription}
              className="flex-1"
            >
              <CreditCard size={16} className="mr-2" />
              {subscriptionTier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
            </Button>
            {subscriptionTier !== 'free' && (
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* OAuth Configuration Card */}
      <Card className={oauthStatus.isDemoMode ? "border-orange-200 bg-orange-50/30 dark:bg-orange-950/20" : "border-green-200 bg-green-50/30 dark:bg-green-950/20"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {oauthStatus.isConfigured ? (
              <Wifi className="text-green-500" size={20} />
            ) : (
              <WifiOff className="text-orange-500" size={20} />
            )}
            Google OAuth Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {oauthStatus.isConfigured ? '✅ Configured' : '⚠️ Demo Mode'}
              </p>
              <p className="text-sm text-muted-foreground">
                {oauthStatus.isConfigured 
                  ? 'Google Sign-In is active and working' 
                  : 'Configure Google OAuth for production use'
                }
              </p>
            </div>
            <Button 
              variant={oauthStatus.isConfigured ? "outline" : "default"}
              size="sm"
              onClick={handleOAuthConfig}
            >
              <Key size={16} className="mr-2" />
              {oauthStatus.isConfigured ? 'Manage' : 'Configure'}
            </Button>
          </div>
          {oauthStatus.isDemoMode && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• All features work with demo data</p>
              <p>• Configure for real Google authentication</p>
              <p>• Easy one-click setup available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            Weight Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-2xl">{userStats.currentWeight} kg</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Goal Weight</p>
                <p className="text-2xl">{userStats.goalWeight} kg</p>
              </div>
            </div>
            <Progress value={Math.max(0, 100 - weightProgress)} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              {Math.abs(userStats.currentWeight - userStats.goalWeight)} kg to goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed sections */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Current Goals</h3>
            <Button variant="outline" size="sm">
              <Target size={16} className="mr-2" />
              Add Goal
            </Button>
          </div>
          
          {goals.map((goal, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant="outline">{goal.type}</Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{goal.progress}% complete</span>
                    <span>Target: {goal.target}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-3">
          <h3>Recent Achievements</h3>
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {achievement.date}
                    </div>
                  </div>
                  <Award className="text-yellow-500" size={20} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stats" className="space-y-3">
          <h3>Weekly Overview</h3>
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-12">{day.day}</span>
                    <div className="flex-1 mx-4">
                      <Progress 
                        value={(day.calories / day.goal) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {day.calories} cal
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl text-orange-600">{userStats.caloriesBurned.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Calories burned</p>
                </div>
                <div>
                  <div className="text-2xl text-blue-600">{userStats.totalWorkouts}</div>
                  <p className="text-sm text-muted-foreground">Total workouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-3">
          <FitnessRadarChart 
            userProfile={userProfile}
            userStats={propUserStats}
          />
        </TabsContent>
      </Tabs>

      {/* User Info Card */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="text-blue-500" size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{userStats.age} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">{userStats.height}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <p className="font-medium capitalize">{userStats.activityLevel.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="font-medium capitalize">{userStats.fitnessGoal} weight</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Daily Calories</p>
                <p className="font-medium">{userStats.dailyCalories} cal</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Workout Frequency</p>
                <p className="font-medium">{userStats.workoutFrequency}x per week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings & Actions */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings size={20} className="mr-3" />
            Settings & Preferences
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10"
            onClick={async () => {
              // Sign out from Google if user is signed in with Google
              if (googleUser) {
                try {
                  const { default: googleOAuthService } = await import('./GoogleOAuthService')
                  await googleOAuthService.signOut()
                  localStorage.removeItem('google_auth_token')
                  localStorage.removeItem('google_user')
                } catch (error) {
                  console.error('Google sign-out error:', error)
                }
              }
              onLogout()
            }}
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
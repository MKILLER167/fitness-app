import { Home } from '../components/Home'
import { EnhancedMeals } from '../components/EnhancedMeals'
import { EnhancedExercises } from '../components/EnhancedExercises'
import { StrengthTraining } from '../components/StrengthTraining'
import { StatsSection } from '../components/StatsSection'
import { Profile } from '../components/Profile'
import { DietPlans } from '../components/DietPlans'
import { WorkoutSplits } from '../components/WorkoutSplits'
import { CompareSection } from '../components/CompareSection'
import { SocialHub } from '../components/SocialHub'
import { AchievementSystem } from '../components/AchievementSystem'
import { Guide } from '../components/Guide'
import type { User, UserStats, SubscriptionTier } from '../types/app'

interface ComponentRendererProps {
  activeTab: string
  user: User | null
  userStats: UserStats
  handleXPGain: (xp: number, reason: string) => void
  handlePremiumFeatureAccess: (featureName: string) => boolean
  handleProFeatureAccess: (featureName: string) => boolean
  onLogout: () => void
  onManageSubscription: () => void
}

export function renderActiveComponent({
  activeTab,
  user,
  userStats,
  handleXPGain,
  handlePremiumFeatureAccess,
  handleProFeatureAccess,
  onLogout,
  onManageSubscription
}: ComponentRendererProps) {
  const commonProps = {
    userProfile: user?.profile,
    subscriptionTier: user?.subscriptionTier as SubscriptionTier,
    onXPGain: handleXPGain,
    onPremiumFeatureAccess: handlePremiumFeatureAccess,
    onManageSubscription: onManageSubscription
  }

  switch (activeTab) {
    case 'home':
      return (
        <Home 
          {...commonProps}
          userStats={userStats}
        />
      )
    case 'meals':
      return (
        <EnhancedMeals 
          {...commonProps}
        />
      )
    case 'workouts':
      return (
        <EnhancedExercises 
          {...commonProps}
        />
      )
    case 'strength':
      return (
        <StrengthTraining 
          {...commonProps}
          onProFeatureAccess={handleProFeatureAccess}
        />
      )
    case 'stats':
      return (
        <StatsSection 
          {...commonProps}
          userStats={userStats}
        />
      )
    case 'profile':
      return (
        <Profile 
          userProfile={user?.profile}
          userStats={userStats}
          onLogout={onLogout}
          subscriptionTier={user?.subscriptionTier as SubscriptionTier}
          onManageSubscription={onManageSubscription}
        />
      )
    case 'diet-plans':
      return (
        <DietPlans 
          {...commonProps}
        />
      )
    case 'workout-splits':
      return (
        <WorkoutSplits 
          {...commonProps}
        />
      )
    case 'compare':
      return (
        <CompareSection 
          {...commonProps}
          userStats={userStats}
        />
      )
    case 'social':
      return (
        <SocialHub 
          {...commonProps}
          userStats={userStats}
          onProFeatureAccess={handleProFeatureAccess}
        />
      )
    case 'achievements':
      return (
        <AchievementSystem 
          userStats={userStats}
          onXPGain={handleXPGain}
          subscriptionTier={user?.subscriptionTier as SubscriptionTier}
        />
      )
    case 'guide':
      return (
        <Guide 
          {...commonProps}
        />
      )
    default:
      return (
        <Home 
          {...commonProps}
          userStats={userStats}
        />
      )
  }
}
import { useState } from 'react'
import { toast } from 'sonner@2.0.3'

interface UseSubscriptionManagementProps {
  user: any
  updateUserSubscription: (tier: string) => any
  handleXPGain: (amount: number, reason: string) => void
  language: string
}

export function useSubscriptionManagement({
  user,
  updateUserSubscription,
  handleXPGain,
  language
}: UseSubscriptionManagementProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubscriptionChange = (tier: 'free' | 'premium' | 'pro') => {
    if (isProcessing) return null
    
    setIsProcessing(true)
    
    try {
      const updatedUser = updateUserSubscription(tier)
      
      if (updatedUser) {
        // Award XP for subscription upgrade
        if (tier === 'premium') {
          handleXPGain(200, language === 'ar' ? 'ترقية إلى بريميوم' : 'Upgrading to Premium')
        } else if (tier === 'pro') {
          handleXPGain(500, language === 'ar' ? 'ترقية إلى برو' : 'Upgrading to Pro')
        }

        // Show subscription success toast with custom styling
        const subscriptionMessages = {
          free: {
            title: language === 'ar' ? 'خطة مجانية' : 'Free Plan',
            description: language === 'ar' ? 'تم التغيير إلى الخطة المجانية' : 'Changed to Free plan'
          },
          premium: {
            title: language === 'ar' ? 'مرحباً بك في بريميوم!' : 'Welcome to Premium!',
            description: language === 'ar' ? 'استمتع بالميزات المتقدمة' : 'Enjoy advanced features'
          },
          pro: {
            title: language === 'ar' ? 'مرحباً بك في برو!' : 'Welcome to Pro!',
            description: language === 'ar' ? 'استمتع بجميع الميزات المتقدمة' : 'Enjoy all premium features'
          }
        }

        const message = subscriptionMessages[tier]
        
        toast.success(message.title, {
          description: message.description,
          className: 'subscription-toast',
          duration: 5000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '500'
          }
        })
      }
      
      return updatedUser
    } catch (error) {
      console.error('Subscription error:', error)
      
      toast.error(
        language === 'ar' ? 'خطأ في الاشتراك' : 'Subscription Error',
        { 
          description: language === 'ar' 
            ? 'حدث خطأ أثناء تحديث الاشتراك' 
            : 'An error occurred while updating subscription',
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--destructive)'
          }
        }
      )
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePremiumFeatureAccess = (featureName: string, onUpgrade: () => void) => {
    if (!user) return false
    
    const hasAccess = user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro'
    
    if (!hasAccess) {
      toast.error(
        language === 'ar' ? 'ميزة مدفوعة' : 'Premium Feature',
        {
          description: language === 'ar' 
            ? 'هذه الميزة متاحة للمشتركين المميزين فقط'
            : 'This feature is available for Premium subscribers only',
          action: {
            label: language === 'ar' ? 'ترقية' : 'Upgrade',
            onClick: onUpgrade
          },
          duration: 6000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '500'
          }
        }
      )
    }
    
    return hasAccess
  }

  const handleProFeatureAccess = (featureName: string, onUpgrade: () => void) => {
    if (!user) return false
    
    const hasAccess = user.subscriptionTier === 'pro'
    
    if (!hasAccess) {
      toast.error(
        language === 'ar' ? 'ميزة برو' : 'Pro Feature',
        {
          description: language === 'ar' 
            ? 'هذه الميزة متاحة لمشتركي برو فقط'
            : 'This feature is available for Pro subscribers only',
          action: {
            label: language === 'ar' ? 'ترقية إلى برو' : 'Upgrade to Pro',
            onClick: onUpgrade
          },
          duration: 6000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '2px solid var(--primary)',
            fontWeight: '500'
          }
        }
      )
    }
    
    return hasAccess
  }

  return {
    handleSubscriptionChange,
    handlePremiumFeatureAccess,
    handleProFeatureAccess,
    isProcessing
  }
}
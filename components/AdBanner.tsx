"use client"

import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Crown, Zap, ShieldOff } from 'lucide-react'
import { useLanguage } from './LanguageContext'
import { motion, AnimatePresence } from 'motion/react'

interface AdBannerProps {
  subscriptionTier?: string
  onUpgrade?: () => void
  position?: 'top' | 'bottom' | 'inline'
  size?: 'small' | 'medium' | 'large'
  dismissible?: boolean
}

const AD_CONTENT = [
  {
    title: 'FitBoost Pro Supplements',
    titleAr: 'مكملات فيت بوست برو',
    description: 'Premium protein powder - 30% off first order!',
    descriptionAr: 'مسحوق البروتين المميز - خصم 30% على الطلب الأول!',
    cta: 'Shop Now',
    ctaAr: 'تسوق الآن',
    color: 'from-blue-500 to-purple-500'
  },
  {
    title: 'SmartFit Tracker',
    titleAr: 'متتبع سمارت فيت',
    description: 'Advanced fitness tracking with AI insights',
    descriptionAr: 'تتبع اللياقة المتقدم مع رؤى الذكاء الاصطناعي',
    cta: 'Learn More',
    ctaAr: 'اعرف المزيد',
    color: 'from-green-500 to-blue-500'
  },
  {
    title: 'NutriMeal Delivery',
    titleAr: 'توصيل نوتري ميل',
    description: 'Fresh, healthy meals delivered to your door',
    descriptionAr: 'وجبات صحية طازجة تُوصل إلى بابك',
    cta: 'Order Today',
    ctaAr: 'اطلب اليوم',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'FlexGym Membership',
    titleAr: 'عضوية فليكس جيم',
    description: '24/7 gym access - No contracts, cancel anytime',
    descriptionAr: 'دخول الجيم 24/7 - بدون عقود، ألغِ في أي وقت',
    cta: 'Join Now',
    ctaAr: 'انضم الآن',
    color: 'from-purple-500 to-pink-500'
  }
]

export function AdBanner({ 
  subscriptionTier = 'free', 
  onUpgrade, 
  position = 'inline',
  size = 'medium',
  dismissible = true 
}: AdBannerProps) {
  // Always call all hooks first - no early returns before hooks
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const { language } = useLanguage()

  // Rotate ads every 30 seconds
  useEffect(() => {
    // Only set up interval if we should show ads
    if (subscriptionTier === 'free' && !isDismissed) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % AD_CONTENT.length)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [subscriptionTier, isDismissed])

  // Show upgrade prompt every 3rd ad rotation
  useEffect(() => {
    if (subscriptionTier === 'free' && !isDismissed && currentAdIndex > 0 && currentAdIndex % 3 === 0) {
      setShowUpgradePrompt(true)
      const timer = setTimeout(() => setShowUpgradePrompt(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [currentAdIndex, subscriptionTier, isDismissed])

  // Now handle conditional rendering after all hooks are called
  // Don't show ads for subscribers
  if (subscriptionTier !== 'free') {
    return null
  }

  // Don't show if dismissed
  if (isDismissed) {
    return null
  }

  const currentAd = AD_CONTENT[currentAdIndex]

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-3 text-sm'
      case 'large':
        return 'p-6 text-base'
      default:
        return 'p-4 text-sm'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0'
      case 'bottom':
        return 'fixed bottom-20 left-0 right-0 z-40 rounded-none border-x-0 border-b-0'
      default:
        return 'rounded-lg'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'top' ? -50 : position === 'bottom' ? 50 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -50 : position === 'bottom' ? 50 : 0 }}
        transition={{ duration: 0.3 }}
        className={`relative ${position === 'inline' ? 'my-4' : ''}`}
      >
        <Card className={`
          ${getSizeClasses()} 
          ${getPositionClasses()}
          bg-gradient-to-r ${currentAd.color} 
          text-white border-0 overflow-hidden
          hover:shadow-lg transition-all duration-300
        `}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-white/20 text-white"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {/* Ad Label */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              {language === 'ar' ? 'إعلان' : 'Ad'}
            </Badge>
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${size === 'large' ? 'text-lg' : 'text-base'}`}>
                {language === 'ar' ? currentAd.titleAr : currentAd.title}
              </h3>
              <p className="text-white/90 mb-3">
                {language === 'ar' ? currentAd.descriptionAr : currentAd.description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {language === 'ar' ? currentAd.ctaAr : currentAd.cta}
              </Button>
            </div>

            {/* Upgrade Prompt Overlay */}
            <AnimatePresence>
              {showUpgradePrompt && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-black/80 rounded-lg flex items-center justify-center"
                >
                  <div className="text-center p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ShieldOff className="h-5 w-5 text-green-400" />
                      <Crown className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h4 className="font-semibold mb-2">
                      {language === 'ar' ? 'تجربة بدون إعلانات' : 'Ad-Free Experience'}
                    </h4>
                    <p className="text-sm text-white/80 mb-3">
                      {language === 'ar' ? 
                        'ارقِ إلى Premium واستمتع بتجربة بدون إعلانات' : 
                        'Upgrade to Premium and enjoy an ad-free experience'
                      }
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={onUpgrade}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'ارقِ الآن' : 'Upgrade Now'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUpgradePrompt(false)}
                        className="text-white hover:bg-white/20"
                      >
                        {language === 'ar' ? 'لاحقاً' : 'Later'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ad Indicator Dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {AD_CONTENT.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to check if user should see ads
export function useAdDisplay(subscriptionTier?: string) {
  const shouldShowAds = subscriptionTier === 'free' || !subscriptionTier
  const isAdFree = subscriptionTier === 'premium' || subscriptionTier === 'pro'
  
  return {
    shouldShowAds,
    isAdFree
  }
}
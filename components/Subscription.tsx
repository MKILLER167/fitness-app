"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { useLanguage } from './LanguageContext'
import { motion } from 'motion/react'
import { 
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Camera,
  Dumbbell,
  Apple,
  X,
  Sparkles,
  ShieldOff,
  Save
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { FeatureCard } from './FeatureCard'

export type SubscriptionTier = 'free' | 'premium' | 'pro'
export type BillingPeriod = 'monthly' | 'yearly'

interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  nameAr: string
  monthlyPrice: number
  yearlyPrice: number
  period: string
  periodAr: string
  popular?: boolean
  features: string[]
  featuresAr: string[]
  icon: React.ReactNode
  color: string
  gradient: string
  yearlyDiscount?: number
}

interface SubscriptionProps {
  currentTier?: SubscriptionTier
  onSubscribe?: (tier: SubscriptionTier, period?: BillingPeriod) => void
  onClose?: () => void
  showCloseButton?: boolean
}

export function Subscription({ currentTier = 'free', onSubscribe, onClose, showCloseButton = false }: SubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(currentTier)
  const [isLoading, setIsLoading] = useState<SubscriptionTier | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const { language, direction } = useLanguage()

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      nameAr: 'مجاني',
      monthlyPrice: 0,
      yearlyPrice: 0,
      period: 'Forever',
      periodAr: 'إلى الأبد',
      features: [
        'Basic calorie tracking',
        'Simple workout logging',
        'Basic progress stats',
        '3 custom meals',
        'Standard support',
        'Ads supported'
      ],
      featuresAr: [
        'تتبع السعرات الأساسي',
        'تسجيل التمارين البسيط',
        'إحصائيات التقدم الأساسية',
        '3 وجبات مخصصة',
        'دعم قياسي',
        'مدعوم بالإعلانات'
      ],
      icon: <Target className="h-6 w-6" />,
      color: 'text-muted-foreground',
      gradient: 'from-muted/20 to-muted/10'
    },
    {
      id: 'premium',
      name: 'Premium',
      nameAr: 'مميز',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      period: 'per month',
      periodAr: 'في الشهر',
      popular: true,
      yearlyDiscount: 17, // 2 months free
      features: [
        'Everything in Free',
        '✨ No ads experience',
        'Advanced nutrition tracking',
        'Custom workout plans',
        'Detailed analytics',
        'Unlimited custom meals',
        'Barcode scanning',
        'Progress photos',
        'Priority support'
      ],
      featuresAr: [
        'كل ما في المجاني',
        '✨ تجربة بدون إعلانات',
        'تتبع التغذية المتقدم',
        'خطط التمرين المخصصة',
        'تحليلات مفصلة',
        'وجبات مخصصة غير محدودة',
        'مسح الباركود',
        'صور التقدم',
        'دعم أولوية'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'text-orange-500',
      gradient: 'from-orange-500/20 to-yellow-500/10'
    },
    {
      id: 'pro',
      name: 'Pro',
      nameAr: 'احترافي',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      period: 'per month',
      periodAr: 'في الشهر',
      yearlyDiscount: 17, // 2 months free
      features: [
        'Everything in Premium',
        '✨ Ad-free forever',
        'AI meal recommendations',
        'Advanced strength tiers',
        'Social features',
        'Meal planning assistant',
        'Export data & reports',
        'White-label coaching',
        '24/7 premium support'
      ],
      featuresAr: [
        'كل ما في المميز',
        '✨ بدون إعلانات إلى الأبد',
        'توصيات الوجبات بالذكاء الاصطناعي',
        'مستويات القوة المتقدمة',
        'الميزات الاجتماعية',
        'مساعد تخطيط الوجبات',
        'تصدير البيانات والتقارير',
        'التدريب المخصص',
        'دعم مميز 24/7'
      ],
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-pink-500/10'
    }
  ]

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === currentTier) {
      toast.info(
        language === 'ar' ? 'أنت مشترك بالفعل في هذه الخطة' : 'You are already subscribed to this plan'
      )
      return
    }

    if (tier === 'free') {
      onSubscribe?.(tier)
      toast.success(
        language === 'ar' ? 'تم التبديل إلى الخطة المجانية' : 'Switched to Free plan'
      )
      return
    }

    setIsLoading(tier)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onSubscribe?.(tier, billingPeriod)
      
      const planName = language === 'ar' ? plans.find(p => p.id === tier)?.nameAr : plans.find(p => p.id === tier)?.name
      const periodText = billingPeriod === 'yearly' ? 
        (language === 'ar' ? 'السنوي' : 'Yearly') : 
        (language === 'ar' ? 'الشهري' : 'Monthly')
      
      toast.success(
        language === 'ar' ? `🎉 مرحباً بك في ${planName} ${periodText}!` : `🎉 Welcome to ${planName} ${periodText}!`,
        {
          description: language === 'ar' ? 
            'تم تفعيل اشتراكك بنجاح - استمتع بتجربة بدون إعلانات!' : 
            'Your subscription has been activated successfully - Enjoy your ad-free experience!',
          duration: 4000
        }
      )
    } catch (error) {
      toast.error(
        language === 'ar' ? 'فشل في معالجة الدفع' : 'Payment processing failed',
        {
          description: language === 'ar' ? 'يرجى المحاولة مرة أخرى' : 'Please try again'
        }
      )
    } finally {
      setIsLoading(null)
    }
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('ads') || feature.includes('إعلانات')) return <ShieldOff className="h-4 w-4" />
    if (feature.includes('nutrition') || feature.includes('تغذية')) return <Apple className="h-4 w-4" />
    if (feature.includes('workout') || feature.includes('تمرين')) return <Dumbbell className="h-4 w-4" />
    if (feature.includes('analytics') || feature.includes('تحليلات')) return <BarChart3 className="h-4 w-4" />
    if (feature.includes('photos') || feature.includes('صور')) return <Camera className="h-4 w-4" />
    if (feature.includes('social') || feature.includes('اجتماعية')) return <Users className="h-4 w-4" />
    if (feature.includes('support') || feature.includes('دعم')) return <Shield className="h-4 w-4" />
    if (feature.includes('AI') || feature.includes('الذكاء')) return <Zap className="h-4 w-4" />
    if (feature.includes('planning') || feature.includes('تخطيط')) return <Calendar className="h-4 w-4" />
    return <Check className="h-4 w-4" />
  }

  const getPrice = (plan: SubscriptionPlan) => {
    if (plan.monthlyPrice === 0) return 0
    return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getPeriodText = (plan: SubscriptionPlan) => {
    if (plan.monthlyPrice === 0) return language === 'ar' ? plan.periodAr : plan.period
    return billingPeriod === 'yearly' ? 
      (language === 'ar' ? 'في السنة' : 'per year') : 
      (language === 'ar' ? plan.periodAr : plan.period)
  }

  const getMonthlyEquivalent = (plan: SubscriptionPlan) => {
    if (billingPeriod === 'yearly' && plan.yearlyPrice > 0) {
      const monthlyEquivalent = plan.yearlyPrice / 12
      return `~$${monthlyEquivalent.toFixed(2)}/mo`
    }
    return null
  }

  const getSavingsPercentage = (plan: SubscriptionPlan) => {
    if (billingPeriod === 'yearly' && plan.yearlyDiscount) {
      return plan.yearlyDiscount
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4" dir={direction}>
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 
                'اختر الخطة التي تناسب أهدافك في اللياقة البدنية' : 
                'Choose the plan that fits your fitness goals'
              }
            </p>
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
            <span className={`text-sm transition-colors ${billingPeriod === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
              {language === 'ar' ? 'شهري' : 'Monthly'}
            </span>
            <Switch
              checked={billingPeriod === 'yearly'}
              onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm transition-colors ${billingPeriod === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
                {language === 'ar' ? 'سنوي' : 'Yearly'}
              </span>
              {billingPeriod === 'yearly' && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Save className="h-3 w-3 mr-1" />
                  {language === 'ar' ? 'وفر 17%' : 'Save 17%'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Current Plan Badge */}
        {currentTier !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="text-sm">
              {language === 'ar' ? 
                `خطتك الحالية: ${plans.find(p => p.id === currentTier)?.nameAr}` : 
                `Current Plan: ${plans.find(p => p.id === currentTier)?.name}`
              }
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const price = getPrice(plan)
          const periodText = getPeriodText(plan)
          const monthlyEquivalent = getMonthlyEquivalent(plan)
          const savings = getSavingsPercentage(plan)

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  </Badge>
                </div>
              )}

              {billingPeriod === 'yearly' && savings && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                    {language === 'ar' ? `وفر ${savings}%` : `${savings}% OFF`}
                  </Badge>
                </div>
              )}

              <Card className={`
                relative overflow-hidden transition-all duration-300 hover:shadow-lg
                ${plan.id === currentTier ? 'ring-2 ring-primary' : ''}
                ${plan.popular ? 'border-primary/50' : ''}
              `}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
                
                <CardHeader className="relative z-10 text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm mb-4 ${plan.color}`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-xl mb-2">
                    {language === 'ar' ? plan.nameAr : plan.name}
                  </CardTitle>
                  
                  <div className="space-y-1">
                    <div className="text-3xl font-bold ltr-numbers">
                      {price === 0 ? (
                        language === 'ar' ? 'مجاناً' : 'Free'
                      ) : (
                        `$${price}`
                      )}
                    </div>
                    {price > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {periodText}
                        </div>
                        {monthlyEquivalent && (
                          <div className="text-xs text-muted-foreground">
                            {monthlyEquivalent}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {(language === 'ar' ? plan.featuresAr : plan.features).map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                        className="flex items-start gap-3"
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${plan.color} ${
                          feature.includes('ads') || feature.includes('إعلانات') ? 'text-green-500' : ''
                        }`}>
                          {getFeatureIcon(feature)}
                        </div>
                        <span className={`text-sm ${
                          feature.includes('ads') || feature.includes('إعلانات') ? 'font-medium text-green-600 dark:text-green-400' : ''
                        }`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading === plan.id}
                    className={`
                      w-full h-12 transition-all duration-300
                      ${plan.id === currentTier 
                        ? 'bg-muted text-muted-foreground cursor-default' 
                        : plan.popular 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                          : 'bg-background hover:bg-muted border-2 border-border hover:border-primary/50'
                      }
                    `}
                    variant={plan.id === currentTier ? 'secondary' : plan.popular ? 'default' : 'outline'}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                      </div>
                    ) : plan.id === currentTier ? (
                      language === 'ar' ? 'خطتك الحالية' : 'Current Plan'
                    ) : plan.monthlyPrice === 0 ? (
                      language === 'ar' ? 'اختيار مجاني' : 'Choose Free'
                    ) : (
                      <>
                        {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                        {billingPeriod === 'yearly' && savings && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {language === 'ar' ? `وفر ${savings}%` : `${savings}% OFF`}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>

                  {/* Upgrade/Downgrade Info */}
                  {plan.id !== currentTier && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-muted-foreground">
                        {plan.monthlyPrice === 0 ? (
                          language === 'ar' ? 'يمكنك التراجع في أي وقت' : 'You can downgrade anytime'
                        ) : currentTier === 'free' ? (
                          language === 'ar' ? 'يمكنك الإلغاء في أي وقت' : 'Cancel anytime'
                        ) : (
                          language === 'ar' ? 'فوري، بدون التزام' : 'Instant, no commitment'
                        )}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Feature Highlights */}
      <div className="max-w-4xl mx-auto mt-12 mb-8">
        <h2 className="text-xl font-semibold text-center mb-6">
          {language === 'ar' ? 'لماذا الترقية؟' : 'Why Upgrade?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title={language === 'ar' ? 'بدون إعلانات' : 'Ad-Free Experience'}
            description={language === 'ar' ? 'استمتع بتجربة نظيفة وسلسة' : 'Enjoy a clean, uninterrupted experience'}
            icon={ShieldOff}
            gradient="linear-gradient(to left, #4facfe 0%, #00f2fe 100%)"
            badge={language === 'ar' ? 'مميز+' : 'Premium+'}
            size="sm"
          />

          <FeatureCard
            title={language === 'ar' ? 'تحليلات متقدمة' : 'Advanced Analytics'}
            description={language === 'ar' ? 'تتبع مفصل للتقدم والأهداف' : 'Detailed progress tracking and goal analysis'}
            icon={BarChart3}
            gradient="linear-gradient(to left, #667eea 0%, #764ba2 100%)"
            badge={language === 'ar' ? 'مميز' : 'Premium'}
            size="sm"
          />
          
          <FeatureCard
            title={language === 'ar' ? 'الذكاء الاصطناعي' : 'AI Recommendations'}
            description={language === 'ar' ? 'توصيات ذكية للوجبات والتمارين' : 'Smart meal and workout suggestions'}
            icon={Sparkles}
            gradient="linear-gradient(to left, #f093fb 0%, #f5576c 100%)"
            badge={language === 'ar' ? 'احترافي' : 'Pro'}
            size="sm"
          />
          
          <FeatureCard
            title={language === 'ar' ? 'المجتمع' : 'Social Features'}
            description={language === 'ar' ? 'تحديات ومنافسات مع الأصدقاء' : 'Challenges and competitions with friends'}
            icon={Users}
            gradient="linear-gradient(to left, #a8edea 0%, #fed6e3 100%)"
            badge={language === 'ar' ? 'احترافي' : 'Pro'}
            size="sm"
          />
        </div>
      </div>

      {/* Savings Highlight for Yearly */}
      {billingPeriod === 'yearly' && (
        <div className="max-w-4xl mx-auto mt-8 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/20 rounded-lg p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Save className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                {language === 'ar' ? 'وفر مع الاشتراك السنوي!' : 'Save with Yearly Subscription!'}
              </h3>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              {language === 'ar' ? 
                'احصل على شهرين مجاناً عند الاشتراك السنوي - وفر حتى 17% مقارنة بالاشتراك الشهري' : 
                'Get 2 months free with yearly subscription - Save up to 17% compared to monthly billing'
              }
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="font-semibold mb-2">
            {language === 'ar' ? '💡 ملاحظة مهمة' : '💡 Important Note'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {language === 'ar' ? 
              'جميع الاشتراكات تشمل فترة تجريبية مجانية لمدة 7 أيام. يمكنك الإلغاء في أي وقت قبل انتهاء الفترة التجريبية.' : 
              'All subscriptions include a 7-day free trial. You can cancel anytime before the trial ends.'
            }
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <ShieldOff className="h-4 w-4" />
            <span>
              {language === 'ar' ? 
                'المشتركون يستمتعون بتجربة بدون إعلانات تماماً' : 
                'Subscribers enjoy a completely ad-free experience'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from 'react'
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { 
  Settings, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Info,
  Database,
  Smartphone,
  Heart,
  Target,
  Activity,
  Languages,
  Menu,
  Zap,
  Dumbbell,
  Utensils,
  ChefHat,
  Calendar,
  Trophy,
  BarChart3,
  Users,
  BookOpen,
  Award,
  Globe,
  Crown,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { useLanguage } from './LanguageContext'
import type { UserProfile } from './Onboarding'
import { toast } from 'sonner@2.0.3'

interface UserStats {
  totalXP: number
  level: number
  achievements: number
  workoutsCompleted: number
  tiersUnlocked: number
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isDarkMode: boolean
  onDarkModeToggle: () => void
  onSettingsOpen: (section: string) => void
  userProfile?: UserProfile
  userStats?: UserStats
  onLogout: () => void
  onShowOnboarding?: () => void
  isMobile?: boolean
  subscriptionTier?: 'free' | 'premium' | 'pro'
}

export function Sidebar({ isOpen, onToggle, isDarkMode, onDarkModeToggle, onSettingsOpen, userProfile, userStats, onLogout, onShowOnboarding, isMobile, subscriptionTier = 'free' }: SidebarProps) {
  const { language, setLanguage, t, direction } = useLanguage()
  
  // Quick Navigation Items with Arabic support
  const quickNavItems = [
    { 
      id: 'diet-plans', 
      label: language === 'ar' ? 'خطط الحمية' : 'Diet Plans', 
      icon: ChefHat, 
      color: 'text-orange-500' 
    },
    { 
      id: 'workout-splits', 
      label: language === 'ar' ? 'تقسيمات التمرين' : 'Workout Splits', 
      icon: Dumbbell, 
      color: 'text-blue-500' 
    },
    { 
      id: 'strength', 
      label: language === 'ar' ? 'تدريب القوة' : 'Strength Training', 
      icon: Trophy, 
      color: 'text-yellow-500' 
    },
    { 
      id: 'compare', 
      label: language === 'ar' ? 'مقارنة التقدم' : 'Progress Compare', 
      icon: BarChart3, 
      color: 'text-purple-500' 
    },
    { 
      id: 'social', 
      label: language === 'ar' ? 'المجتمع' : 'Social Hub', 
      icon: Users, 
      color: 'text-green-500' 
    },
    { 
      id: 'achievements', 
      label: language === 'ar' ? 'الإنجازات' : 'Achievements', 
      icon: Award, 
      color: 'text-amber-500' 
    },
    { 
      id: 'stats', 
      label: language === 'ar' ? 'الإحصائيات' : 'Fitness Stats', 
      icon: BarChart3, 
      color: 'text-purple-500' 
    },
    { 
      id: 'guide', 
      label: language === 'ar' ? 'الدليل' : 'Fitness Guide', 
      icon: BookOpen, 
      color: 'text-indigo-500' 
    }
  ]
  
  const menuItems = [
    {
      section: 'account',
      title: language === 'ar' ? 'إعدادات الحساب' : 'Account Settings',
      icon: User,
      items: [
        { 
          label: language === 'ar' ? 'معلومات الملف الشخصي' : 'Profile Information', 
          action: () => onSettingsOpen('profile') 
        },
        { 
          label: language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings', 
          action: () => onSettingsOpen('privacy') 
        },
        { 
          label: language === 'ar' ? 'تصدير البيانات' : 'Data Export', 
          action: () => onSettingsOpen('data') 
        },
        { 
          label: language === 'ar' ? 'إدارة الاشتراك' : 'Manage Subscription', 
          action: () => onSettingsOpen('subscription') 
        },
      ]
    },
    {
      section: 'app',
      title: language === 'ar' ? 'إعدادات التطبيق' : 'App Settings',
      icon: Settings,
      items: [
        { 
          label: language === 'ar' ? 'الإشعارات' : 'Notifications', 
          action: () => onSettingsOpen('notifications') 
        },
        { 
          label: language === 'ar' ? 'الوحدات والقياسات' : 'Units & Measurements', 
          action: () => onSettingsOpen('units') 
        },
        { 
          label: language === 'ar' ? 'إعدادات الأهداف' : 'Goal Settings', 
          action: () => onSettingsOpen('goals') 
        },
      ]
    },
    {
      section: 'support',
      title: language === 'ar' ? 'الدعم والمعلومات' : 'Support & Info',
      icon: HelpCircle,
      items: [
        { 
          label: language === 'ar' ? 'حول فيت تراكر' : 'About FitTracker', 
          action: () => onSettingsOpen('about') 
        },
        { 
          label: language === 'ar' ? 'المساعدة والأسئلة الشائعة' : 'Help & FAQ', 
          action: () => onSettingsOpen('help') 
        },
        { 
          label: language === 'ar' ? 'الاتصال بالدعم' : 'Contact Support', 
          action: () => onSettingsOpen('contact') 
        },
        { 
          label: language === 'ar' ? 'الشروط والخصوصية' : 'Terms & Privacy', 
          action: () => onSettingsOpen('terms') 
        },
      ]
    }
  ]

  const handleNavigation = (path: string) => {
    // Get the navigation function from the parent component
    window.location.hash = path
    onToggle() // Close sidebar after navigation on mobile
  }

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage)
    toast.success(
      newLanguage === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English',
      {
        description: newLanguage === 'ar' ? 'سيتم تطبيق التغييرات فوراً' : 'Changes will be applied immediately'
      }
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar - Enhanced with RTL support */}
      <div className={`fixed top-0 ${direction === 'rtl' ? 'right-0' : 'left-0'} h-full bg-sidebar border-${direction === 'rtl' ? 'l' : 'r'} border-sidebar-border z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : (direction === 'rtl' ? 'translate-x-full' : '-translate-x-full')
      } w-80 overflow-y-auto ${direction === 'rtl' ? 'text-right' : ''}`}>
        
        {/* Enhanced Header with Logo */}
        <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {/* Modern Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Dumbbell className="text-white" size={24} />
                </div>
                <div className={`absolute -top-1 ${direction === 'rtl' ? '-left-1' : '-right-1'} w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center`}>
                  <Zap className="text-white" size={8} />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {language === 'ar' ? 'فيت تراكر' : 'FitTracker'}
                </h2>
                <p className="text-xs text-sidebar-foreground/60 font-medium">
                  {language === 'ar' ? 'الإصدار المتقدم 2.1.0' : 'Pro Version 2.1.0'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle} className="hover:bg-sidebar-accent">
              {direction === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>
          
          {/* Enhanced User Profile Summary */}
          {userProfile && (
            <div className="p-4 bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 rounded-xl border border-sidebar-border/50">
              <div className={`flex items-center gap-3 mb-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sidebar-foreground">{userProfile.name}</p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize">
                    {language === 'ar' ? 'رحلة اللياقة' : userProfile.fitnessGoal + ' Journey'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`flex items-center gap-2 p-2 bg-sidebar-accent/50 rounded-lg ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Target size={14} className="text-primary" />
                  <div>
                    <div className="font-medium">{userProfile.dailyCalorieGoal}</div>
                    <div className="text-sidebar-foreground/60">
                      {language === 'ar' ? 'سعرة/يوم' : 'cal/day'}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-2 bg-sidebar-accent/50 rounded-lg ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Activity size={14} className="text-primary" />
                  <div>
                    <div className="font-medium">{userProfile.workoutFrequency}x</div>
                    <div className="text-sidebar-foreground/60">
                      {language === 'ar' ? '/أسبوع' : '/week'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subscription Badge */}
              <div className="mt-3 pt-3 border-t border-sidebar-border/50">
                <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${
                  subscriptionTier === 'pro' ? 'from-purple-500/10 to-pink-500/10 border-purple-200/30' :
                  subscriptionTier === 'premium' ? 'from-orange-500/10 to-yellow-500/10 border-orange-200/30' :
                  'from-muted/10 to-muted/5 border-border/30'
                } rounded-lg border ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {subscriptionTier === 'pro' ? (
                      <Sparkles size={16} className="text-purple-500" />
                    ) : subscriptionTier === 'premium' ? (
                      <Crown size={16} className="text-orange-500" />
                    ) : (
                      <Target size={16} className="text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 
                        (subscriptionTier === 'pro' ? 'احترافي' : 
                         subscriptionTier === 'premium' ? 'مميز' : 'مجاني') :
                        (subscriptionTier === 'pro' ? 'Pro' : 
                         subscriptionTier === 'premium' ? 'Premium' : 'Free')
                      }
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSettingsOpen('subscription')}
                    className="h-7 px-2 text-xs hover:bg-sidebar-accent"
                  >
                    {subscriptionTier === 'free' ? 
                      (language === 'ar' ? 'ترقية' : 'Upgrade') :
                      (language === 'ar' ? 'إدارة' : 'Manage')
                    }
                  </Button>
                </div>
              </div>

              {/* User Stats Display */}
              {userStats && (
                <div className="mt-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                      <div className="font-bold text-sm">{userStats.level}</div>
                      <div className="text-sidebar-foreground/60">
                        {language === 'ar' ? 'المستوى' : 'Level'}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                      <div className="font-bold text-sm">{userStats.totalXP}</div>
                      <div className="text-sidebar-foreground/60">
                        {language === 'ar' ? 'نقاط خبرة' : 'XP'}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <div className="font-bold text-sm">{userStats.achievements}</div>
                      <div className="text-sidebar-foreground/60">
                        {language === 'ar' ? 'جوائز' : 'Awards'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="p-6 border-b border-sidebar-border">
          <h3 className="font-semibold text-sidebar-foreground mb-4 text-sm uppercase tracking-wide">
            {language === 'ar' ? 'وصول سريع' : 'Quick Access'}
          </h3>
          <div className="space-y-2">
            {quickNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full ${direction === 'rtl' ? 'justify-end' : 'justify-start'} text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg h-10`}
                  onClick={() => {
                    // Navigate to the component
                    const event = new CustomEvent('navigateToTab', { detail: item.id })
                    window.dispatchEvent(event)
                    if (isMobile) onToggle() // Close on mobile
                  }}
                >
                  <Icon className={`${item.color} ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`} size={18} />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="p-6 border-b border-sidebar-border">
          <h3 className="font-semibold text-sidebar-foreground mb-4 text-sm uppercase tracking-wide">
            {language === 'ar' ? 'إعدادات سريعة' : 'Quick Settings'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-lg hover:bg-sidebar-accent/80 transition-colors">
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {isDarkMode ? <Moon size={18} className="text-indigo-500" /> : <Sun size={18} className="text-yellow-500" />}
                <span className="text-sidebar-foreground font-medium">
                  {language === 'ar' ? 'الوضع المظلم' : 'Dark Mode'}
                </span>
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={onDarkModeToggle}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-lg">
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Bell size={18} className="text-blue-500" />
                <span className="text-sidebar-foreground font-medium">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                {language === 'ar' ? 'مفعل' : 'On'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-lg">
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Database size={18} className="text-green-500" />
                <span className="text-sidebar-foreground font-medium">
                  {language === 'ar' ? 'حالة المزامنة' : 'Sync Status'}
                </span>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {language === 'ar' ? 'متصل' : 'Connected'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-sidebar-accent rounded-lg">
              <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Globe size={18} className="text-purple-500" />
                <span className="text-sidebar-foreground font-medium">
                  {language === 'ar' ? 'اللغة' : 'Language'}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleLanguageChange('en')}
                  className="h-7 px-2 text-xs"
                >
                  EN
                </Button>
                <Button
                  variant={language === 'ar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleLanguageChange('ar')}
                  className="h-7 px-2 text-xs"
                >
                  عربي
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1">
          {menuItems.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.section} className="p-6 border-b border-sidebar-border last:border-b-0">
                <div className={`flex items-center gap-3 mb-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Icon size={18} className="text-sidebar-primary" />
                  <h3 className="font-semibold text-sidebar-foreground text-sm uppercase tracking-wide">{section.title}</h3>
                </div>
                <div className="space-y-1">
                  {section.items.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full ${direction === 'rtl' ? 'justify-end' : 'justify-start'} text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg h-10`}
                      onClick={item.action}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 border-t border-sidebar-border bg-gradient-to-r from-sidebar-accent/30 to-sidebar-accent/10 space-y-3">
          {/* Onboarding Access Button */}
          {onShowOnboarding && (
            <Button 
              variant="outline" 
              className={`w-full ${direction === 'rtl' ? 'justify-end' : 'justify-start'} hover:bg-primary/10 rounded-lg h-10`}
              onClick={() => {
                onShowOnboarding()
                if (isMobile) onToggle()
              }}
            >
              <Target size={18} className={direction === 'rtl' ? 'ml-3' : 'mr-3'} />
              <span className="font-medium">
                {language === 'ar' ? 'إعادة تحديد الأهداف' : 'Update Goals'}
              </span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className={`w-full ${direction === 'rtl' ? 'justify-end' : 'justify-start'} text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg h-12`}
            onClick={onLogout}
          >
            <LogOut size={18} className={direction === 'rtl' ? 'ml-3' : 'mr-3'} />
            <span className="font-medium">
              {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </span>
          </Button>
        </div>
      </div>

      {/* Enhanced Toggle Button (when closed) */}
      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          className={`fixed top-4 ${direction === 'rtl' ? 'right-4' : 'left-4'} z-40 bg-background/95 backdrop-blur-sm shadow-lg border-2 hover:scale-105 transition-transform`}
          onClick={onToggle}
        >
          <Menu size={16} />
        </Button>
      )}

      {/* Add navigation event listener */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('navigateToTab', function(event) {
              // This will be handled by the parent component
              if (window.setActiveTab) {
                window.setActiveTab(event.detail);
              }
            });
          `
        }}
      />
    </>
  )
}
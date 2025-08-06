"use client"

import { useState, useEffect } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { Login } from './components/Login'
import { Onboarding } from './components/Onboarding'
import { Subscription } from './components/Subscription'
import { Navigation } from './components/Navigation'
import { Sidebar } from './components/Sidebar'
import { LanguageProvider, useLanguage } from './components/LanguageContext'
import { Toaster } from './components/ui/sonner'
import { FloatingButton3D } from './components/3d/FloatingButton3D'
import { Plus, Target, Dumbbell } from 'lucide-react'
import { useUserManagement } from './hooks/useUserManagement'
import { useUserStats } from './hooks/useUserStats'
import { useSubscriptionManagement } from './hooks/useSubscriptionManagement'
import { useNavigation } from './hooks/useNavigation'
import { renderActiveComponent } from './utils/componentRenderer'
import { STORAGE_KEYS } from './types/app'

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { language, direction } = useLanguage()

  // Custom hooks
  const {
    user,
    handleLogin,
    handleOnboardingComplete,
    handleLogout,
    loadUserFromStorage,
    updateUserSubscription
  } = useUserManagement()

  const {
    userStats,
    handleXPGain,
    loadStatsFromStorage,
    resetStats
  } = useUserStats()

  const {
    appState,
    setAppState,
    activeTab,
    handleTabChange,
    resetNavigation,
    handleSplashComplete
  } = useNavigation({ isMobile, language, setSidebarOpen })

  const {
    handlePremiumFeatureAccess,
    handleProFeatureAccess,
    handleSubscriptionChange
  } = useSubscriptionManagement({
    user,
    updateUserSubscription,
    handleXPGain,
    language
  })

  // Check if mobile and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile when switching to mobile view
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize app data and preferences
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load saved dark mode preference
        const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
        if (savedDarkMode) {
          setIsDarkMode(JSON.parse(savedDarkMode))
        }

        // Load user data and stats
        loadUserFromStorage()
        loadStatsFromStorage()

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing app:', error)
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [loadUserFromStorage, loadStatsFromStorage])

  // Apply dark mode and mobile classes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.body.classList.toggle('mobile-simplified', isMobile)
    document.body.classList.toggle('mobile-reduce-3d', isMobile)
    
    // Save dark mode preference
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode))
  }, [isDarkMode, isMobile])

  // Handle splash screen completion
  const handleSplashCompleteWrapper = () => {
    handleSplashComplete()
  }

  // Enhanced handlers with proper state management
  const handleLoginWrapper = (email: string, password: string, isGoogleAuth: boolean = false, isGuest: boolean = false) => {
    const userData = handleLogin(email, password, isGoogleAuth, isGuest)
    setAppState('onboarding')
    return userData
  }

  const handleOnboardingCompleteWrapper = (profile: any) => {
    const updatedUser = handleOnboardingComplete(profile, handleXPGain)
    if (updatedUser) {
      setAppState('app')
    }
    return updatedUser
  }

  const handleLogoutWrapper = () => {
    handleLogout()
    resetStats()
    resetNavigation()
    setSidebarOpen(false)
    return true
  }

  const handleSubscriptionChangeWrapper = (tier: any) => {
    const updatedUser = handleSubscriptionChange(tier)
    if (updatedUser) {
      setAppState('app')
    }
    return updatedUser
  }

  const handlePremiumFeatureAccessWrapper = (featureName: string) => {
    return handlePremiumFeatureAccess(featureName, () => setAppState('subscription'))
  }

  const handleProFeatureAccessWrapper = (featureName: string) => {
    return handleProFeatureAccess(featureName, () => setAppState('subscription'))
  }

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSettingsOpen = (section: string) => {
    if (section === 'subscription') {
      setAppState('subscription')
    }
  }

  const handleShowOnboarding = () => {
    setAppState('onboarding')
    setSidebarOpen(false)
  }

  // Show splash screen until app is initialized
  if (!isInitialized || appState === 'splash') {
    return (
      <div className="min-h-screen" dir={direction}>
        <SplashScreen 
          onComplete={handleSplashCompleteWrapper}
          isDarkMode={isDarkMode}
        />
      </div>
    )
  }

  // Render login screen
  if (appState === 'login') {
    return (
      <div className="min-h-screen" dir={direction}>
        <Login onLogin={handleLoginWrapper} isDarkMode={isDarkMode} />
      </div>
    )
  }

  // Render onboarding screen
  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen" dir={direction}>
        <Onboarding 
          onComplete={handleOnboardingCompleteWrapper} 
          isDarkMode={isDarkMode}
          isGuest={user?.isGuest}
        />
      </div>
    )
  }

  // Render subscription screen
  if (appState === 'subscription') {
    return (
      <div className="min-h-screen" dir={direction}>
        <Subscription
          currentTier={user?.subscriptionTier || 'free'}
          onSubscribe={handleSubscriptionChangeWrapper}
          onClose={() => setAppState('app')}
          showCloseButton={true}
        />
      </div>
    )
  }

  // Render main app
  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onSettingsOpen={handleSettingsOpen}
        userProfile={user?.profile}
        userStats={userStats}
        onLogout={handleLogoutWrapper}
        onShowOnboarding={handleShowOnboarding}
        isMobile={isMobile}
        subscriptionTier={user?.subscriptionTier}
      />

      {/* Main content */}
      <main className={`min-h-screen pb-20 transition-all duration-300 ${
        sidebarOpen && !isMobile ? (direction === 'rtl' ? 'pr-80' : 'pl-80') : ''
      }`}>
        {renderActiveComponent({
          activeTab,
          user,
          userStats,
          handleXPGain,
          handlePremiumFeatureAccess: handlePremiumFeatureAccessWrapper,
          handleProFeatureAccess: handleProFeatureAccessWrapper,
          onLogout: handleLogoutWrapper,
          onManageSubscription: () => setAppState('subscription')
        })}
      </main>
      
      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

      {/* 3D Floating Action Buttons */}
      {activeTab === 'home' && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-between px-6 pointer-events-none z-40">
          <div className="pointer-events-auto">
            <FloatingButton3D
              icon={Dumbbell}
              onClick={() => handleTabChange('workouts')}
              gradient="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
              position="center"
              tooltip={language === 'ar' ? 'بدء تمرين' : 'Start Workout'}
              size="sm"
            />
          </div>
          
          <div className="pointer-events-auto">
            <FloatingButton3D
              icon={Plus}
              onClick={() => handleTabChange('meals')}
              gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
              position="center"
              tooltip={language === 'ar' ? 'إضافة وجبة' : 'Add Meal'}
              pulse={false}
              size="sm"
            />
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <FloatingButton3D
          icon={Target}
          onClick={() => handleTabChange('home')}
          gradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
          position="bottom-right"
          tooltip={language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          size="sm"
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
      <Toaster position="top-center" />
    </LanguageProvider>
  )
}
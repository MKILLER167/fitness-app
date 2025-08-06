import { useState, useCallback } from 'react'

type AppState = 'splash' | 'login' | 'onboarding' | 'subscription' | 'app'
type ActiveTab = 'home' | 'meals' | 'workouts' | 'stats' | 'profile'

interface UseNavigationProps {
  isMobile: boolean
  language: string
  setSidebarOpen: (open: boolean) => void
}

export function useNavigation({ isMobile, language, setSidebarOpen }: UseNavigationProps) {
  const [appState, setAppState] = useState<AppState>('splash')
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab)
    
    // Auto-close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile, setSidebarOpen])

  const resetNavigation = useCallback(() => {
    setActiveTab('home')
    setAppState('login')
  }, [])

  const handleSplashComplete = useCallback(() => {
    // Check if user exists in localStorage to determine next screen
    try {
      const savedUser = localStorage.getItem('fittracker_user_data')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.isOnboarded) {
          setAppState('app')
        } else {
          setAppState('onboarding')
        }
      } else {
        setAppState('login')
      }
    } catch (error) {
      console.error('Error checking saved user data:', error)
      setAppState('login')
    }
  }, [])

  const navigateToTab = useCallback((tab: ActiveTab) => {
    if (appState === 'app') {
      handleTabChange(tab)
    }
  }, [appState, handleTabChange])

  const navigateToState = useCallback((state: AppState) => {
    setAppState(state)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile, setSidebarOpen])

  const getTabLabel = useCallback((tab: ActiveTab) => {
    const labels = {
      en: {
        home: 'Home',
        meals: 'Meals',
        workouts: 'Workouts',
        stats: 'Stats',
        profile: 'Profile'
      },
      ar: {
        home: 'الرئيسية',
        meals: 'الوجبات',
        workouts: 'التمارين',
        stats: 'الإحصائيات',
        profile: 'الملف الشخصي'
      }
    }

    return labels[language as keyof typeof labels]?.[tab] || labels.en[tab]
  }, [language])

  const canNavigateToTab = useCallback((tab: ActiveTab) => {
    // All tabs are available when in app state
    return appState === 'app'
  }, [appState])

  const getActiveTabCount = useCallback(() => {
    // Return number of available tabs based on app state
    if (appState === 'app') {
      return 5 // All tabs available
    }
    return 0
  }, [appState])

  const handleBackNavigation = useCallback(() => {
    switch (appState) {
      case 'subscription':
        setAppState('app')
        break
      case 'onboarding':
        setAppState('login')
        break
      case 'app':
        // Handle back button in app - could minimize or show exit confirmation
        break
      default:
        // No back navigation from splash or login
        break
    }
  }, [appState])

  const isInitialState = useCallback(() => {
    return appState === 'splash' || appState === 'login'
  }, [appState])

  const getCurrentStateLabel = useCallback(() => {
    const labels = {
      en: {
        splash: 'Loading',
        login: 'Welcome',
        onboarding: 'Setup',
        subscription: 'Plans',
        app: 'Dashboard'
      },
      ar: {
        splash: 'تحميل',
        login: 'مرحباً',
        onboarding: 'إعداد',
        subscription: 'الخطط',
        app: 'لوحة التحكم'
      }
    }

    return labels[language as keyof typeof labels]?.[appState] || labels.en[appState]
  }, [appState, language])

  const handleDeepLink = useCallback((path: string) => {
    // Handle deep linking to specific tabs or features
    const pathMap: Record<string, { state: AppState; tab?: ActiveTab }> = {
      '/home': { state: 'app', tab: 'home' },
      '/meals': { state: 'app', tab: 'meals' },
      '/workouts': { state: 'app', tab: 'workouts' },
      '/stats': { state: 'app', tab: 'stats' },
      '/profile': { state: 'app', tab: 'profile' },
      '/subscription': { state: 'subscription' },
      '/onboarding': { state: 'onboarding' },
      '/login': { state: 'login' }
    }

    const destination = pathMap[path]
    if (destination) {
      setAppState(destination.state)
      if (destination.tab) {
        setActiveTab(destination.tab)
      }
    }
  }, [])

  return {
    appState,
    setAppState,
    activeTab,
    setActiveTab,
    handleTabChange,
    resetNavigation,
    handleSplashComplete,
    navigateToTab,
    navigateToState,
    getTabLabel,
    canNavigateToTab,
    getActiveTabCount,
    handleBackNavigation,
    isInitialState,
    getCurrentStateLabel,
    handleDeepLink
  }
}
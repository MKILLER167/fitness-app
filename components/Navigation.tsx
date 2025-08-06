"use client"

import { Home, Utensils, Dumbbell, BarChart3, User } from 'lucide-react'
import { useLanguage } from './LanguageContext'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { language, direction } = useLanguage()

  const tabs = [
    { id: 'home', icon: Home, label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { id: 'meals', icon: Utensils, label: language === 'ar' ? 'الوجبات' : 'Meals' },
    { id: 'workouts', icon: Dumbbell, label: language === 'ar' ? 'التمارين' : 'Workouts' },
    { id: 'stats', icon: BarChart3, label: language === 'ar' ? 'الإحصائيات' : 'Stats' },
    { id: 'profile', icon: User, label: language === 'ar' ? 'الملف' : 'Profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-h-[60px] flex-1 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
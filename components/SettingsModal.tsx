"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"
import { 
  User, 
  Shield, 
  Bell, 
  Ruler, 
  Target, 
  Info, 
  HelpCircle, 
  Mail, 
  FileText,
  Heart,
  Database,
  Smartphone,
  Download
} from 'lucide-react'
import type { UserProfile } from './Onboarding'

interface SettingsModalProps {
  section: string
  onClose: () => void
  userProfile?: UserProfile
}

export function SettingsModal({ section, onClose, userProfile }: SettingsModalProps) {
  const renderContent = () => {
    switch (section) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3>Alex Johnson</h3>
                <p className="text-muted-foreground">alex.johnson@email.com</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <input className="w-full mt-1 p-2 border rounded-lg" defaultValue={userProfile?.name || "User"} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input className="w-full mt-1 p-2 border rounded-lg" defaultValue="user@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Age</label>
                <input className="w-full mt-1 p-2 border rounded-lg" defaultValue={userProfile?.age || 25} type="number" />
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-blue-500" size={24} />
              <h3>Privacy & Security</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">Share anonymized data for research</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve the app</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Location Services</p>
                  <p className="text-sm text-muted-foreground">For workout tracking</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-green-500" size={24} />
              <h3>Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Download size={16} className="mr-3" />
                Export All Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Database size={16} className="mr-3" />
                Backup to Cloud
              </Button>
              
              <Separator />
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-600 mb-3">These actions cannot be undone</p>
                <Button variant="destructive" size="sm">
                  Delete All Data
                </Button>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-yellow-500" size={24} />
              <h3>Notification Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Meal Reminders</p>
                  <p className="text-sm text-muted-foreground">Remind me to log meals</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Workout Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily exercise notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Goal Progress</p>
                  <p className="text-sm text-muted-foreground">Weekly progress updates</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Achievement Unlocked</p>
                  <p className="text-sm text-muted-foreground">When you reach milestones</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        )

      case 'units':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Ruler className="text-purple-500" size={24} />
              <h3>Units & Measurements</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Weight Unit</label>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">Kilograms</Button>
                  <Button variant="outline" size="sm">Pounds</Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Height Unit</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Centimeters</Button>
                  <Button variant="default" size="sm">Feet & Inches</Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Distance Unit</label>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">Kilometers</Button>
                  <Button variant="outline" size="sm">Miles</Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary-foreground" size={24} />
              </div>
              <h3>FitTracker Pro</h3>
              <p className="text-muted-foreground">Version 2.1.0</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-medium mb-2">What's New in 2.1.0</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Google Nutrition API integration</li>
                  <li>• RPM-style calorie counter</li>
                  <li>• Enhanced dark mode</li>
                  <li>• Improved user interface</li>
                </ul>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ by the FitTracker team
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Tailwind</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <Info size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3>Settings Section</h3>
            <p className="text-muted-foreground">This feature is coming soon!</p>
          </div>
        )
    }
  }

  const getTitle = () => {
    const titles = {
      profile: 'Profile Information',
      privacy: 'Privacy & Security',
      data: 'Data Management',
      notifications: 'Notifications',
      units: 'Units & Measurements',
      goals: 'Goal Settings',
      about: 'About FitTracker',
      help: 'Help & Support',
      contact: 'Contact Support',
      terms: 'Terms & Privacy'
    }
    return titles[section as keyof typeof titles] || 'Settings'
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{getTitle()}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
          
          <div className="flex gap-2 mt-6">
            <Button className="flex-1">Save Changes</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
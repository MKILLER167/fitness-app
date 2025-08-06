"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"
import { 
  Settings, 
  Copy, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  Globe,
  Zap,
  X
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface OAuthConfigProps {
  onClose?: () => void
  onConfigured?: () => void
}

export function OAuthConfig({ onClose, onConfigured }: OAuthConfigProps) {
  const [clientId, setClientId] = useState('')
  const [currentConfig, setCurrentConfig] = useState<{
    clientId: string
    isDemoMode: boolean
    isConfigured: boolean
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkCurrentConfig()
  }, [])

  const checkCurrentConfig = async () => {
    try {
      const { default: googleOAuthService } = await import('./GoogleOAuthService')
      const config = googleOAuthService.getConfig()
      const status = googleOAuthService.getAuthStatus()
      
      setCurrentConfig({
        clientId: config.clientId,
        isDemoMode: config.isDemoMode,
        isConfigured: !config.isDemoMode && config.clientId !== 'demo-client-id'
      })
      
      if (!config.isDemoMode) {
        setClientId(config.clientId)
      }
    } catch (error) {
      console.error('Error checking OAuth config:', error)
    }
  }

  const handleSaveConfig = async () => {
    if (!clientId.trim()) {
      toast.error('Please enter a valid Google Client ID')
      return
    }

    setIsLoading(true)
    
    try {
      const { default: googleOAuthService } = await import('./GoogleOAuthService')
      googleOAuthService.setClientId(clientId.trim())
      
      await checkCurrentConfig()
      
      toast.success('Google OAuth configured successfully!', {
        description: 'You can now use Google Sign-In'
      })
      
      onConfigured?.()
    } catch (error) {
      console.error('Error saving OAuth config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCommand = () => {
    const command = `localStorage.setItem('GOOGLE_CLIENT_ID', '${clientId}')`
    navigator.clipboard.writeText(command)
    setCopied(true)
    toast.success('Command copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestConfig = async () => {
    try {
      const { default: googleOAuthService } = await import('./GoogleOAuthService')
      const status = googleOAuthService.getAuthStatus()
      
      if (status.isDemoMode) {
        toast.warning('Still in demo mode - check your configuration')
      } else {
        toast.success('Configuration working! Google OAuth is active')
      }
    } catch (error) {
      toast.error('Error testing configuration')
    }
  }

  const handleClearConfig = () => {
    localStorage.removeItem('GOOGLE_CLIENT_ID')
    setClientId('')
    setCurrentConfig(null)
    toast.success('Configuration cleared')
    checkCurrentConfig()
  }

  const sampleClientIds = [
    '123456789-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
    '987654321-zyxwvutsrqponmlkjihgfedcba987654.apps.googleusercontent.com'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="text-blue-500" size={24} />
              <CardTitle>Google OAuth Configuration</CardTitle>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Settings size={16} />
              Current Status
            </h3>
            
            {currentConfig && (
              <Alert className={currentConfig.isConfigured ? 
                "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : 
                "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
              }>
                <AlertCircle className={`h-4 w-4 ${currentConfig.isConfigured ? 'text-green-600' : 'text-orange-600'}`} />
                <AlertDescription className={currentConfig.isConfigured ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}>
                  <div className="flex items-center justify-between">
                    <div>
                      {currentConfig.isConfigured ? (
                        <div>
                          <p className="font-medium">✅ Google OAuth Configured</p>
                          <p className="text-xs mt-1 opacity-80">
                            Client ID: {currentConfig.clientId.substring(0, 20)}...
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">⚠️ Running in Demo Mode</p>
                          <p className="text-xs mt-1 opacity-80">
                            Configure Google OAuth for production use
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleTestConfig}>
                        Test
                      </Button>
                      {currentConfig.isConfigured && (
                        <Button size="sm" variant="outline" onClick={handleClearConfig}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe size={16} />
              Configure Google Client ID
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Google OAuth Client ID
                </label>
                <Input
                  placeholder="123456789-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your Google OAuth 2.0 Client ID from the Google Cloud Console
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveConfig} 
                  disabled={!clientId.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleCopyCommand}
                  disabled={!clientId.trim()}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Setup Examples */}
          <div className="space-y-3">
            <h3 className="font-medium">Sample Client ID Format</h3>
            <div className="space-y-2">
              {sampleClientIds.map((sample, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <code className="flex-1 text-xs font-mono">{sample}</code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setClientId(sample)}
                  >
                    Use Sample
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ These are sample IDs for format reference only. Use your actual Google Client ID.
            </p>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Zap size={16} />
              Quick Setup Guide
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium mb-2">1. Get your Google Client ID</p>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('https://console.developers.google.com/apis/credentials', '_blank')}
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Google Cloud Console
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    → APIs & Services → Credentials → Create OAuth Client ID
                  </span>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="font-medium mb-2">2. Configure Authorized Origins</p>
                <div className="space-y-1 font-mono text-xs">
                  <div>• http://localhost:3000 (development)</div>
                  <div>• https://yourdomain.com (production)</div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p className="font-medium mb-2">3. Enter Client ID above and click Save</p>
                <p className="text-xs text-muted-foreground">
                  The app will automatically switch from demo mode to production OAuth
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Methods */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm">Alternative Configuration Methods</h4>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Browser Console:</strong>
                <code className="block mt-1 p-2 bg-background rounded text-xs">
                  localStorage.setItem('GOOGLE_CLIENT_ID', 'your-client-id')
                </code>
              </div>
              <div>
                <strong>HTML Meta Tag:</strong>
                <code className="block mt-1 p-2 bg-background rounded text-xs">
                  &lt;meta name="google-client-id" content="your-client-id"&gt;
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
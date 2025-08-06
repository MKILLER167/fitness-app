interface GoogleUser {
  email: string
  name: string
  picture?: string
  id: string
}

interface GoogleAuthConfig {
  clientId: string
  scope: string
}

interface AuthStatus {
  isAuthenticated: boolean
  user: GoogleUser | null
  error: string | null
}

interface SignInResult {
  success: boolean
  user?: GoogleUser
  error?: string
}

class GoogleOAuthServiceClass {
  private static instance: GoogleOAuthServiceClass | null = null
  private config: GoogleAuthConfig
  private isInitialized = false
  private authStatus: AuthStatus = {
    isAuthenticated: false,
    user: null,
    error: null
  }

  private constructor() {
    // Use placeholder values instead of process.env to avoid browser errors
    this.config = {
      clientId: 'your-google-client-id-here',
      scope: 'email profile'
    }
    this.loadStoredConfig()
  }

  static getInstance(): GoogleOAuthServiceClass {
    if (!GoogleOAuthServiceClass.instance) {
      GoogleOAuthServiceClass.instance = new GoogleOAuthServiceClass()
    }
    return GoogleOAuthServiceClass.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('GoogleOAuthService: Not in browser environment')
      return
    }

    try {
      // Load Google Identity Services
      await this.loadGoogleScript()
      
      // Initialize Google Auth
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: this.config.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
        })
        
        this.isInitialized = true
        console.log('Google OAuth initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error)
      this.authStatus.error = 'Failed to initialize Google authentication'
    }
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google?.accounts?.id) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Identity script'))
      
      document.head.appendChild(script)
    })
  }

  private handleCredentialResponse(response: any): void {
    try {
      // Decode JWT token
      const payload = this.decodeJWT(response.credential)
      
      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }

      this.authStatus = {
        isAuthenticated: true,
        user,
        error: null
      }

      // Store user data
      localStorage.setItem('google_auth_token', response.credential)
      localStorage.setItem('google_user', JSON.stringify(user))

      // Trigger login callback
      window.dispatchEvent(new CustomEvent('googleLoginSuccess', { detail: user }))
      
    } catch (error) {
      console.error('Error handling credential response:', error)
      this.authStatus.error = 'Failed to process Google authentication'
    }
  }

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Invalid JWT token')
    }
  }

  async signIn(): Promise<SignInResult> {
    // For demo purposes, return a mock successful result
    // In a real app, you'd implement the actual Google sign-in flow
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      // Check if Google OAuth is properly configured
      if (this.config.clientId === 'your-google-client-id-here') {
        console.warn('Google OAuth not configured - using mock authentication')
        
        // Return mock user for demo purposes
        const mockUser: GoogleUser = {
          id: 'mock-google-user-id',
          email: 'demo@gmail.com',
          name: 'Demo User',
          picture: 'https://via.placeholder.com/100'
        }

        this.authStatus = {
          isAuthenticated: true,
          user: mockUser,
          error: null
        }

        return {
          success: true,
          user: mockUser
        }
      }

      return new Promise((resolve) => {
        try {
          if (window.google?.accounts?.id) {
            // Show Google sign-in prompt
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.log('Google sign-in was dismissed or skipped')
                resolve({ success: false, error: 'Sign-in cancelled' })
              }
            })

            // Listen for successful login
            const handleSuccess = (event: CustomEvent) => {
              window.removeEventListener('googleLoginSuccess', handleSuccess as EventListener)
              resolve({ success: true, user: event.detail })
            }
            
            window.addEventListener('googleLoginSuccess', handleSuccess as EventListener)
          } else {
            resolve({ success: false, error: 'Google authentication not available' })
          }
        } catch (error) {
          resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
        }
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }
      
      this.authStatus = {
        isAuthenticated: false,
        user: null,
        error: null
      }

      localStorage.removeItem('google_auth_token')
      localStorage.removeItem('google_user')
      
      console.log('Google sign-out successful')
    } catch (error) {
      console.error('Error during Google sign-out:', error)
      throw error
    }
  }

  getAuthStatus(): AuthStatus {
    // Check for stored auth data
    if (!this.authStatus.isAuthenticated) {
      const storedUser = localStorage.getItem('google_user')
      const storedToken = localStorage.getItem('google_auth_token')
      
      if (storedUser && storedToken) {
        this.authStatus = {
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          error: null
        }
      }
    }
    
    return this.authStatus
  }

  getConfig(): GoogleAuthConfig {
    return this.config
  }

  updateConfig(newConfig: Partial<GoogleAuthConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Save to localStorage
    localStorage.setItem('google_oauth_config', JSON.stringify(this.config))
    
    // Reinitialize if client ID changed
    if (newConfig.clientId) {
      this.isInitialized = false
      this.initialize()
    }
  }

  // Load config from localStorage on initialization
  private loadStoredConfig(): void {
    try {
      const storedConfig = localStorage.getItem('google_oauth_config')
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig)
        this.config = { ...this.config, ...parsed }
      }
    } catch (error) {
      console.error('Error loading stored Google OAuth config:', error)
    }
  }
}

// Declare global Google types
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

// Create singleton instance
const googleOAuthServiceInstance = GoogleOAuthServiceClass.getInstance()

// Export both the class and the instance
export { GoogleOAuthServiceClass, type GoogleUser, type SignInResult }
export const GoogleOAuthService = googleOAuthServiceInstance
export default googleOAuthServiceInstance
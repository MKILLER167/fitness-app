// Simple test to verify OAuth service initialization
// This file can be deleted - it's just for testing

if (typeof window !== 'undefined') {
  setTimeout(() => {
    try {
      // Test dynamic import
      import('./GoogleOAuthService.js').then(module => {
        const service = module.default
        console.log('OAuth Service loaded successfully:', {
          isDemoMode: service.isDemoModeActive(),
          config: service.getConfig(),
          status: service.getAuthStatus()
        })
      }).catch(error => {
        console.error('Error loading OAuth service:', error)
      })
    } catch (error) {
      console.error('Error testing OAuth service:', error)
    }
  }, 1000)
}
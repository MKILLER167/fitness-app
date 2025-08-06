# Troubleshooting Guide

## Common Issues and Solutions

### 1. GoogleOAuthService Import Errors

**Error**: `TypeError: googleOAuthService is not a function`

**Solution**: Use dynamic imports instead of static imports:

```typescript
// ❌ Static import (can cause issues)
import googleOAuthService from './GoogleOAuthService'

// ✅ Dynamic import (recommended)
const { default: googleOAuthService } = await import('./GoogleOAuthService')
```

### 2. Demo Mode Warnings

**Error**: `Google OAuth running in demo mode. Configure GOOGLE_CLIENT_ID for production.`

**Quick Solutions**:

```javascript
// Option 1: Suppress warnings permanently
suppressOAuthWarnings()

// Option 2: Configure real OAuth
configureGoogleOAuth('your-google-client-id-here.apps.googleusercontent.com')

// Option 3: Manual localStorage
localStorage.setItem('suppress_oauth_warnings', 'true')
localStorage.setItem('hide_oauth_alert', 'true')
```

### 3. Service Initialization Issues

**Problem**: Service not initializing properly

**Solution**: Check browser console and run:

```javascript
// Check if service is available
console.log(window.googleOAuthService)

// Check current status
window.googleOAuthService?.getAuthStatus()

// Force re-initialization
location.reload()
```

### 4. localStorage Access Issues

**Problem**: Service fails in server-side rendering

**Solution**: The service now includes proper browser checks:

```typescript
// Safe localStorage access
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('key', 'value')
}
```

### 5. Missing Global Commands

**Problem**: Console commands not available

**Solution**: Wait for page load, then try:

```javascript
// These should be available after page load
configureGoogleOAuth('client-id')
suppressOAuthWarnings()
enableOAuthWarnings()
```

## Browser Compatibility

The OAuth service works in all modern browsers with:
- localStorage support
- Dynamic import support
- Modern JavaScript features

## Testing OAuth Service

Run this in your browser console:

```javascript
// Test service availability
if (window.googleOAuthService) {
  console.log('✅ Service available')
  console.log('Config:', window.googleOAuthService.getConfig())
  console.log('Status:', window.googleOAuthService.getAuthStatus())
} else {
  console.log('❌ Service not available')
}
```

## Development Mode

For development, you can:

1. **Use Demo Mode**: Just suppress warnings and use all features
2. **Use Test Client ID**: Set up a development Google OAuth client
3. **Use Production Client ID**: For final testing

```javascript
// Development setup
localStorage.setItem('GOOGLE_CLIENT_ID', 'dev-client-id')
localStorage.setItem('suppress_oauth_warnings', 'true')
```

## Production Setup

For production:

1. Get real Google OAuth client ID
2. Configure using any method (localStorage, meta tag, etc.)
3. Test authentication flow
4. Remove demo mode suppressions

## Debug Information

Always helpful for troubleshooting:

```javascript
// Debug info
console.log({
  hasService: !!window.googleOAuthService,
  config: window.googleOAuthService?.getConfig(),
  status: window.googleOAuthService?.getAuthStatus(),
  localStorage: {
    clientId: localStorage.getItem('GOOGLE_CLIENT_ID'),
    suppressWarnings: localStorage.getItem('suppress_oauth_warnings'),
    authToken: !!localStorage.getItem('google_auth_token')
  }
})
```

## Support

If you encounter persistent issues:

1. Check browser console for detailed errors
2. Verify browser compatibility
3. Test with a fresh browser session
4. Check if localStorage is available
5. Try the dynamic import approach

The service is designed to be resilient and work in all environments with graceful fallbacks.
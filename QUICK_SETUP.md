# Quick Setup Guide - Suppress OAuth Warnings

If you want to continue using FitTracker in demo mode without the OAuth configuration warnings, here are several quick options:

## Option 1: Browser Console (Fastest)
Open your browser's developer console and run:
```javascript
suppressOAuthWarnings()
```

## Option 2: Keep Demo Mode Button
Simply click the **"Keep Demo"** button in the OAuth configuration alert that appears when you first load the app.

## Option 3: Configure Real OAuth (Production)
If you want to set up real Google OAuth instead:

### Quick Configuration (Console):
```javascript
configureGoogleOAuth('your-google-client-id-here.apps.googleusercontent.com')
```

### Or use the UI:
1. Click the **"Configure"** button in the OAuth alert
2. Follow the step-by-step setup guide
3. Get your Client ID from [Google Cloud Console](https://console.developers.google.com/apis/credentials)

## Option 4: Manual localStorage
```javascript
localStorage.setItem('suppress_oauth_warnings', 'true')
localStorage.setItem('hide_oauth_alert', 'true')
location.reload()
```

## What Demo Mode Includes

✅ **Full Functionality**
- All app features work perfectly
- Sample user data and profiles
- Complete workout and nutrition tracking
- Achievement system with progress
- Social features and guides
- 3D character "Flex" with interactions

✅ **No Limitations**
- No features are disabled
- No time restrictions
- No functionality differences
- Full offline capability

✅ **Privacy First**
- All data stored locally
- No external authentication required
- No personal data collection
- Works completely offline

## Why Demo Mode is Great

🚀 **Instant Setup** - No configuration needed
🔒 **Privacy Focused** - Data stays on your device  
🎯 **Full Features** - Everything works out of the box
📱 **Offline Ready** - No internet dependency
🧪 **Perfect for Testing** - Ideal for development and demos

## Console Helper Commands

Once the app loads, these commands are available in your browser console:

```javascript
// Suppress OAuth warnings permanently
suppressOAuthWarnings()

// Configure Google OAuth (if you get a real client ID)
configureGoogleOAuth('your-client-id-here')

// Re-enable warnings (if you want them back)
enableOAuthWarnings()

// Check current OAuth status
googleOAuthService.getAuthStatus()

// Check current configuration
googleOAuthService.getConfig()
```

## Need Help?

The app is designed to work perfectly in demo mode. If you encounter any issues:

1. **All features should work** - The demo mode is fully functional
2. **Data persists** - Your progress is saved in browser storage
3. **No account needed** - Everything works locally
4. **Easy switching** - You can configure real OAuth later if needed

Demo mode is not a limitation - it's a feature that ensures the app works for everyone immediately!
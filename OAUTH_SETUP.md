# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your FitTracker application.

## Quick Start (Demo Mode)

The app works out of the box in **demo mode** without any configuration. All features are available with sample data.

## Browser-Compatible Configuration

Since this app runs entirely in the browser, there are multiple ways to configure your Google OAuth client ID:

### Method 1: LocalStorage (Easiest for Testing)

1. Open your browser's developer console
2. Run this command with your actual client ID:
   ```javascript
   localStorage.setItem('GOOGLE_CLIENT_ID', 'your-actual-google-client-id-here.apps.googleusercontent.com')
   ```
3. Refresh the page
4. The app will automatically detect and use your client ID

### Method 2: Meta Tag (HTML Configuration)

Add this meta tag to your HTML head:
```html
<meta name="google-client-id" content="your-actual-google-client-id-here.apps.googleusercontent.com">
```

### Method 3: Window Global (Build-time Configuration)

Set the client ID as a global variable:
```html
<script>
  window.GOOGLE_CLIENT_ID = 'your-actual-google-client-id-here.apps.googleusercontent.com';
</script>
```

### Method 4: Dynamic Configuration (Programmatic)

You can also set the client ID programmatically:
```javascript
// Access the global service instance
window.googleOAuthService.setClientId('your-actual-google-client-id-here.apps.googleusercontent.com')
```

## Production Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity Services API

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: FitTracker
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes (optional for basic authentication):
   - `openid`
   - `email`
   - `profile`
5. Save and continue

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure the client:
   - **Name**: FitTracker Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)

### 4. Configure Your Client ID

Choose one of the configuration methods above and set your client ID. The app will automatically detect it and switch from demo mode to production OAuth.

## Troubleshooting

### Common Issues

**"The given client ID is not found"**
- Check that your client ID is correctly configured using one of the methods above
- Verify the client ID in the Google Cloud Console
- Make sure you're using the correct project
- Clear localStorage and try again: `localStorage.clear()`

**"This app isn't verified"**
- This is normal during development
- Click "Advanced" → "Go to FitTracker (unsafe)" to continue
- For production, submit your app for verification

**"Popup blocked"**
- Allow popups for your domain
- Use the "Try Demo Account" option as an alternative

**Demo Mode Won't Disable**
- Check browser console for any errors
- Verify your client ID is correctly set
- Try: `console.log(window.googleOAuthService.getConfig())`
- Clear browser cache and localStorage if needed

### Development Tips

1. **Check current config**: Open console and run `window.googleOAuthService.getConfig()`
2. **Debug auth status**: Run `window.googleOAuthService.getAuthStatus()`
3. **Test with multiple accounts**: Make sure your OAuth flow works with different Google accounts
4. **Clear browser data**: If you encounter issues, try `localStorage.clear()`
5. **Check network**: Ensure you have a stable internet connection for OAuth flows
6. **Use HTTPS in production**: Google OAuth requires HTTPS for production domains

### Configuration Verification

You can verify your configuration is working by checking these indicators:

✅ **Demo Mode Disabled**
- No "Demo Mode" badges in the login screen
- Console shows: `Google OAuth client ID configured`

✅ **Production Mode Active**
- Real Google OAuth popup appears
- No demo user data
- Console shows your actual client ID

❌ **Still in Demo Mode**
- "Demo Mode Active" alert on login screen
- Console shows: `Google OAuth running in demo mode`

## Security Best Practices

1. **Client-side only**: Since this app runs in the browser, your client ID will be visible to users (this is normal and secure)
2. **Use different credentials for different environments**: Separate dev/staging/production credentials
3. **Monitor usage**: Check the Google Cloud Console for unusual activity
4. **Implement proper error handling**: The app gracefully falls back to demo mode if needed
5. **Domain restrictions**: Always restrict your OAuth credentials to specific domains

## Demo Mode Features

When running in demo mode (no Google OAuth configured):

✅ **Full functionality available**
- All app features work with sample data
- User profile with demo information
- Workout tracking and progress
- Meal logging and nutrition data
- Achievement system
- Social features

✅ **Local data storage**
- Data persists in browser localStorage
- No server required
- Privacy-first approach

✅ **Easy testing**
- No setup required
- Immediate access to all features
- Perfect for development and testing

## Browser Compatibility

The OAuth service works in all modern browsers and automatically:
- Detects available configuration methods
- Falls back to demo mode if needed
- Handles network errors gracefully
- Provides clear error messages

## Quick Configuration Examples

### For Development (LocalStorage)
```javascript
// Set this in browser console
localStorage.setItem('GOOGLE_CLIENT_ID', '123456789-abcdefghijklmnop.apps.googleusercontent.com')
location.reload()
```

### For Production (HTML Meta Tag)
```html
<meta name="google-client-id" content="987654321-qrstuvwxyz123456.apps.googleusercontent.com">
```

### For Static Sites (Global Variable)
```html
<script>
  window.GOOGLE_CLIENT_ID = 'your-production-client-id.apps.googleusercontent.com';
</script>
```

## Support

If you encounter issues with Google OAuth setup:

1. Check the browser console for detailed error messages
2. Verify your Google Cloud project configuration
3. Test the configuration commands above
4. Try the demo mode to verify app functionality

The app is designed to gracefully fallback to demo mode if Google OAuth is unavailable, ensuring users can always access the full feature set.
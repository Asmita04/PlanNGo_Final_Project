# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the PlanNGo application.

## Prerequisites

- Google Cloud Console account
- PlanNGo application running locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "planngo-oauth")
4. Click "Create"

## Step 2: Configure OAuth Consent Screen (No API enabling needed)

Google Identity Services is built-in and doesn't require enabling a separate API.

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (for testing)
3. Fill in the required information:
   - App name: PlanNGo
   - User support email: your email
   - Developer contact information: your email
4. Click "Save and Continue"
5. Skip "Scopes" for now
6. Add test users (your email addresses)
7. Click "Save and Continue"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: "PlanNGo Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (alternative port)
   - Add your production domain when ready
6. Add Authorized redirect URIs:
   - `http://localhost:5173/login`
   - `http://localhost:5173/signup`
   - Add production URLs when ready
7. Click "Create"

## Step 4: Configure Environment Variables

1. Copy the Client ID from the credentials page
2. Open `.env` file in the project root
3. Replace `your-google-client-id.apps.googleusercontent.com` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

## Step 5: Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify successful login

## Security Notes

- Never commit your actual Client ID to version control
- Use different Client IDs for development and production
- Regularly rotate your credentials
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Console matches your app URL exactly

2. **"invalid_client" error**
   - Check that your Client ID is correct in the `.env` file

3. **Google button not appearing**
   - Check browser console for JavaScript errors
   - Ensure Google Identity Services script is loaded

4. **CORS errors**
   - Verify authorized origins are set correctly in Google Console

## Production Deployment

When deploying to production:

1. Create new OAuth credentials for production domain
2. Update authorized origins and redirect URIs
3. Set production Client ID in environment variables
4. Test thoroughly before going live

## Support

For additional help:
- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Best Practices](https://developers.google.com/identity/protocols/oauth2/web-server#security-considerations)
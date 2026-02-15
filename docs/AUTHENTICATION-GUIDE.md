# Firebase Authentication Setup Guide

## Overview

This guide explains how to enable and configure Firebase Authentication for SnapStim ProjectUI.

## Quick Start

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cuelume**
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started** (if not already enabled)
5. Go to **Sign-in method** tab
6. Click on **Email/Password**
7. Enable the **Email/Password** toggle
8. Click **Save**

### 2. Create Test User (Optional)

For development testing:

1. Go to **Authentication** > **Users** tab
2. Click **Add User**
3. Enter email: `test@example.com`
4. Enter password: `test123456`
5. Click **Add User**

### 3. Test Authentication

1. Start the development server: `npm start`
2. Navigate to `http://localhost:5173`
3. You should see the login page
4. Enter your test credentials
5. Upon successful login, you'll be redirected to the dashboard

## How It Works

### Authentication Flow

```
┌─────────────┐
│ User Visits │
│    App      │
└──────┬──────┘
       │
       ▼
┌─────────────┐      Not           ┌─────────────┐
│ Protected   │─────Authenticated──▶│ Login Page  │
│   Route     │                     └──────┬──────┘
└──────┬──────┘                            │
       │                                   │
       │ Authenticated                     │ Sign In
       ▼                                   ▼
┌─────────────┐                     ┌─────────────┐
│  Dashboard  │◀────Token Valid─────│  Firebase   │
│  & Sections │                     │    Auth     │
└─────────────┘                     └─────────────┘
```

### Components

#### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages authentication state
- Provides `signIn`, `signUp`, `signOut` methods
- Listens to Firebase auth state changes
- Exposes `user` and `loading` state

#### LoginPage (`src/pages/LoginPage.tsx`)
- Email/password input form
- Error handling
- Redirects to dashboard on success

#### ProtectedRoute (in `src/App.tsx`)
- Wraps authenticated routes
- Shows loading state
- Redirects to /login if unauthenticated (production only)
- Bypasses auth check in development mode

#### UserMenu (`src/shell/components/UserMenu.tsx`)
- Displays logged-in user's email
- Logout functionality
- Theme toggle

## Development vs Production

### Development Mode (`npm run dev`)
- Authentication is **bypassed** for convenience
- You can access all routes without logging in
- DevTools panel is visible
- Firebase Auth still works if you want to test it

### Production Mode (`npm run build` + `npm run preview`)
- Authentication is **required**
- Unauthenticated users redirect to /login
- Must have valid Firebase credentials
- DevTools are hidden

## Environment Variables

Make sure your `.env` file has all Firebase credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=cuelume.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cuelume
VITE_FIREBASE_STORAGE_BUCKET=cuelume.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Backend API
VITE_API_BASE_URL=http://localhost:8787
```

## Security Best Practices

### ✅ Do's
- Enable email verification for production users
- Set up password reset functionality
- Use strong password requirements
- Enable multi-factor authentication (MFA)
- Set up proper Firebase Security Rules
- Use environment variables for all credentials
- Enable CORS only for trusted origins

### ❌ Don'ts
- Don't commit `.env` file to git (already in .gitignore)
- Don't expose Firebase config publicly without restrictions
- Don't use weak test passwords in production
- Don't bypass auth in production builds
- Don't store sensitive data in localStorage

## Troubleshooting

### "Email already in use"
- User already exists in Firebase
- Use different email or reset password

### "Invalid email or password"
- Check credentials are correct
- Ensure Email/Password provider is enabled in Firebase Console

### "Network error"
- Check internet connection
- Verify Firebase project is active
- Check browser console for CORS errors

### "Loading..." forever
- Check Firebase config in `.env` is correct
- Verify Firebase SDK initialized properly
- Check browser console for errors

### Can't access routes after login
- Check that ProtectedRoute is configured correctly
- Verify user state is being set in AuthContext
- Check browser console for navigation errors

## Adding More Auth Methods

Firebase supports many authentication methods:

1. **Google Sign-In**
   - Enable in Firebase Console
   - Add Google provider button to LoginPage
   - Use `signInWithPopup(auth, new GoogleAuthProvider())`

2. **Anonymous Auth**
   - Useful for guest users
   - Enable in Firebase Console
   - Call `signInAnonymously(auth)`

3. **Phone Authentication**
   - SMS-based verification
   - Requires phone number collection

4. **Custom Auth**
   - Integrate with your own auth system
   - Use Firebase Admin SDK

## Next Steps

After authentication is working:

1. ✅ Test login/logout flow
2. ✅ Create test users
3. ⏳ Implement password reset
4. ⏳ Add email verification
5. ⏳ Set up user profiles in Firestore
6. ⏳ Implement role-based access control (RBAC)
7. ⏳ Add user settings page

## Related Documentation

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [React Router Docs](https://reactrouter.com/)
- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) - Phase 4
- [BACKEND-GUIDE.md](./BACKEND-GUIDE.md) - Backend setup

---

**Questions?** Check the Firebase Console for auth logs and user management tools.

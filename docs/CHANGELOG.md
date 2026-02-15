# Changelog

All notable changes to SnapStim ProjectUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress

- Phase 6: Data Integration for Programs, Sessions, Review, Reporting

## [0.5.0] - 2026-02-15

### Added

- 🔄 **Phase 5: Data Integration - Clients Complete**
  - React Query (TanStack Query) integration for data fetching
  - QueryClientProvider with optimized settings (5min staleTime, retry 1)
  - `useClients` hook with full CRUD operations:
    - `useClients()` - Fetch all clients with mock fallback
    - `useCreateClient()` - Create new client
    - `useUpdateClient()` - Update existing client
    - `useDeleteClient()` - Delete client
  - Graceful degradation to mock data when backend offline
  - Cache invalidation on mutations for real-time updates
- 📸 **Firebase Storage Integration**
  - `useImageUpload` hook for profile image uploads
  - File type validation (images only: JPG, PNG, GIF)
  - File size validation (5MB maximum)
  - Upload progress tracking with percentage display
  - Error handling with user-friendly messages
  - Storage path: `client-avatars/{userId}/{timestamp}_{filename}`
  - Security rules documented in FIREBASE-STORAGE-SETUP.md
- 🖼️ **Profile Image Features**
  - Optional image upload in AddClientModal
  - Optional image upload in EditClientModal
  - Image preview before form submission
  - Remove image functionality
  - Fallback to initials when no image provided
  - Professional avatar component with automatic fallback
- 🔧 **Developer Tools Enhancement**
  - Added "Data Source" indicator showing Backend vs Mock data status
  - Visual feedback when using fallback data
- 📚 **Documentation**
  - Created FIREBASE-STORAGE-SETUP.md with complete setup guide
  - Security rules configuration for Firebase Storage
  - Testing instructions and troubleshooting guide

### Changed

- Updated ClientsView to use React Query hooks instead of mock data
- Enhanced AddClientModal with image upload capability
- Enhanced EditClientModal with image upload capability
- DevTools now shows active data source (Backend/Mock)

### Fixed

- 🐛 API exports bug: Export api instance as default instead of ApiClient class
- 🐛 React hooks order violation in ClientsView (moved loading check after hooks)
- 🐛 File picker reopening issue (removed duplicate trigger mechanism)
- 🐛 React Query DevTools UI overlap with custom DevTools (disabled RQ DevTools)

### Technical Details

- Static import used for mock data fallback (simpler than dynamic)
- React Query provides automatic caching and background refetching
- Firebase Storage URLs saved directly to client records
- Avatar component handles missing images gracefully
- Phase 6 boundary preserved (programs/alerts remain on mock data)
- Zero TypeScript compilation errors
- Smart import path handling for product-plan folder (relative paths)

### Known Technical Debt

- Therapist dropdown list is hardcoded (will be dynamic in Phase 6 - Accounts)
- Programs and alerts still using mock data (will be integrated in Phase 6)

## [0.4.0] - 2026-02-15

### Added

- 🔐 **Phase 2: Authentication System Complete**
  - Firebase Authentication integration
  - AuthContext provider (`src/contexts/AuthContext.tsx`)
  - Login page component (`src/pages/LoginPage.tsx`)
  - Protected route wrapper for authenticated access
  - Sign in, sign up, and sign out functionality
- 🚦 Routing system:
  - React Router v7 integration
  - `/login` route for authentication
  - Protected routes for all app sections
  - Automatic redirect to login in production
  - Development mode allows bypass for testing
- 👤 User menu enhancements:
  - Integrated with Firebase auth
  - Displays logged-in user email
  - Working logout functionality
- 📦 Dependencies:
  - `react-router-dom` - Client-side routing

### Changed

- Updated App.tsx with BrowserRouter and route definitions
- UserMenu now uses Firebase user data
- AppShell integrated with react-router navigation
- Authentication required in production mode

### Technical Details

- Uses Firebase Authentication (email/password)
- AuthContext manages authentication state
- Protected routes redirect to /login when unauthenticated
- Development mode (DEV) bypasses authentication for UI development
- Logout clears Firebase session and redirects to login

### Security Notes

- ⚠️ **Important:** Firebase Authentication must be enabled in Firebase Console
- Enable Email/Password provider in Authentication > Sign-in method
- Auth is bypassed in development mode for faster testing
- In production, all routes except /login require authentication

## [0.3.0] - 2026-02-15

### Added

- 🔌 **Phase 1: Backend Connection Complete**
  - Firebase SDK integration (`src/lib/firebase.ts`)
  - API client for backend communication (`src/lib/api.ts`)
  - Backend test script (`scripts/test-backend.js`)
  - Backend documentation guide (`docs/BACKEND-GUIDE.md`)
- 📦 Dependencies:
  - `firebase` - Full Firebase SDK (Auth, Firestore, Storage)
  - `@tanstack/react-query` - API state management
  - `@tanstack/react-query-devtools` - Developer tools
- 🧪 Test commands:
  - `npm run test:backend` - Verify backend connection
- 📡 API Client features:
  - Health check endpoint
  - Client management (CRUD)
  - Session management & export
  - AI content generation (images & text)
  - Stimulus generation & review

### Changed

- Updated package.json with new scripts and dependencies
- Backend connection now verified and operational

### Technical Details

- Connected to Firebase project: `cuelume`
- Backend API base URL: `http://localhost:8787`
- All 8 backend endpoints implemented in API client
- Read-only setup - no data writes yet
- Foundation ready for Phase 2 (Authentication)

## [0.2.0] - 2026-02-15

### Added

- 📁 Created `/docs` folder for centralized documentation
- 📋 Comprehensive IMPLEMENTATION-GUIDE.md with 10-phase roadmap
- 📚 USER-GUIDE.md for end users (BCBAs, RBTs, Caregivers)
- 🤖 Agent skills integration:
  - `firebase-auth` - Firebase Authentication patterns
  - `firebase-firestore` - Firestore database integration
  - `firebase-storage` - Cloud Storage management
  - `react-dev` - React/TypeScript best practices
  - `webapp-testing` - Playwright testing toolkit
  - `find-skills` - Skills discovery and installation
- 🔧 VS Code workspace settings for better development experience
- 📝 New streamlined root README.md with quick start guide

### Changed

- 🗂️ Reorganized project structure for better clarity
- 📄 Moved all documentation from root to `/docs` folder
- 🔒 Updated .gitignore with better organization and security
- 📦 Cleaned up workspace (removed 76 unnecessary files)

### Removed

- 🗑️ Duplicate skill folders (`.agent/`, `.claude/`)
- 🗑️ Obsolete DEMO-INTEGRATION-ANALYSIS.md (superseded by IMPLEMENTATION-GUIDE.md)
- 🗑️ Unused Vite template files (App.css, react.svg, empty assets folder)
- 🗑️ Empty `.env` from version control (added to .gitignore)

## [0.1.0] - 2026-02-14

### Added

- 🎨 Initial UI implementation with 7 major sections:
  - Dashboard (overview & alerts)
  - Accounts (user management)
  - Clients (client profiles & programs)
  - Programs (program library)
  - Review (AI stimulus approval)
  - Sessions (therapy session management)
  - Reporting (data analytics & exports)
- 🎯 Navigation system with context passing
- 💾 Mock data structure for all sections
- 🧩 shadcn/ui component library integration
- 🎨 Tailwind CSS styling system
- 📱 Responsive layout with AppShell navigation

### Changed

- ♻️ Refactored components for improved readability and consistency
- 📝 Updated README and implementation documentation

## [0.0.1] - 2026-02-13

### Added

- ⚡ Initial project setup with Vite + React + TypeScript
- 🎨 Tailwind CSS configuration
- 📦 Project dependencies (React, TypeScript, Vite, shadcn/ui)
- 📋 Basic project structure

---

## Version History Summary

- **v0.2.0** - Project reorganization, documentation, and agent skills
- **v0.1.0** - Complete UI prototype with mock data
- **v0.0.1** - Initial project setup

## Upcoming Releases

### [0.3.0] - Phase 1-2: Backend Integration (Target: Week 1-2)

- Firebase SDK integration
- Backend API client
- Authentication system
- Environment configuration

### [0.4.0] - Phase 3-4: Data Integration (Target: Week 3-4)

- Replace mock data with Firebase
- Real-time data sync
- API endpoint integration

### [0.5.0] - Phase 5-6: Core Features (Target: Week 5-8)

- Session runner implementation
- AI integration (GetImg + Replicate)
- Program creation workflows

### [1.0.0] - Production Release (Target: Week 10-12)

- Complete feature set
- Testing coverage
- Production deployment
- User documentation

---

## Notes

- All dates follow YYYY-MM-DD format
- Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)
- Links to issues/PRs will be added as project progresses
- See [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for detailed phase planning

## Contributing

When contributing, please:

1. Update this CHANGELOG with your changes under [Unreleased]
2. Follow the format: Category (Added/Changed/Fixed/Removed) + descriptive bullet
3. Use emojis for visual scanning (🔥 features, 🐛 fixes, ♻️ refactor, 📝 docs)
4. Reference issue numbers when applicable

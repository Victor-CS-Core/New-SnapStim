# Changelog

All notable changes to SnapStim ProjectUI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress

- Phase 9: Offline Support Implementation

## [0.8.0] - 2026-02-15

### Added

- ✨ **Phase 8: Enhanced Session Runner Complete**
  - **Real Data Integration**
    - Loads approved stimuli from backend for selected program
    - Fetches program details including rerun policy configuration
    - Shuffles stimuli queue based on program trial count
    - Displays stimulus images or text based on available data
    - Graceful fallback when no approved stimuli found
  
  - **Rerun Policy Implementation**
    - Error correction with immediate rerun on incorrect responses
    - Adds failed stimuli back to queue at position +2
    - Visual notification when rerun policy triggers
    - Badge indicator showing error correction status
    - Follows mobile app rerun logic
  
  - **Keyboard Shortcuts**
    - `C` key for Correct response
    - `I` key for Incorrect response
    - `N` key for No Response
    - `P` key for Prompted response
    - `Esc` key for Pause/Resume
    - `Ctrl+U` for Undo last trial
    - Shortcuts panel visible in side panel
  
  - **Session Management**
    - Pause/Resume with visual overlay indicator
    - Undo last trial with confirmation dialog
    - Auto-save trial data to backend after each response
    - Session duration timer (MM:SS format)
    - Real-time progress bar and trial counter
    - End session early with confirmation
  
  - **Trial Recording**
    - Complete trial metadata capture (stimulus, response, timestamp)
    - Rerun trigger tracking per trial
    - Accuracy calculation (correct/incorrect only)
    - Real-time session statistics update
    - Backend persistence via `useUpdateSession()`
  
  - **Enhanced UX**
    - Large, accessible response buttons (disabled when paused)
    - Color-coded responses: green (correct), red (incorrect), gray (no response), amber (prompted)
    - Real-time stats in side panel: correct, incorrect, no response, prompted, accuracy%
    - Loading states during data fetching
    - Paused state overlay with resume button
    - Rerun policy notification banner
    - Keyboard shortcuts reference panel

### Changed

- **SessionRunner.tsx** - Complete rewrite with real data integration (370 lines)
  - Replaced mock stimulus data with `useStimuli()` hook
  - Added `usePrograms()` for rerun policy access
  - Integrated `useUpdateSession()` for real-time persistence
  - Implemented keyboard event handlers
  - Added pause/resume state management
  - Enhanced UI with status indicators and shortcuts panel

### Technical Notes

- **Data Flow**: Session → Load Program → Load Stimuli → Shuffle Queue → Present → Record → Check Policy → Save → Next
- **Auto-save**: Trial data persists to backend after each response (fire-and-forget)
- **Accuracy Calculation**: Based on correct/(correct+incorrect) only (excludes no response and prompted)
- **Rerun Logic**: Follows program's `rerun_policy.error_correction` and `immediate_rerun_on_error` settings
- **Keyboard Priority**: All shortcuts work globally when session runner is active and not paused

## [0.7.0] - 2026-02-15

### Added

- ✨ **Phase 7: AI Features Integration Complete**
  - AI stimulus generation UI in Programs section
    - "Generate More" button in ProgramDetail view
    - GenerateStimuliModal with progress tracking
    - Batch generation with per-stimulus progress display
    - Custom prompt support for generation guidance
    - Error handling with detailed failure reporting
  - Automatic AI generation on program creation
    - Optional stimuli generation checkbox in AddProgramModal
    - Background generation with progress banner
    - Graceful handling of partial failures
    - User feedback for generation success/failure
  - AI stimulus generation in Review section
    - "Generate Stimuli" button in ReviewView header
    - GenerateReviewStimuliModal with program selection
    - Integration with active programs list
    - Custom prompt support per generation
  - Progress indicators for all AI tasks
    - Real-time progress bar with count display
    - Loading states during generation
    - Success/error feedback after completion
  - Error handling and user feedback
    - Per-stimulus error tracking
    - Detailed error messages with retryable failures
    - User-friendly alerts for completion status

### Technical Notes

- All AI generation uses GetImg API via backend

- Generation is sequential to provide real-time progress
- Each stimulus takes 3-5 seconds to generate
- Mock data fallback when backend unavailable
- React Query cache invalidation on successful generation

## [0.6.0] - 2026-02-15

### Added

- ✨ **Phase 6: Data Integration Complete - Backend Monorepo + Full CRUD**
  - **Backend Monorepo Integration**
    - Moved backend server into `ProjectUI/server/` directory
    - Added `concurrently` for running both frontend and backend
    - Updated package.json scripts: `dev:full`, `dev:server`
    - Backend runs on port 8787, frontend on 5174
    - Created `.gitignore` to protect Firebase credentials
  - **Programs Backend** (5 endpoints)
    - `GET /api/program/list` - List programs with user/client filtering
    - `GET /api/program/:userId/:clientId/:programId` - Get single program
    - `POST /api/program/save` - Create new program
    - `PUT /api/program/update` - Update existing program
    - `DELETE /api/program/delete` - Soft delete program
    - Storage: `programs/{userId}/{clientId}/{programId}.json`
    - Backend file: `server/src/routes/programRoutes.ts` (246 lines)
  - **Sessions Backend Integration** (3 endpoints)
    - `POST /api/session/save` - Create/update session
    - `GET /api/sessions` - List sessions with filtering
    - `POST /api/session/export` - Export session data
    - Storage: `sessions/{userId}/{clientId}/{sessionId}/`
    - Endpoints existed from mobile app, connected hooks to use them
  - **Stimuli/Review Backend** (5 endpoints)
    - `GET /api/stimuli/list` - List stimuli with program/status filtering
    - `GET /api/stimuli/:userId/:programId/:stimulusId` - Get single stimulus
    - `POST /api/stimuli/save` - Save generated stimulus
    - `DELETE /api/stimuli/delete` - Soft delete stimulus
    - `POST /api/review/submit` - Submit review approval/rejection
    - Storage: `stimuli/{userId}/{programId}/{stimulusId}.json`
    - Backend file: `server/src/routes/stimuliRoutes.ts` (245 lines)

### Changed

- **Frontend Hook Integration**
  - `usePrograms.ts` - Full CRUD operations calling real API
  - `useSessions.ts` - Connected `useCreateSession` and `useUpdateSession` to backend
  - `useStimuli.ts` - Connected to real API for listing and management
  - All hooks generate UUIDs and timestamps locally before sending to backend
  - Graceful degradation to mock data when backend unavailable

- **API Client Enhancement** (`src/lib/api.ts`)
  - Added 9 new methods for Programs, Sessions, and Stimuli CRUD
  - Type-safe request/response handling with TypeScript
  - Consistent error handling across all endpoints

### Technical Notes

- **Firebase Storage**: All entities stored in structured JSON files
- **Soft Deletes**: Records marked with `{ deleted: true }` instead of physical deletion
- **Zod Validation**: Request validation on all backend endpoints
- **Offline Support**: All hooks fallback to mock data when backend unavailable
- **Reporting Deferred**: Non-critical Reporting section still using mock data
- **Security**: `firebase-service-account.json` properly protected in `.gitignore`

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

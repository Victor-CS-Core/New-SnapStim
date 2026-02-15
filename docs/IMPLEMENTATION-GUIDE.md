# SnapStim ProjectUI — Quick Start Implementation Guide

**Version:** 2.0 (Firebase Integration)  
**Last Updated:** February 15, 2026  
**Estimated Timeline:** 10-12 weeks

---

## 🎯 Overview

This guide provides step-by-step instructions to integrate your ProjectUI web app with the **existing mobile backend** (Tyler-Project/SnapStim). You'll connect to Firebase, use the Express API, and leverage GetImg/Replicate AI services already configured.

**What You Already Have:**
✅ Mobile backend at `localhost:8787` (Node.js + Express)  
✅ Firebase project configured (`cuelume`)  
✅ GetImg API for image generation  
✅ Replicate API for text generation  
✅ 8 backend API routes operational  
✅ Complete UI prototype with 7 sections  
✅ Project structure organized with documentation  
✅ Agent skills installed for Firebase, React, and testing

**What You Need to Build:**
✅ Firebase JS SDK integration in web  
✅ Authentication system (re-enable Firebase Auth)  
✅ API client for backend communication  
❌ Replace mock data with API calls  
❌ Session runner logic adapted from mobile  
❌ Offline support with IndexedDB

---

## Phase 0: Project Setup ✅ COMPLETED

**Duration:** February 13-15, 2026  
**Status:** ✅ Complete

### What Was Built

**Project Foundation:**

- ⚡ Vite + React 18 + TypeScript setup
- 🎨 Tailwind CSS + shadcn/ui component library
- 📁 Organized project structure (`src/`, `docs/`, `product-plan/`)
- 🎯 7 complete UI sections with mock data:
  - Dashboard (overview & alerts)
  - Accounts (user management)
  - Clients (profiles & programs)
  - Programs (library & details)
  - Review (AI stimulus approval)
  - Sessions (therapy management)
  - Reporting (analytics & exports)

**Documentation:**

- 📋 IMPLEMENTATION-GUIDE.md (10-phase roadmap)
- 📚 USER-GUIDE.md (end-user documentation)
- 📝 CHANGELOG.md (version history)
- 🏠 Streamlined README.md

**Developer Tools:**

- 🤖 Firebase skills (auth, firestore, storage)
- ⚛️ React development skill (TypeScript patterns)
- 🧪 Webapp testing skill (Playwright)
- 📖 Documentation management skill (snapstim-docs)
- 🔧 VS Code workspace configuration

**Project Cleanup:**

- 🗑️ Removed 76 unnecessary files
- 🔒 Secured .env (removed from git)
- 📦 Organized `/docs` folder structure

### Key Decisions

1. **Chose Vite over Create React App** for faster builds
2. **Used shadcn/ui** for customizable component library
3. **Kept mock data structure** from product-plan for types
4. **Installed agent skills** for guided Firebase implementation
5. **Centralized documentation** in `/docs` folder

### Lessons Learned

- Clear project organization saves time later
- Mock data helpful for UI development
- Skills provide valuable guidance and patterns
- Documentation should start from day 1

### Next Steps

→ **Proceed to Phase 1:** Backend Connection & Firebase Setup

---

## Phase 1: Backend Connection (Week 1) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete

### Step 1: Install Dependencies & Configure Environment

```bash
# In ProjectUI directory:
npminstall firebase @tanstack/react-query @tanstack/react-query-devtools
```

**Files Created:**
✅ `.env` - Your credentials (already created)  
✅ `.env.example` - Template (already created)

**Next Files to Create:**

- `src/lib/firebase.ts`
- `src/lib/api.ts`
- `src/contexts/AuthContext.tsx`

### Step 2: Test Backend Connection

**Start mobile backend:**

```bash
cd C:\Users\vitic\OneDrive\Documentos\Development\Tyler-Project\SnapStim\server
npm run dev
```

You should see:

```
[env] GETIMG_API_KEY length: 97
[api] listening on :8787
```

**Test from web browser:**
Open `http://localhost:8787/api/health`

Expected response:

```json
{ "ok": true }
```

✅ **Phase 1.1 Complete** - Backend health check passes

---

## Phase 2: Firebase Setup (Week 1) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

✅ **Phase 1.2 Complete** - No TypeScript errors in firebase.ts

---

## Phase 3: API Client (Week 1) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // Health check
  async health() {
    return this.request<{ ok: boolean }>("/api/health");
  }

  // Clients
  async listClients(userId: string = "device") {
    return this.request<{
      ok: boolean;
      clients: any[];
      count: number;
    }>(`/api/client/list?userId=${userId}`);
  }

  async saveClient(userId: string, client: any) {
    return this.request("/api/client/save", {
      method: "POST",
      body: JSON.stringify({ userId, client }),
    });
  }

  async deleteClient(userId: string, clientId: string) {
    return this.request("/api/client/delete", {
      method: "DELETE",
      body: JSON.stringify({ userId, clientId }),
    });
  }

  // Sessions
  async listSessions(userId: string = "device") {
    return this.request(`/api/sessions?userId=${userId}`);
  }

  async exportSession(sessionData: any) {
    return this.request("/api/session/export", {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
  }

  // AI - Stimuli Generation
  async generateStimuli(request: {
    programType: string;
    programName: string;
    count: number;
    additionalGuidance?: string;
  }) {
    return this.request("/api/stimuli", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getStimuliHistory() {
    return this.request("/api/stimuli/history");
  }

  // AI - Teaching Instructions
  async generateTeachingInstructions(request: {
    programType: string;
    programName: string;
    targetSkill: string;
  }) {
    return this.request("/api/teaching-instructions", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // AI - Image Batch Generation
  async generateImages(prompts: string[]) {
    return this.request("/api/images/batch", {
      method: "POST",
      body: JSON.stringify({ prompts }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
```

**Test API Client:**

Create temporary file `src/lib/apiTest.ts`:

```typescript
import api from "./api";

export async function testApi() {
  try {
    const health = await api.health();
    console.log("✅ Health:", health);

    const clients = await api.listClients("device");
    console.log(`✅ Found ${clients.count} clients`);

    console.log("✅ All tests passed!");
  } catch (error) {
    console.error("❌ API test failed:", error);
  }
}
```

Run in browser console:

```javascript
import { testApi } from "./lib/apiTest";
testApi();
```

✅ **Phase 1.3 Complete** - API tests pass

---

## Phase 4: Authentication (Week 2) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

Create `src/pages/LoginPage.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">SnapStim Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

Update `src/App.tsx`:

```typescript
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { AppShell } from '@/shell/components/AppShell';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // In development, allow without auth
  if (!user && import.meta.env.PROD) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

✅ **Phase 1.4 Complete** - You can log in with Firebase credentials

**Implementation Notes:**

- Firebase Authentication enabled with email/password
- AuthContext provides auth state management
- Protected routes redirect to login in production
- Development mode bypasses auth for faster testing
- UserMenu integrated with Firebase user data
- Logout functionality working with redirect
- See [AUTHENTICATION-GUIDE.md](./AUTHENTICATION-GUIDE.md) for setup details

---

## Phase 5: Data Integration - Clients (Week 2-3) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete  
**Commit:** `aef619d`

### What Was Built

**React Query Integration:**

- ✅ Added QueryClientProvider with optimized configuration
- ✅ Created useClients hook with full CRUD operations
- ✅ Implemented graceful fallback to mock data when backend offline
- ✅ Added cache invalidation on mutations

**Firebase Storage:**

- ✅ Created useImageUpload hook for profile images
- ✅ Image validation (5MB max, image types only)
- ✅ Upload progress tracking with real-time percentage
- ✅ Error handling with friendly messages
- ✅ Storage path: `client-avatars/{userId}/{timestamp}_{filename}`

**UI Updates:**

- ✅ Updated AddClientModal with optional image upload
- ✅ Updated EditClientModal with same image upload capability
- ✅ Support for clients without images (fallback to initials)
- ✅ Fixed file picker reopening bug
- ✅ Added Data Source indicator to DevTools

**Bug Fixes:**

- ✅ Fixed API exports (export instance as default, not class)
- ✅ Fixed React hooks order violation in ClientsView
- ✅ Fixed DevTools UI conflicts (disabled React Query DevTools)

**Documentation:**

- ✅ Created FIREBASE-STORAGE-SETUP.md with security rules
- ✅ Documented optional image upload feature
- ✅ Added troubleshooting guide

### Technical Notes

- Static import used for mock data fallback (simpler than dynamic)
- Phase 6 boundary preserved (programs/alerts still on mock data)
- Smart implementation using relative imports for product-plan folder
- Zero TypeScript compilation errors

### Known Technical Debt

- Therapist list is hardcoded (will be dynamic in Phase 6)
- Programs and alerts still using mock data (Phase 6)

### Next Steps

→ **Proceed to Phase 6:** Data Integration for Programs, Sessions, Review, Reporting

---

**Original Implementation Guide:**

Create `src/hooks/useClients.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export function useClients() {
  const { user } = useAuth();
  const userId = user?.uid || "device";

  return useQuery({
    queryKey: ["clients", userId],
    queryFn: async () => {
      const response = await api.listClients(userId);
      return response.clients;
    },
  });
}

export function useCreateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || "device";

  return useMutation({
    mutationFn: async (clientData: any) => {
      const newClient = {
        ...clientData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      return await api.saveClient(userId, newClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", userId] });
    },
  });
}

export function useUpdateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || "device";

  return useMutation({
    mutationFn: async (client: any) => {
      const updated = {
        ...client,
        updatedAt: new Date().toISOString(),
      };
      return await api.saveClient(userId, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", userId] });
    },
  });
}

export function useDeleteClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || "device";

  return useMutation({
    mutationFn: async (clientId: string) => {
      return await api.deleteClient(userId, clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", userId] });
    },
  });
}
```

Update `src/sections/clients/ClientsView.tsx`:

**REMOVE:**

```typescript
import clientsData from "../../../product-plan/sections/clients/data.json";
```

**ADD:**

```typescript
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useClients";
```

**REPLACE mock data with:**

```typescript
export function ClientsView() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading clients...</div>
    </div>;
  }

  const handleAddClient = async (clientData: any) => {
    try {
      await createClient.mutateAsync(clientData);
      alert('Client created successfully!');
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Failed to create client');
    }
  };

  return (
    <div>
      <ClientList clients={clients || []} />
      {/* ... rest of component ... */}
    </div>
  );
}
```

✅ **Phase 2 Complete** when clients load from Firebase instead of mock JSON

---

## Phase 6: Data Integration - Additional Sections (Week 3-4) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete  
**Commit:** 4282ffd (backend integration), 87dab5a (full completion)

### What Was Built

**1. Programs Integration** ✅

- Backend CRUD endpoints (`server/src/routes/programRoutes.ts`)
  - GET `/api/program/list` - List programs with filtering
  - GET `/api/program/:userId/:clientId/:programId` - Get single program
  - POST `/api/program/save` - Create program
  - PUT `/api/program/update` - Update program
  - DELETE `/api/program/delete` - Soft delete program
- Frontend hooks updated to call real API
- Fallback to mock data when backend offline
- Storage: `programs/{userId}/{clientId}/{programId}.json`

**2. Sessions Integration** ✅

- Backend endpoints already existed from mobile app
  - POST `/api/session/save` - Create/update session
  - GET `/api/sessions` - List sessions
  - POST `/api/session/export` - Export session data
- Updated `useCreateSession()` and `useUpdateSession()` hooks
- Frontend now calls real backend API
- Storage: `sessions/{userId}/{clientId}/{sessionId}/`

**3. Stimuli/Review Integration** ✅

- New backend CRUD endpoints (`server/src/routes/stimuliRoutes.ts`)
  - GET `/api/stimuli/list` - List stimuli with filtering
  - GET `/api/stimuli/:userId/:programId/:stimulusId` - Get single stimulus
  - POST `/api/stimuli/save` - Save generated stimulus
  - DELETE `/api/stimuli/delete` - Soft delete stimulus
  - POST `/api/review/submit` - Submit review decision
- Updated `useStimuli()` hook to call real API
- Generation endpoint already existed (`POST /api/stimuli`)
- Storage: `stimuli/{userId}/{programId}/{stimulusId}.json`

**4. Reporting** ⚠️ _Deferred_

- Hooks still use mock data (non-critical for MVP)
- `useDashboardMetrics`, `useReportTemplates`, `useExportJobs`, `useScheduledExports`
- Backend endpoints can be added in future phase

### Key Decisions

1. **Monorepo Structure**: Moved backend into `ProjectUI/server/` directory
2. **Soft Deletes**: Mark records with `{ deleted: true }` instead of physical deletion
3. **Offline Support**: All hooks fallback to mock data when backend unavailable
4. **Firebase Storage**: Consistent path structure across all entities
5. **Reporting Deferred**: Not critical for core therapy workflow, can implement later

### Technical Implementation

**API Client Methods Added:**

- Programs: `listPrograms`, `getProgram`, `saveProgram`, `updateProgram`, `deleteProgram`
- Sessions: `saveSession` (create/update use same endpoint)
- Stimuli: `listStimuli`, `getStimulus`, `saveStimulus`, `deleteStimulus`, `submitReview`

**Firebase Storage Paths:**

```
programs/{userId}/{clientId}/{programId}.json
sessions/{userId}/{clientId}/{sessionId}/
stimuli/{userId}/{programId}/{stimulusId}.json
```

### Files Created/Modified

**Backend:**

- `server/src/routes/programRoutes.ts` (246 lines) - Program CRUD
- `server/src/routes/stimuliRoutes.ts` (245 lines) - Stimuli CRUD & Review
- `server/src/index.ts` - Registered new routes

**Frontend:**

- `src/lib/api.ts` - Added 9 new API methods
- `src/hooks/usePrograms.ts` - Connected to real API
- `src/hooks/useSessions.ts` - Connected to real API
- `src/hooks/useStimuli.ts` - Connected to real API

**Documentation:**

- `server/README.md` - API endpoint documentation
- `README.md` - Updated with monorepo structure

### Next Steps

→ **Proceed to Phase 8:** Session Runner Implementation

---

## Phase 7: AI Features (Week 5-6) ✅ COMPLETED

**Duration:** February 15, 2026  
**Status:** ✅ Complete  
**Commit:** d04e823, 0ad0ee1

### What Was Built

**AI Generation UI in Programs:**

- ✅ "Generate More" button in ProgramDetail view
- ✅ GenerateStimuliModal with batch generation
- ✅ Real-time progress tracking (stimulus x/n)
- ✅ Custom prompt support for generation guidance
- ✅ Error handling with detailed failure reporting

**Automatic Generation on Program Creation:**

- ✅ Optional AI stimuli checkbox in AddProgramModal
- ✅ Background generation after program creation
- ✅ Progress banner during bulk generation
- ✅ Graceful handling of partial failures
- ✅ User feedback for success/failure states

**AI Generation in Review Section:**

- ✅ "Generate Stimuli" button in ReviewView header
- ✅ GenerateReviewStimuliModal with program selection
- ✅ Integration with active programs
- ✅ Custom prompt support per generation batch

**Progress Indicators:**

- ✅ Real-time progress bars with counts
- ✅ Loading states during generation
- ✅ Per-stimulus error tracking
- ✅ Success/error feedback after completion

### Technical Implementation

**API Integration:**

- Uses `useGenerateStimulus()` hook from Phase 6
- Calls `/api/stimulus/generate` backend endpoint
- Sequential generation for progress feedback (3-5s per stimulus)
- React Query cache invalidation on success

**User Experience:**

- Modal-based generation UI for focused workflow
- Configurable batch sizes (1-30 stimuli)
- Custom prompts for specialized content
- Detailed error messages with partial success tracking
- Visual progress indicators throughout

**Files Created:**

- `src/sections/programs/components/GenerateStimuliModal.tsx`
- `src/sections/review/components/GenerateReviewStimuliModal.tsx`

**Files Modified:**

- `src/sections/programs/ProgramDetail.tsx` - Added "Generate More" button
- `src/sections/programs/ProgramsView.tsx` - Connected AI generation to program creation
- `src/sections/review/ReviewView.tsx` - Added "Generate Stimuli" button

### Known Limitations

- Generation is sequential (not parallel) for progress tracking
- Backend rate limits may affect batch generation speed
- No retry mechanism for failed stimuli (user must regenerate manually)
- Stimuli go directly to review queue (no automatic approval)

### Next Steps

→ **Proceed to Phase 8:** Session Runner Implementation

---

## Phase 8: Session Runner (Week 7-8)

Adapt mobile's `run-session.tsx` logic (2954 lines) to web:

1. **Copy trial logic** from mobile app
2. **Adapt UI** for web (mouse instead of touch)
3. **Use same data structures** mobile uses
4. **Call same backend** to save sessions

This is the most complex phase - see mobile app code for reference.

---

## Phase 9: Offline Support (Week 9-10)

Use IndexedDB for offline data storage:

```bash
npm install dexie dexie-react-hooks
```

Store pending changes locally, sync when online.

---

## Phase 10: Analytics & Charts (Week 11-12)

Install charting library:

```bash
npm install recharts
```

Create advanced charts using session data from backend.

---

## ✅ Completion Checklist

**Phase 1:** Backend Connection

- [ ] Firebase SDK installed
- [ ] API client working
- [ ] Authentication functional

**Phase 2:** Data Integration

- [ ] Clients load from Firebase
- [ ] Programs load from Firebase
- [ ] Sessions load from Firebase
- [ ] No mock data remaining

**Phase 3:** AI Integration

- [ ] Can generate stimuli via backend
- [ ] Can generate teaching instructions
- [ ] Images save to Firebase Storage

**Phase 4:** Session Runner

- [ ] Can run sessions like mobile app
- [ ] Trials save to backend
- [ ] Session history accessible

**Phase 5:** Advanced Features

- [ ] Offline support working
- [ ] Charts display real data
- [ ] Export functionality

---

## 🆘 If You Get Stuck

**Ask me to:**

1. "Implement Phase 1" - I'll create all files for backend connection
2. "Implement Phase 2" - I'll update ClientsView with real data
3. "Show me the API endpoints" - I'll list all available backend routes
4. "Debug this error: [paste error]" - I'll help troubleshoot

**Common Issues:**

| Error                    | Solution                                                         |
| ------------------------ | ---------------------------------------------------------------- |
| CORS error               | Add `http://localhost:5173` to backend ALLOWED_ORIGINS           |
| Firebase not initialized | Check `.env` has all 7 Firebase variables                        |
| Backend not responding   | Start backend: `cd Tyler-Project/SnapStim/server && npm run dev` |
| 401 Unauthorized         | Check auth token in API request headers                          |

---

## 📚 Key Files Reference

| File                                         | Purpose                                           |
| -------------------------------------------- | ------------------------------------------------- |
| `.env`                                       | Environment variables (API keys, Firebase config) |
| `src/lib/firebase.ts`                        | Firebase initialization                           |
| `src/lib/api.ts`                             | Backend API client                                |
| `src/contexts/AuthContext.tsx`               | Authentication state                              |
| `src/hooks/useClients.ts`                    | Client data management                            |
| `Tyler-Project/SnapStim/server/src/index.ts` | Backend server (mobile app)                       |

---

**Ready to start?** Say "implement Phase 1" and I'll create all the necessary files!

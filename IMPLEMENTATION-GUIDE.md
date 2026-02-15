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

**What You Need to Build:**
❌ Firebase JS SDK integration in web  
❌ Authentication system (re-enable Firebase Auth)  
❌ Replace mock data with API calls  
❌ Session runner logic adapted from mobile  
❌ Offline support with IndexedDB

---

## Phase 1: Backend Connection (Week 1)

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

✅ **Phase 1.1 Complete** when backend health check passes

---

## Phase 2: Firebase Setup (Week 1)

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

✅ **Phase 1.2 Complete** when no TypeScript errors in firebase.ts

---

## Phase 3: API Client (Week 1)

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

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
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // Health check
  async health() {
    return this.request<{ ok: boolean }>('/api/health');
  }

  // Clients
  async listClients(userId: string = 'device') {
    return this.request<{
      ok: boolean;
      clients: any[];
      count: number;
    }>(`/api/client/list?userId=${userId}`);
  }

  async saveClient(userId: string, client: any) {
    return this.request('/api/client/save', {
      method: 'POST',
      body: JSON.stringify({ userId, client }),
    });
  }

  async deleteClient(userId: string, clientId: string) {
    return this.request('/api/client/delete', {
      method: 'DELETE',
      body: JSON.stringify({ userId, clientId }),
    });
  }

  // Sessions
  async listSessions(userId: string = 'device') {
    return this.request(`/api/sessions?userId=${userId}`);
  }

  async exportSession(sessionData: any) {
    return this.request('/api/session/export', {
      method: 'POST',
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
    return this.request('/api/stimuli', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getStimuliHistory() {
    return this.request('/api/stimuli/history');
  }

  // AI - Teaching Instructions
  async generateTeachingInstructions(request: {
    programType: string;
    programName: string;
    targetSkill: string;
  }) {
    return this.request('/api/teaching-instructions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // AI - Image Batch Generation
  async generateImages(prompts: string[]) {
    return this.request('/api/images/batch', {
      method: 'POST',
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
import api from './api';

export async function testApi() {
  try {
    const health = await api.health();
    console.log('✅ Health:', health);

    const clients = await api.listClients('device');
    console.log(`✅ Found ${clients.count} clients`);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}
```

Run in browser console:
```javascript
import { testApi } from './lib/apiTest';
testApi();
```

✅ **Phase 1.3 Complete** when API tests pass

---

## Phase 4: Authentication (Week 2)

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

✅ **Phase 1.4 Complete** when you can log in with Firebase credentials

---

## Phase 5: Data Integration - Clients (Week 2-3)

Create `src/hooks/useClients.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export function useClients() {
  const { user } = useAuth();
  const userId = user?.uid || 'device';

  return useQuery({
    queryKey: ['clients', userId],
    queryFn: async () => {
      const response = await api.listClients(userId);
      return response.clients;
    },
  });
}

export function useCreateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'device';

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
      queryClient.invalidateQueries({ queryKey: ['clients', userId] });
    },
  });
}

export function useUpdateClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'device';

  return useMutation({
    mutationFn: async (client: any) => {
      const updated = {
        ...client,
        updatedAt: new Date().toISOString(),
      };
      return await api.saveClient(userId, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', userId] });
    },
  });
}

export function useDeleteClient() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.uid || 'device';

  return useMutation({
    mutationFn: async (clientId: string) => {
      return await api.deleteClient(userId, clientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', userId] });
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
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
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

## Phase 6: Repeat for Other Sections (Week 3-4)

**Apply same pattern to:**

1. **Programs** (`src/hooks/usePrograms.ts`)
2. **Sessions** (`src/hooks/useSessions.ts`)
3. **Review/Stimuli** (`src/hooks/useStimuli.ts`)
4. **Reporting** (uses sessions data)

Each follows the same structure:
- Create `use[Entity].ts` hook with React Query
- Call backend API methods
- Replace mock imports in View components
- Add loading/error states

---

## Phase 7: AI Features (Week 5-6)

Your backend **already has AI endpoints working**:

- `/api/stimuli` - Generate stimuli (uses GetImg + Replicate)
- `/api/teaching-instructions` - Generate instructions
- `/api/images/batch` - Generate multiple images

**To use in Programs section:**

```typescript
// In ProgramsView.tsx
const generateStimuli = useMutation({
  mutationFn: async (programData: any) => {
    return await api.generateStimuli({
      programType: programData.type,
      programName: programData.name,
      count: programData.stimuliCount || 20,
      additionalGuidance: programData.guidance,
    });
  },
});

const handleGenerateStimuli = async () => {
  try {
    const result = await generateStimuli.mutateAsync(selectedProgram);
    alert(`Generated ${result.stimuli.length} stimuli!`);
  } catch (error) {
    alert('Failed to generate stimuli');
  }
};
```

✅ **Phase 3 Complete** when you can generate AI stimuli from web app

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

| Error | Solution |
|-------|----------|
| CORS error | Add `http://localhost:5173` to backend ALLOWED_ORIGINS |
| Firebase not initialized | Check `.env` has all 7 Firebase variables |
| Backend not responding | Start backend: `cd Tyler-Project/SnapStim/server && npm run dev` |
| 401 Unauthorized | Check auth token in API request headers |

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `.env` | Environment variables (API keys, Firebase config) |
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/api.ts` | Backend API client |
| `src/contexts/AuthContext.tsx` | Authentication state |
| `src/hooks/useClients.ts` | Client data management |
| `Tyler-Project/SnapStim/server/src/index.ts` | Backend server (mobile app) |

---

**Ready to start?** Say "implement Phase 1" and I'll create all the necessary files!

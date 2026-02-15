# SnapStim - ProjectUI

Web-based ABA therapy session management platform for BCBAs, RBTs, and caregivers.

## What is This?

SnapStim helps behavior analysts create and manage ABA therapy programs with AI-powered stimulus generation, real-time session tracking, and progress reporting.

**Key Features:**

- Client & Program Management
- AI Stimulus Generation (GetImg + Replicate)
- Session Running & Data Collection
- Progress Analytics & Reporting
- Role-Based Access (BCBA/RBT/Caregiver)

## Architecture

This web app connects to an **existing mobile backend** (React Native app). We share the same Firebase database and backend API.

```
Web App (React) ──→ Backend API (Express) ──→ Firebase Storage
   Port 5173           Port 8787               JSON files + Auth
```

**Important:** You must run the mobile backend server for this app to work.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js + Express (from mobile app)
- **Database:** Firebase Storage (JSON files), Firebase Auth
- **AI:** GetImg (images), Replicate (text generation)
- **State:** React Query, React Context

## Quick Start

### Prerequisites

- Node.js 18+
- Access to `../Tyler-Project/SnapStim` (mobile app repository)

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start backend server (separate terminal):**

   ```bash
   cd ../Tyler-Project/SnapStim/server
   npm run dev
   # Should show: [api] listening on :8787
   ```

3. **Start web app:**

   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

4. **Verify connection:**
   - Open browser DevTools (F12)
   - Navigate to any section
   - Should see data loading (no errors)

### Common Issues

**CORS errors?** Add `http://localhost:5173` to backend's `ALLOWED_ORIGINS` in `.env`

**Backend not responding?** Make sure mobile backend is running on port 8787

## Project Structure

```
src/
├── components/ui/       # shadcn/ui components
├── sections/           # Main app sections (clients, programs, sessions, etc.)
├── shell/              # AppShell, navigation
├── contexts/           # NavigationContext
├── lib/                # firebase.ts, api.ts, utils.ts (to be created)
├── hooks/              # useClients.ts, etc. (to be created)
└── App.tsx
```

## Development

### Available Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

### Current State vs Future

**Now:** Mock data from `product-plan/sections/*/data.json`

```typescript
import clientsData from "../../../product-plan/sections/clients/data.json";
```

**Soon:** Real API calls (see IMPLEMENTATION-GUIDE.md)

```typescript
const { data: clients } = useClients();
```

### Backend API Endpoints

```
GET  /api/health                    # Health check
GET  /api/client/list               # List clients
POST /api/client/save               # Save client
GET  /api/sessions                  # List sessions
POST /api/session/export            # Save session
POST /api/stimuli                   # Generate AI stimuli
POST /api/teaching-instructions     # Generate AI instructions
```

**Data Storage:** Firebase Storage as JSON files (not Firestore collections)

```
clients/{userId}/{clientId}.json
programs/{userId}/{clientId}/{programId}.json
sessions/{userId}/{clientId}/{sessionId}/meta.json
```

## Key Concepts

### Navigation

Cross-section navigation with context:

```typescript
const { navigateTo } = useNavigation();
navigateTo("/sessions", { clientId: "abc", programId: "xyz" });
```

### Roles

- **BCBA:** Full access, review AI content
- **RBT:** Run sessions, view assigned clients
- **Caregiver:** Read-only access

### AI Integration

Backend already has AI working:

```typescript
api.generateStimuli({ programType: "tacting", count: 20 });
api.generateTeachingInstructions({
  programType: "tacting",
  targetSkill: "...",
});
```

## Security

- **NEVER commit `.env`** (contains real API keys)
- Use `userId: "device"` for testing
- AI credits cost money (GetImg: ~$0.04/image, Replicate: ~$0.001/text)

## Documentation

- **[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)** - Step-by-step development phases
- **[USER-GUIDE.md](./USER-GUIDE.md)** - End-user documentation
- `.env` - Environment variables (commented)

## Project Status

**Current:** UI prototype complete (mock data)  
**Next:** Backend integration (Firebase + API calls)  
**Timeline:** 10-12 weeks to production

---

**Getting Started?**

1. Complete setup above
2. Read `IMPLEMENTATION-GUIDE.md` Phase 1
3. Make a small change and test hot reload

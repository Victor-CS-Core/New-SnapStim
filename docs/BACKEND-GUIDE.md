# Backend Server Guide

**SnapStim Backend API - Simple Reference**

---

## 📍 Where Is It?

```
C:\Users\vitic\OneDrive\Documentos\Development\Tyler-Project\SnapStim\server
```

---

## 🎯 What Does It Do?

Your backend is a **Node.js server** that connects your apps (mobile and web) to:

- 🗄️ **Firebase** (database and file storage)
- 🤖 **AI Services** (image and text generation)
- 📊 **Data Processing** (session exports, reports)

Think of it as a **translator** between your app and these services.

---

## 🚀 How to Start It

**Open a terminal and run:**

```bash
cd C:\Users\vitic\OneDrive\Documentos\Development\Tyler-Project\SnapStim\server
npm run dev
```

**You should see:**

```
[env] GETIMG_API_KEY length: 97
[api] listening on :8787
```

✅ **That means it's working!** Keep this terminal open while using your web app.

---

## 🌐 How to Access It

Once running, the backend is available at:

```
http://localhost:8787
```

Your web app automatically connects to it (configured in `.env` file).

---

## 🔌 What Can It Do?

### 1. **Health Check** ✅

- **URL:** `GET /api/health`
- **What it does:** Confirms the server is alive
- **Returns:** `{ ok: true }`

### 2. **Manage Clients** 👥

- **Save/Update:** `POST /api/client/save`
- **List All:** `GET /api/client/list`
- **Get One:** `GET /api/client/:userId/:clientId`
- **Delete:** `DELETE /api/client/delete`

### 3. **Manage Sessions** 📝

- **List Sessions:** `GET /api/sessions`
- **Export Session:** `POST /api/session/export` (creates PDF)
- **Get Session Data:** Various endpoints for metadata, images, stimuli

### 4. **Generate AI Content** 🎨

- **Batch Images:** `POST /api/images/batch`
- **Stimulus Images:** `POST /api/stimuli`
- **Teaching Text:** `POST /api/teaching-instructions`
- **View History:** `GET /api/stimuli/history`

### 5. **Preview & Review** 👁️

- **Preview Images:** `GET /api/images/preview`
- **Generalization:** `/api/generalization/*`

---

## 🏗️ How It Works

```
┌─────────────┐
│  Your Apps  │ (Web Browser or Mobile Phone)
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────┐
│   Backend   │ localhost:8787
│  (Express)  │
└──────┬──────┘
       │
   ────┼────────────────────
   │   │          │        │
   ↓   ↓          ↓        ↓
Firebase GetImg Replicate Files
(Data)  (Images)  (Text)  (PDF)
```

**Flow:**

1. Your web app sends a request (e.g., "save this client")
2. Backend receives it at port 8787
3. Backend talks to Firebase/AI services
4. Backend sends response back to your app
5. Your app updates the UI

---

## 🔑 What Services Does It Use?

### Firebase (Database & Storage)

- **Project:** `cuelume`
- **What:** Stores client data, programs, sessions
- **Why:** Mobile and web apps share the same data

### GetImg AI (Image Generation)

- **What:** Creates educational images for therapy
- **Example:** "A red apple" → generates realistic apple image

### Replicate AI (Text Generation)

- **Model:** Llama 2
- **What:** Generates teaching instructions and program content
- **Example:** "Create steps for teaching colors" → detailed instructions

---

## 📦 Tech Stack

| Technology             | Purpose                   |
| ---------------------- | ------------------------- |
| **Node.js**            | JavaScript runtime        |
| **Express**            | Web server framework      |
| **TypeScript**         | Type-safe JavaScript      |
| **Firebase Admin SDK** | Database & storage access |
| **CORS**               | Allow web app requests    |
| **dotenv**             | Environment variables     |

---

## 🔒 Security

The backend uses **environment variables** (`.env` file) to store:

- Firebase credentials
- API keys (GetImg, Replicate)
- Allowed origins (CORS)

**⚠️ Never commit the `.env` file to Git!** (It's already in `.gitignore`)

---

## 🌍 Ports

| Port     | Service        | URL                     |
| -------- | -------------- | ----------------------- |
| **8787** | Backend API    | `http://localhost:8787` |
| **5173** | Web App (Vite) | `http://localhost:5173` |

**Note:** Backend's CORS currently allows ports 8081, 3000, 8787, 8083. You may need to add 5173.

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if something is using port 8787
netstat -ano | findstr :8787

# Kill the process if needed (replace PID)
taskkill /PID <process_id> /F

# Try starting again
npm run dev
```

### "Connection refused" in web app

1. ✅ Is backend running? Check terminal for `[api] listening on :8787`
2. ✅ Is the URL correct? Should be `http://localhost:8787`
3. ✅ Check `.env` file: `VITE_API_BASE_URL=http://localhost:8787`

### CORS errors

If you see "CORS policy" errors in browser console:

- Add your web app's port to backend's `.env`:
  ```
  ALLOWED_ORIGINS=http://localhost:8081,http://localhost:5173
  ```
- Restart the backend

---

## 📝 Quick Reference Commands

```bash
# Navigate to backend
cd C:\Users\vitic\OneDrive\Documentos\Development\Tyler-Project\SnapStim\server

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check backend from web app
npm run test:backend
```

---

## 🔗 Related Files

### In Your Backend Project:

- `src/index.ts` - Main server file (all routes defined here)
- `src/routes/` - Individual route handlers
- `.env` - API keys and configuration
- `package.json` - Dependencies and scripts

### In Your Web App Project:

- `src/lib/api.ts` - API client (talks to backend)
- `src/lib/firebase.ts` - Firebase configuration
- `.env` - Backend URL and Firebase keys

---

## 💡 Key Concepts

### Shared Database

Both your mobile app and web app use the **same Firebase project** (`cuelume`). This means:

- ✅ Data entered on mobile appears in web
- ✅ Data entered on web appears in mobile
- ✅ Real-time synchronization

### API-First Design

The backend provides a **REST API** - simple HTTP endpoints. Any app (web, mobile, desktop) can connect by sending HTTP requests.

### Stateless

The backend doesn't "remember" users between requests. Each request is independent and must include all needed information.

---

## 🎓 For Beginners

**"What's an API?"**

- It's like a restaurant menu. Your app is the customer, the backend is the waiter, and services (Firebase, AI) are the kitchen.
- Your app orders something ("Get all clients"), the backend fetches it, and serves it back.

**"Why not connect directly to Firebase?"**

- Security: API keys stay on the server, not exposed in your app
- AI Integration: Complex AI calls are easier to manage server-side
- Business Logic: Validation, processing, formatting happens in one place

**"Do I need to change the backend?"**

- Not for Phase 1! The API already has everything you need.
- Later phases might add new endpoints, but the foundation is complete.

---

## 🚦 Status Indicators

When backend is running, you'll see:

**✅ Good:**

```
[env] GETIMG_API_KEY length: 97
[api] listening on :8787
```

**❌ Bad:**

```
Error: EADDRINUSE: address already in use :::8787
```

(Another program is using port 8787)

**⚠️ Warning:**

```
[env] GETIMG_API_KEY length: 0
```

(Missing API key in `.env`)

---

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [REST API Tutorial](https://restfulapi.net/)

---

**Remember:** The backend is a **separate project** from your web app. Think of them as:

- **Web App (ProjectUI)** = The face customers see (frontend)
- **Backend (SnapStim/server)** = The kitchen that does the work (backend)

Both work together to create the complete application! 🎉

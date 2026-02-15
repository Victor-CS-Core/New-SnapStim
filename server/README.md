# SnapStim Backend Server

Express + Node.js API server for SnapStim web application.

## Features

- **Firebase Storage Integration** - Store clients, programs, sessions, and stimuli
- **GetImg API** - AI image generation for therapy stimuli
- **Replicate API** - AI text generation for teaching instructions
- **CORS Enabled** - Configured for frontend communication

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase service account credentials
- GetImg API key

### Installation

```bash
cd server
npm install
```

### Firebase Credentials

1. Download your Firebase service account JSON from [Firebase Console](https://console.firebase.google.com/)
2. Save it as `firebase-service-account.json` in the `server/` directory
3. **NEVER commit this file!** (already in `.gitignore`)

See `firebase-service-account.template.json` for the required format.

### Environment Variables

Create `.env` file:

```env
PORT=8787
FIREBASE_STORAGE_BUCKET=cuelume.firebasestorage.app
GETIMG_API_KEY=your-getimg-api-key-here
ALLOWED_ORIGINS=*
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:8787`

### From Root (Monorepo)

Run both frontend and backend:

```bash
npm run dev:full
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Clients
- `GET /api/client/list?userId=:userId` - List all clients
- `GET /api/client/:userId/:clientId` - Get single client
- `POST /api/client/save` - Save/create client
- `DELETE /api/client/delete` - Delete client

### Programs
- `GET /api/program/list?userId=:userId&clientId=:clientId` - List programs
- `GET /api/program/:userId/:clientId/:programId` - Get single program
- `POST /api/program/save` - Create program
- `PUT /api/program/update` - Update program
- `DELETE /api/program/delete` - Delete program (soft delete)

### Sessions
- `GET /api/sessions?userId=:userId` - List sessions
- `POST /api/session/export` - Export session data
- `GET /api/session/:userId/:clientId/:programId/:sessionId/meta` - Get session metadata
- `GET /api/session/:userId/:clientId/:programId/:sessionId/images` - Get session images
- `GET /api/session/:userId/:clientId/:programId/:sessionId/stimuli` - Get session stimuli

### AI Features
- `POST /api/stimuli` - Generate stimulus image (GetImg)
- `GET /api/stimuli/history` - View generation history
- `POST /api/teaching-instructions` - Generate teaching instructions (Replicate)
- `POST /api/images/batch` - Batch image generation

### Program History
- `POST /api/program-history/session` - Save session result
- `GET /api/program-history/:userId/:clientId/:programId` - Get program history

## Data Storage Structure

Firebase Storage paths:

```
clients/{userId}/{clientId}.json
programs/{userId}/{clientId}/{programId}.json
sessions/{userId}/{clientId}/{programId}/{sessionId}/
program-history/{userId}/{clientId}/{programId}/
```

## Architecture

- **Express 4** - Web framework
- **Firebase Admin SDK** - Cloud storage
- **Zod** - Request validation
- **TypeScript** - Type safety
- **dotenv** - Environment configuration

## Development Notes

- Soft delete pattern: Files marked with `{ deleted: true }` instead of actual deletion
- CORS configured to allow all origins in development (`ALLOWED_ORIGINS=*`)
- JSON files gzipped in Firebase Storage for efficiency
- Signed URLs expire after 60 minutes by default

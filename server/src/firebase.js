// firebase.js - Server-side Firebase Admin SDK
const admin = require("firebase-admin");

// Initialize Firebase Admin with service account
// For local development, you can use GOOGLE_APPLICATION_CREDENTIALS env var
// or initialize with a service account key file

// Check if app already exists to avoid re-initialization
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: "cuelume",
      storageBucket: "cuelume.firebasestorage.app",
    });
    console.log("[Firebase Admin] Initialized successfully");
  } catch (error) {
    console.error("[Firebase Admin] Initialization error:", error.message);
    // For development without credentials, initialize without auth
    admin.initializeApp({
      projectId: "cuelume",
      storageBucket: "cuelume.firebasestorage.app",
    });
    console.log("[Firebase Admin] Initialized in development mode (no auth)");
  }
} else {
  console.log("[Firebase Admin] Using existing app instance");
}

// Export services
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, auth, db, storage };

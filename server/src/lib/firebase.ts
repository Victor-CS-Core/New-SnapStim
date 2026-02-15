import admin from "firebase-admin";
import path from "node:path";

// Initialize Firebase Admin only once
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app(); // Return existing app
  }

  try {
    // --- Option A: load from local JSON file (easy for dev) ---
    const svcPath = path.resolve(process.cwd(), "firebase-service-account.json");

    // --- Option B: env variables (better for deploy) ---
    // If you prefer env vars, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,
    // and uncomment this block, comment the file-based block above.
    //
    // const projectId = process.env.FIREBASE_PROJECT_ID;
    // const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    // const credential = admin.credential.cert({ projectId, clientEmail, privateKey });

    const app = admin.initializeApp({
      // File-based credential (dev)
      credential: admin.credential.cert(svcPath),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "cuelume.firebasestorage.app",
      // For env-based:
      // credential,
      // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log("[firebase] initialized → bucket:", process.env.FIREBASE_STORAGE_BUCKET || "cuelume.firebasestorage.app");
    return app;
  } catch (err) {
    console.error("[firebase] init error:", err);
    throw err;
  }
}

// Initialize the app
initializeFirebaseAdmin();

export const bucket = admin.storage().bucket();

export async function uploadJson(objectPath: string, data: any) {
  const file = bucket.file(objectPath);
  const json = JSON.stringify(data, null, 2);
  await file.save(json, {
    contentType: "application/json",
    gzip: true,
  });
  return file;
}

export async function signedUrl(objectPath: string, minutes = 60) {
  const [url] = await bucket
    .file(objectPath)
    .getSignedUrl({ action: "read", expires: Date.now() + minutes * 60 * 1000 });
  return url;
}

export async function uploadImageFromUrl(objectPath: string, imageUrl: string) {
  try {
    console.log(`[firebase] Downloading image from: ${imageUrl}`);
    
    // Download the image from the external URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine content type from response or URL
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Upload to Firebase Storage
    const file = bucket.file(objectPath);
    await file.save(buffer, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
    });
    
    console.log(`[firebase] Uploaded image to: ${objectPath}`);
    
    // Return the Firebase Storage URL
    const [firebaseUrl] = await file.getSignedUrl({ 
      action: "read", 
      expires: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 // 100 years (essentially permanent)
    });
    
    return firebaseUrl;
  } catch (error) {
    console.error(`[firebase] Failed to upload image from ${imageUrl}:`, error);
    throw error;
  }
}

export async function listFiles(prefix: string) {
  try {
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => ({
      name: file.name,
      updated: file.metadata.updated,
      size: file.metadata.size,
    }));
  } catch (error) {
    console.error(`[firebase] Failed to list files with prefix ${prefix}:`, error);
    throw error;
  }
}

export async function downloadJson(objectPath: string) {
  try {
    const file = bucket.file(objectPath);
    const [exists] = await file.exists();
    
    if (!exists) {
      throw new Error(`File does not exist: ${objectPath}`);
    }
    
    const [buffer] = await file.download();
    const json = JSON.parse(buffer.toString());
    return json;
  } catch (error) {
    console.error(`[firebase] Failed to download JSON from ${objectPath}:`, error);
    throw error;
  }
}

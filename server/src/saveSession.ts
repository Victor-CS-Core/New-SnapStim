// server/src/saveSession.ts
import type { Express, Request, Response } from "express";
import { signedUrl, uploadImageFromUrl, uploadJson } from "./lib/firebase";

// ---------- Minimal validation ----------
function isString(v: any) { return typeof v === "string" && v.trim().length > 0; }
function bad(res: Response, msg: string) { return res.status(400).json({ error: msg }); }

// ---------- Route registrar ----------
export default function registerSaveSessionRoute(app: Express) {
  // Firebase is now initialized in lib/firebase.ts

  // POST /api/session/save
  app.post("/api/session/save", async (req: Request, res: Response) => {
    try {
      const { userId, sessionId, stimuli, images, meta, clientId, programId } = req.body || {};

      if (!isString(userId))   return bad(res, "userId required");
      if (!isString(sessionId)) return bad(res, "sessionId required");
      if (!isString(clientId)) return bad(res, "clientId required");
      if (!isString(programId)) return bad(res, "programId required");
      if (typeof stimuli !== "object" || !stimuli)
        return bad(res, "stimuli object required");

      // Simplified client-based structure: sessions/{userId}/{clientId}/{sessionId}/
      const base = `sessions/${userId}/${clientId}/${sessionId}`;
      const createdAt = new Date().toISOString();

      // Save stimuli data
      await uploadJson(`${base}/stimuli.json`, stimuli);

      // Process and save images if they exist
      let processedImages = images;
      if (images && Array.isArray(images)) {
        console.log(`[saveSession] Processing ${images.length} images...`);
        
        processedImages = await Promise.all(
          images.map(async (image: any, index: number) => {
            if (!image.url || typeof image.url !== 'string') {
              console.log(`[saveSession] Skipping image ${index} - no URL`);
              return image;
            }

            try {
              // Skip if it's already a Firebase URL
              if (image.url.includes('firebasestorage.googleapis.com') || image.url.includes('firebase')) {
                console.log(`[saveSession] Image ${index} already in Firebase storage`);
                return image;
              }

              // Download and upload to Firebase
              const imagePath = `${base}/images/${image.id || `image-${index}`}.jpg`;
              const firebaseUrl = await uploadImageFromUrl(imagePath, image.url);
              
              console.log(`[saveSession] Converted image ${index}: ${image.url} -> Firebase`);
              
              return {
                ...image,
                url: firebaseUrl,
                originalUrl: image.url, // Keep original for reference
                uploadedAt: createdAt,
              };
            } catch (error) {
              console.error(`[saveSession] Failed to process image ${index}:`, error);
              // Keep original URL as fallback
              return {
                ...image,
                uploadError: (error as Error).message,
              };
            }
          })
        );
        
        console.log(`[saveSession] Processed ${processedImages.length} images`);
      }

      // Save processed images
      if (processedImages) {
        await uploadJson(`${base}/images.json`, processedImages);
      }
      
      // Save metadata (include programId for identification)
      await uploadJson(`${base}/meta.json`, { ...(meta || {}), programId, createdAt, version: "2.0" });

      const preview = await signedUrl(`${base}/meta.json`, 60);
      return res.json({ ok: true, path: base, preview });
    } catch (err: any) {
      console.error("[/api/session/save] error:", err);
      return res.status(500).json({ error: err?.message || "Save failed" });
    }
  });

  // Optional: quick ping to verify reachability from the app
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
}
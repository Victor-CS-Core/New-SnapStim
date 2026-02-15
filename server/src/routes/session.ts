import type { Request, Response } from "express";
import { z } from "zod";
import { downloadJson, listFiles, signedUrl, uploadJson } from "../lib/firebase";

const Body = z.object({
  userId: z.string().min(1),          // “device” for now, real uid later
  sessionId: z.string().min(1),       // uuid from client
  stimuli: z.any(),                   // your final stimuli JSON (what you reviewed)
  images: z.array(z.object({
    id: z.string(),
    label: z.string().optional(),
    url: z.string().url().optional(),
    error: z.string().optional(),
    category: z.string().optional(),
    key: z.string().optional(),
  })).optional(),
  meta: z.record(z.any()).default({}), // programType, fields, etc.
  master: z.record(z.any()).optional(), // combined meta + images without urls
  clientId: z.string().optional(),     // client ID for client-specific storage
});

export async function exportSession(req: Request, res: Response) {
  try {
    const { userId, sessionId, stimuli, images, meta, master, clientId } = Body.parse(req.body);

    // Use client-based path if clientId is provided
    const base = clientId
      ? `sessions/${userId}/${clientId}/${sessionId}`
      : `sessions/${userId}/${sessionId}`;  // Fallback for backward compatibility

    console.log(`[exportSession] Saving to path: ${base}${clientId ? ` (client: ${clientId})` : ' (no client)'}`);

    const createdAt = new Date().toISOString();

    await uploadJson(`${base}/stimuli.json`, stimuli);
    if (images) await uploadJson(`${base}/images.json`, images);
    await uploadJson(`${base}/meta.json`, { ...meta, clientId, createdAt, version: "2.0" });
    if (master) await uploadJson(`${base}/master.json`, master);

    const preview = await signedUrl(`${base}/meta.json`, 60);
    res.json({ ok: true, path: base, preview });
  } catch (err: any) {
    console.error("exportSession error:", err);
    res.status(400).json({ error: err?.message || "Failed to export session" });
  }
}

export async function listSavedSessions(req: Request, res: Response) {
  try {
    const { userId = "device", clientId } = req.query;

    console.log(`[Session API] Listing sessions for userId: ${userId}, clientId: ${clientId}`);

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: "userId is required" });
    }

    // List sessions for a specific client or all clients
    let sessionPrefix: string;
    if (clientId && typeof clientId === 'string') {
      sessionPrefix = `sessions/${userId}/${clientId}/`;
      console.log(`[Session API] Looking for client-specific sessions with prefix: ${sessionPrefix}`);
    } else {
      sessionPrefix = `sessions/${userId}/`;
      console.log(`[Session API] Looking for all sessions with prefix: ${sessionPrefix}`);
    }

    const files = await listFiles(sessionPrefix);
    console.log(`[Session API] Found ${files.length} files with prefix ${sessionPrefix}`);

    // Group files by session structure and extract meta.json files
    const sessionMap = new Map();

    for (const file of files) {
      const pathParts = file.name.replace(sessionPrefix, '').split('/');

      // Handle both old and new structures
      let sessionData: any = null;

      if (clientId && pathParts.length >= 2) {
        if (pathParts.length === 2) {
          // Simplified structure: /{sessionId}/meta.json
          const sessionId = pathParts[0];
          const fileName = pathParts[1];

          console.log(`[Session API] Processing simplified format file: ${file.name}, parts: ${pathParts.join('/')}`);

          if (fileName === 'meta.json') {
            sessionData = {
              sessionId,
              clientId,
              metaPath: file.name,
              updated: file.updated,
            };
            console.log(`[Session API] Found simplified session for client ${clientId}: ${sessionId}`);
          }
        } else if (pathParts.length >= 3) {
          // Complex structure: /{programId}/{sessionId}/meta.json
          const programId = pathParts[0];
          const sessionId = pathParts[1];
          const fileName = pathParts[2];

          console.log(`[Session API] Processing complex format file: ${file.name}, parts: ${pathParts.join('/')}`);

          if (fileName === 'meta.json') {
            sessionData = {
              sessionId,
              programId,
              clientId,
              metaPath: file.name,
              updated: file.updated,
            };
            console.log(`[Session API] Found complex session for client ${clientId}: ${sessionId} (${programId})`);
          }
        }
      } else if (!clientId && pathParts.length >= 2) {
        // Old structure: /{sessionId}/meta.json or new structure discovery
        if (pathParts.length === 2) {
          // Old structure: /{sessionId}/meta.json
          const sessionId = pathParts[0];
          const fileName = pathParts[1];

          console.log(`[Session API] Processing old format file: ${file.name}, parts: ${pathParts.join('/')}`);

          if (fileName === 'meta.json') {
            sessionData = {
              sessionId,
              metaPath: file.name,
              updated: file.updated,
            };
            console.log(`[Session API] Found old format session: ${sessionId}`);
          }
        } else if (pathParts.length === 4) {
          // New structure: /{clientId}/{programId}/{sessionId}/meta.json
          const detectedClientId = pathParts[0];
          const programId = pathParts[1];
          const sessionId = pathParts[2];
          const fileName = pathParts[3];

          console.log(`[Session API] Processing new format file: ${file.name}, parts: ${pathParts.join('/')}`);

          if (fileName === 'meta.json') {
            sessionData = {
              sessionId,
              programId,
              clientId: detectedClientId,
              metaPath: file.name,
              updated: file.updated,
            };
            console.log(`[Session API] Found new format session for client ${detectedClientId}: ${sessionId} (${programId})`);
          }
        }
      }

      if (sessionData) {
        sessionMap.set(`${sessionData.clientId || 'unknown'}_${sessionData.sessionId}`, sessionData);
      }
    }

    // Fetch metadata for each session
    const sessions = [];
    for (const [sessionId, info] of sessionMap) {
      try {
        const meta = await downloadJson(info.metaPath);
        sessions.push({
          id: sessionId,
          title: meta.fields?.title || meta.fields?.goal || meta.fields?.name || '(Untitled)',
          type: meta.programType || meta.fields?.programType || 'tacting',
          programType: meta.programType || meta.fields?.programType || 'tacting', // Add both for compatibility
          createdAt: meta.createdAt || info.updated,
          fields: meta.fields || {},
          meta: meta,
        });
      } catch (error) {
        console.error(`Failed to load session ${sessionId}:`, error);
        // Skip sessions that can't be loaded
      }
    }

    // Sort by creation date (newest first)
    sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`[Session API] Returning ${sessions.length} sessions for client ${clientId || 'all clients'}`);
    console.log(`[Session API] Session titles: ${sessions.map(s => s.title).join(', ')}`);

    res.json({ sessions });
  } catch (err: any) {
    console.error("listSavedSessions error:", err);
    res.status(500).json({ error: err?.message || "Failed to list saved sessions" });
  }
}

export async function fetchSessionMeta(req: Request, res: Response) {
  try {
    const { userId, sessionId, clientId, programId } = req.params;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: "userId and sessionId are required" });
    }

    // Determine path based on available parameters
    let metaPath: string;
    if (clientId && programId) {
      // New client-based structure with programId: sessions/{userId}/{clientId}/{programId}/{sessionId}/
      metaPath = `sessions/${userId}/${clientId}/${programId}/${sessionId}/meta.json`;
      console.log(`[fetchSessionMeta] Using client-based path with programId: ${metaPath}`);
    } else if (clientId && !programId) {
      // Simplified client-based structure: sessions/{userId}/{clientId}/{sessionId}/
      metaPath = `sessions/${userId}/${clientId}/${sessionId}/meta.json`;
      console.log(`[fetchSessionMeta] Using simplified client-based path: ${metaPath}`);
    } else {
      // Old structure: sessions/{userId}/{sessionId}/
      metaPath = `sessions/${userId}/${sessionId}/meta.json`;
      console.log(`[fetchSessionMeta] Using old path: ${metaPath}`);
    }

    const meta = await downloadJson(metaPath);
    res.json(meta);
  } catch (err: any) {
    console.error("fetchSessionMeta error:", err);
    res.status(404).json({ error: err?.message || "Meta not found" });
  }
}

export async function fetchSessionImages(req: Request, res: Response) {
  try {
    const { userId, sessionId, clientId, programId } = req.params;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: "userId and sessionId are required" });
    }

    // Determine path based on available parameters
    let imagesPath: string;
    if (clientId && programId) {
      // New client-based structure with programId
      imagesPath = `sessions/${userId}/${clientId}/${programId}/${sessionId}/images.json`;
      console.log(`[fetchSessionImages] Using client-based path with programId: ${imagesPath}`);
    } else if (clientId && !programId) {
      // Simplified client-based structure
      imagesPath = `sessions/${userId}/${clientId}/${sessionId}/images.json`;
      console.log(`[fetchSessionImages] Using simplified client-based path: ${imagesPath}`);
    } else {
      // Old structure
      imagesPath = `sessions/${userId}/${sessionId}/images.json`;
      console.log(`[fetchSessionImages] Using old path: ${imagesPath}`);
    }

    const images = await downloadJson(imagesPath);
    res.json(images);
  } catch (err: any) {
    console.error("fetchSessionImages error:", err);
    res.status(404).json({ error: err?.message || "Images not found" });
  }
}

export async function fetchSessionStimuli(req: Request, res: Response) {
  try {
    const { userId, sessionId, clientId, programId } = req.params;

    if (!userId || !sessionId) {
      return res.status(400).json({ error: "userId and sessionId are required" });
    }

    // Determine path based on available parameters
    let stimuliPath: string;
    if (clientId && programId) {
      // New client-based structure with programId
      stimuliPath = `sessions/${userId}/${clientId}/${programId}/${sessionId}/stimuli.json`;
      console.log(`[fetchSessionStimuli] Using client-based path with programId: ${stimuliPath}`);
    } else if (clientId && !programId) {
      // Simplified client-based structure
      stimuliPath = `sessions/${userId}/${clientId}/${sessionId}/stimuli.json`;
      console.log(`[fetchSessionStimuli] Using simplified client-based path: ${stimuliPath}`);
    } else {
      // Old structure
      stimuliPath = `sessions/${userId}/${sessionId}/stimuli.json`;
      console.log(`[fetchSessionStimuli] Using old path: ${stimuliPath}`);
    }

    const stimuli = await downloadJson(stimuliPath);
    res.json(stimuli);
  } catch (err: any) {
    console.error("fetchSessionStimuli error:", err);
    res.status(404).json({ error: err?.message || "Stimuli not found" });
  }
}

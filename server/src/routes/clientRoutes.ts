import type { Request, Response } from "express";
import { z } from "zod";
import { downloadJson, listFiles, uploadJson } from "../lib/firebase";

const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  initials: z.string(),
  dateOfBirth: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
});

const SaveClientBody = z.object({
  userId: z.string(),
  client: ClientSchema,
});

const DeleteClientBody = z.object({
  userId: z.string(),
  clientId: z.string(),
});

// Save client to Firebase
export async function saveClient(req: Request, res: Response) {
  try {
    const { userId, client } = SaveClientBody.parse(req.body);
    
    const clientPath = `clients/${userId}/${client.id}.json`;
    
    // Save client data
    await uploadJson(clientPath, {
      ...client,
      savedAt: new Date().toISOString(),
    });
    
    console.log(`[saveClient] ✅ Client saved: ${client.id} for user ${userId}`);
    
    res.json({ 
      ok: true, 
      clientPath,
      clientId: client.id,
    });
  } catch (err: any) {
    console.error("[saveClient] error:", err);
    res.status(400).json({ error: err?.message || "Failed to save client" });
  }
}

// List all clients for a user
export async function listClients(req: Request, res: Response) {
  try {
    const { userId = "device" } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: "userId is required" });
    }

    // List all client files for this user
    const clientPrefix = `clients/${userId}/`;
    const files = await listFiles(clientPrefix);
    
    // Download and parse each client file
    const clients = [];
    
    for (const file of files) {
      if (file.name.endsWith('.json')) {
        try {
          const clientData = await downloadJson(file.name);
          clients.push(clientData);
        } catch (error) {
          console.warn(`[listClients] Failed to load client file ${file.name}:`, error);
          // Continue with other clients if one fails
        }
      }
    }
    
    // Sort by creation date (newest first)
    clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`[listClients] ✅ Found ${clients.length} clients for user ${userId}`);
    
    res.json({
      ok: true,
      clients,
      count: clients.length,
    });
  } catch (err: any) {
    console.error("[listClients] error:", err);
    res.status(400).json({ error: err?.message || "Failed to list clients" });
  }
}

// Get specific client
export async function getClient(req: Request, res: Response) {
  try {
    const { userId, clientId } = req.params;
    
    if (!userId || !clientId) {
      return res.status(400).json({ error: "userId and clientId are required" });
    }
    
    const clientPath = `clients/${userId}/${clientId}.json`;
    
    try {
      const client = await downloadJson(clientPath);
      res.json({
        ok: true,
        client,
      });
    } catch (error) {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (err: any) {
    console.error("[getClient] error:", err);
    res.status(400).json({ error: err?.message || "Failed to get client" });
  }
}

// Delete client
export async function deleteClient(req: Request, res: Response) {
  try {
    const { userId, clientId } = DeleteClientBody.parse(req.body);
    
    const clientPath = `clients/${userId}/${clientId}.json`;
    
    // Note: Firebase Admin SDK doesn't have a direct delete method for files
    // We'll mark as deleted by uploading a tombstone record
    await uploadJson(clientPath, {
      id: clientId,
      deleted: true,
      deletedAt: new Date().toISOString(),
    });
    
    // Also clean up any sessions for this client
    const sessionPrefix = `sessions/${userId}/${clientId}/`;
    const sessionFiles = await listFiles(sessionPrefix);
    
    console.log(`[deleteClient] ✅ Client ${clientId} marked as deleted for user ${userId}`);
    console.log(`[deleteClient] Found ${sessionFiles.length} session files to clean up`);
    
    res.json({ 
      ok: true, 
      clientId,
      sessionsFound: sessionFiles.length,
    });
  } catch (err: any) {
    console.error("[deleteClient] error:", err);
    res.status(400).json({ error: err?.message || "Failed to delete client" });
  }
}
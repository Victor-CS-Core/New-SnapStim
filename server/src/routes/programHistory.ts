// Server route for handling program history and session results
import type { Express, Request, Response } from "express";
import { downloadJson, listFiles, uploadJson } from "../lib/firebase";

interface SessionResult {
  id: string;
  programId: string;
  programTitle: string;
  programType: string;
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  implementer: string;
  implementerType: 'RBT' | 'Caregiver' | 'BCBA';
  totalTrials: number;
  correctResponses: number;
  incorrectResponses: number;
  skippedTrials: number;
  accuracy: number;
  duration: number;
  trialData: any[];
  notes?: string;
}

interface ProgramHistory {
  programId: string;
  programTitle: string;
  programType: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  sessionCount: number;
  lastSessionDate?: string; // ISO string
}

export default function registerProgramHistoryRoutes(app: Express) {
  
  // POST /api/program-history/session - Save a session result
  app.post("/api/program-history/session", async (req: Request, res: Response) => {
    try {
      const { userId, clientId, sessionResult } = req.body;
      
      if (!userId || !clientId || !sessionResult) {
        return res.status(400).json({ error: "userId, clientId, and sessionResult are required" });
      }
      
      const { programId, id: sessionId } = sessionResult;
      const timestamp = new Date().toISOString();
      
      // Save session result with client-based structure: program-history/{userId}/{clientId}/{programId}/sessions/{sessionId}.json
      const sessionPath = `program-history/${userId}/${clientId}/${programId}/sessions/${sessionId}.json`;
      await uploadJson(sessionPath, {
        ...sessionResult,
        clientId, // Include client ID in session data
        savedAt: timestamp,
      });
      
      // Update or create program history
      const historyPath = `program-history/${userId}/${clientId}/${programId}/history.json`;
      let programHistory: ProgramHistory;
      
      try {
        programHistory = await downloadJson(historyPath);
      } catch (error) {
        // Create new program history if it doesn't exist
        programHistory = {
          programId,
          programTitle: sessionResult.programTitle,
          programType: sessionResult.programType,
          createdAt: timestamp,
          updatedAt: timestamp,
          sessionCount: 0,
        };
      }
      
      // Update program history
      programHistory.updatedAt = timestamp;
      programHistory.sessionCount += 1;
      programHistory.lastSessionDate = sessionResult.date;
      
      await uploadJson(historyPath, programHistory);
      
      res.json({ 
        ok: true, 
        sessionPath,
        historyPath,
        message: "Session result saved successfully" 
      });
      
    } catch (error: any) {
      console.error("Error saving session result:", error);
      res.status(500).json({ error: error?.message || "Failed to save session result" });
    }
  });
  
  // GET /api/program-history/:userId/:clientId/:programId - Get program history and sessions
  app.get("/api/program-history/:userId/:clientId/:programId", async (req: Request, res: Response) => {
    try {
      const { userId, clientId, programId } = req.params;
      
      if (!userId || !clientId || !programId) {
        return res.status(400).json({ error: "userId, clientId, and programId are required" });
      }
      
      // Get program history
      const historyPath = `program-history/${userId}/${clientId}/${programId}/history.json`;
      let programHistory: ProgramHistory | null = null;
      
      try {
        programHistory = await downloadJson(historyPath);
      } catch (error) {
        // Program history doesn't exist
        return res.status(404).json({ error: "Program history not found" });
      }
      
      // Get all sessions for this program
      const sessionsPrefix = `program-history/${userId}/${clientId}/${programId}/sessions/`;
      const sessionFiles = await listFiles(sessionsPrefix);
      
      const sessions: SessionResult[] = [];
      for (const file of sessionFiles) {
        if (file.name.endsWith('.json')) {
          try {
            const session = await downloadJson(file.name);
            sessions.push(session);
          } catch (error) {
            console.error(`Failed to load session ${file.name}:`, error);
          }
        }
      }
      
      // Sort sessions by date (newest first)
      sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      res.json({
        history: programHistory,
        sessions,
      });
      
    } catch (error: any) {
      console.error("Error getting program history:", error);
      res.status(500).json({ error: error?.message || "Failed to get program history" });
    }
  });
  
  // GET /api/program-history/:userId/:clientId - Get all program histories for a client
  app.get("/api/program-history/:userId/:clientId", async (req: Request, res: Response) => {
    try {
      const { userId, clientId } = req.params;
      
      if (!userId || !clientId) {
        return res.status(400).json({ error: "userId and clientId are required" });
      }
      
      // List all programs for this client
      const programsPrefix = `program-history/${userId}/${clientId}/`;
      const files = await listFiles(programsPrefix);
      
      const histories: ProgramHistory[] = [];
      const sessionsByProgram: Record<string, SessionResult[]> = {};
      
      // Group files by program ID
      const programMap = new Map<string, { historyFile?: string; sessionFiles: string[] }>();
      
      for (const file of files) {
        const pathParts = file.name.replace(programsPrefix, '').split('/');
        if (pathParts.length >= 2) {
          const programId = pathParts[0];
          const fileName = pathParts[1];
          
          if (!programMap.has(programId)) {
            programMap.set(programId, { sessionFiles: [] });
          }
          
          const programData = programMap.get(programId)!;
          
          if (fileName === 'history.json') {
            programData.historyFile = file.name;
          } else if (pathParts[1] === 'sessions' && pathParts[2]?.endsWith('.json')) {
            programData.sessionFiles.push(file.name);
          }
        }
      }
      
      // Load data for each program
      for (const [programId, programData] of programMap) {
        try {
          if (programData.historyFile) {
            // Load program history
            const history = await downloadJson(programData.historyFile);
            histories.push(history);
            
            // Load sessions for this program
            const sessions: SessionResult[] = [];
            for (const sessionFile of programData.sessionFiles) {
              try {
                const session = await downloadJson(sessionFile);
                sessions.push(session);
              } catch (error) {
                console.error(`Failed to load session ${sessionFile}:`, error);
              }
            }
            
            // Sort sessions by date (newest first)
            sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            sessionsByProgram[programId] = sessions;
          }
        } catch (error) {
          console.error(`Failed to load program ${programId}:`, error);
        }
      }
      
      // Sort histories by last update (newest first)
      histories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      res.json({
        histories,
        sessionsByProgram,
      });
      
    } catch (error: any) {
      console.error("Error getting all program histories:", error);
      res.status(500).json({ error: error?.message || "Failed to get program histories" });
    }
  });
  
  // DELETE /api/program-history/:userId/:programId/session/:sessionId - Delete a session
  app.delete("/api/program-history/:userId/:programId/session/:sessionId", async (req: Request, res: Response) => {
    try {
      const { userId, programId, sessionId } = req.params;
      
      if (!userId || !programId || !sessionId) {
        return res.status(400).json({ error: "userId, programId, and sessionId are required" });
      }
      
      // Note: Firebase doesn't have a direct delete operation in our current setup
      // This would need to be implemented based on your Firebase configuration
      // For now, we'll return a success message
      
      res.json({ 
        ok: true,
        message: "Session deletion would be implemented here with proper Firebase delete operations" 
      });
      
    } catch (error: any) {
      console.error("Error deleting session:", error);
      res.status(500).json({ error: error?.message || "Failed to delete session" });
    }
  });
}
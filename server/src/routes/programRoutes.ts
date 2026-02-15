import type { Request, Response } from "express";
import { z } from "zod";
import { downloadJson, listFiles, uploadJson } from "../lib/firebase";

// Zod schema for Program validation
const ProgramSchema = z.object({
  program_id: z.string(),
  program_name: z.string(),
  client_id: z.string(),
  program_type: z.enum([
    "receptive_identification",
    "expressive_labeling",
    "intraverbal",
    "listener_responding",
  ]),
  category: z.string(),
  description: z.string(),
  mode: z.enum(["teaching", "generalization"]),
  status: z.enum(["active", "paused", "mastered", "archived"]),
  mastery_threshold: z.number(),
  consecutive_sessions_for_mastery: z.number(),
  teaching_instructions: z.string(),
  rerun_policy: z.object({
    error_correction: z.boolean(),
    immediate_rerun_on_error: z.boolean(),
    mastery_maintenance: z.boolean(),
    trial_count: z.number(),
  }),
  created_by: z.string(),
  created_date: z.string(),
  last_modified_date: z.string(),
  last_run_date: z.string().optional(),
  performance: z.object({
    total_trials: z.number(),
    correct_trials: z.number(),
    accuracy_percent: z.number(),
    trend: z.enum(["improving", "stable", "declining"]),
    consecutive_mastery_sessions: z.number(),
    sessions_to_date: z.number(),
  }),
  ai_metadata: z.object({
    generation_date: z.string(),
    generation_model: z.string(),
    stimuli_generated: z.number(),
    stimuli_approved: z.number(),
    stimuli_rejected: z.number(),
  }),
});

const SaveProgramBody = z.object({
  userId: z.string(),
  program: ProgramSchema,
});

const UpdateProgramBody = z.object({
  userId: z.string(),
  program: ProgramSchema,
});

const DeleteProgramBody = z.object({
  userId: z.string(),
  programId: z.string(),
  clientId: z.string().optional(),
});

// Save/create program to Firebase
export async function saveProgram(req: Request, res: Response) {
  try {
    const { userId, program } = SaveProgramBody.parse(req.body);
    
    // Store programs in: programs/{userId}/{clientId}/{programId}.json
    const programPath = `programs/${userId}/${program.client_id}/${program.program_id}.json`;
    
    const programData = {
      ...program,
      savedAt: new Date().toISOString(),
    };
    
    await uploadJson(programPath, programData);
    
    console.log(`[saveProgram] ✅ Program saved: ${program.program_id} for client ${program.client_id}`);
    
    res.json({ 
      ok: true, 
      programPath,
      programId: program.program_id,
      program: programData,
    });
  } catch (err: any) {
    console.error("[saveProgram] error:", err);
    res.status(400).json({ error: err?.message || "Failed to save program" });
  }
}

// Update existing program
export async function updateProgram(req: Request, res: Response) {
  try {
    const { userId, program } = UpdateProgramBody.parse(req.body);
    
    const programPath = `programs/${userId}/${program.client_id}/${program.program_id}.json`;
    
    // Update last_modified_date
    const programData = {
      ...program,
      last_modified_date: new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };
    
    await uploadJson(programPath, programData);
    
    console.log(`[updateProgram] ✅ Program updated: ${program.program_id}`);
    
    res.json({ 
      ok: true, 
      programPath,
      programId: program.program_id,
      program: programData,
    });
  } catch (err: any) {
    console.error("[updateProgram] error:", err);
    res.status(400).json({ error: err?.message || "Failed to update program" });
  }
}

// List all programs for a user (optionally filtered by clientId)
export async function listPrograms(req: Request, res: Response) {
  try {
    const { userId = "device", clientId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: "userId is required" });
    }

    let programs = [];
    
    if (clientId && typeof clientId === 'string') {
      // List programs for specific client
      const programPrefix = `programs/${userId}/${clientId}/`;
      const files = await listFiles(programPrefix);
      
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const programData = await downloadJson(file.name);
            // Skip deleted programs
            if (!programData.deleted) {
              programs.push(programData);
            }
          } catch (error) {
            console.warn(`[listPrograms] Failed to load program file ${file.name}:`, error);
          }
        }
      }
    } else {
      // List all programs for user across all clients
      const userPrefix = `programs/${userId}/`;
      const files = await listFiles(userPrefix);
      
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const programData = await downloadJson(file.name);
            // Skip deleted programs
            if (!programData.deleted) {
              programs.push(programData);
            }
          } catch (error) {
            console.warn(`[listPrograms] Failed to load program file ${file.name}:`, error);
          }
        }
      }
    }
    
    console.log(`[listPrograms] ✅ Found ${programs.length} programs for user ${userId}${clientId ? ` (client: ${clientId})` : ''}`);
    
    res.json({ 
      ok: true,
      programs,
      count: programs.length,
    });
  } catch (err: any) {
    console.error("[listPrograms] error:", err);
    res.status(500).json({ error: err?.message || "Failed to list programs" });
  }
}

// Get single program by ID
export async function getProgram(req: Request, res: Response) {
  try {
    const { userId, clientId, programId } = req.params;
    
    if (!userId || !clientId || !programId) {
      return res.status(400).json({ error: "userId, clientId, and programId are required" });
    }
    
    const programPath = `programs/${userId}/${clientId}/${programId}.json`;
    
    try {
      const program = await downloadJson(programPath);
      
      console.log(`[getProgram] ✅ Retrieved program: ${programId}`);
      
      res.json({
        ok: true,
        program,
      });
    } catch (error) {
      console.log(`[getProgram] ❌ Program not found: ${programPath}`);
      res.status(404).json({ error: "Program not found" });
    }
  } catch (err: any) {
    console.error("[getProgram] error:", err);
    res.status(500).json({ error: err?.message || "Failed to get program" });
  }
}

// Delete program
export async function deleteProgram(req: Request, res: Response) {
  try {
    const { userId, programId, clientId } = DeleteProgramBody.parse(req.body);
    
    if (!clientId) {
      return res.status(400).json({ error: "clientId is required for deletion" });
    }
    
    const programPath = `programs/${userId}/${clientId}/${programId}.json`;
    
    // Mark as deleted by uploading a tombstone record (following client deletion pattern)
    await uploadJson(programPath, {
      program_id: programId,
      client_id: clientId,
      deleted: true,
      deletedAt: new Date().toISOString(),
    });
    
    console.log(`[deleteProgram] ✅ Program marked as deleted: ${programId}`);
    
    res.json({ 
      ok: true,
      programId,
      message: "Program deleted successfully",
    });
  } catch (err: any) {
    console.error("[deleteProgram] error:", err);
    res.status(400).json({ error: err?.message || "Failed to delete program" });
  }
}

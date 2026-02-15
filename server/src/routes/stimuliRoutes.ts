import type { Request, Response } from "express";
import { z } from "zod";
import { downloadJson, listFiles, uploadJson } from "../lib/firebase";

// Zod schema for Stimulus validation
const StimulusSchema = z.object({
  stimulus_id: z.string(),
  program_id: z.string(),
  stimulus_text: z.string(),
  image_url: z.string().nullable(),
  review_status: z.enum(["pending", "approved", "rejected"]),
  generation_metadata: z.object({
    prompt: z.string(),
    model: z.string(),
    confidence_score: z.number(),
    acceptable_answers: z.array(z.string()).optional(),
  }),
  created_date: z.string(),
  reviewed_by: z.string().nullable(),
  reviewed_date: z.string().nullable(),
  trial_data: z.object({
    times_presented: z.number(),
    correct_responses: z.number(),
    accuracy_percent: z.number(),
  }),
});

const ListStimuliQuery = z.object({
  userId: z.string().default("device"),
  programId: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

const SubmitReviewBody = z.object({
  userId: z.string(),
  stimulusId: z.string(),
  programId: z.string(),
  status: z.enum(["approved", "rejected"]),
  feedback: z.string().optional(),
});

// List all stimuli for a user (optionally filtered by programId and status)
export async function listStimuli(req: Request, res: Response) {
  try {
    const { userId, programId, status } = ListStimuliQuery.parse(req.query);

    let allStimuli = [];
    
    if (programId) {
      // List stimuli for specific program
      const stimuliPrefix = `stimuli/${userId}/${programId}/`;
      const files = await listFiles(stimuliPrefix);
      
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const stimulusData = await downloadJson(file.name);
            // Skip deleted stimuli
            if (!stimulusData.deleted) {
              allStimuli.push(stimulusData);
            }
          } catch (error) {
            console.warn(`[listStimuli] Failed to load stimulus file ${file.name}:`, error);
          }
        }
      }
    } else {
      // List all stimuli for user across all programs
      const userPrefix = `stimuli/${userId}/`;
      const files = await listFiles(userPrefix);
      
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const stimulusData = await downloadJson(file.name);
            // Skip deleted stimuli
            if (!stimulusData.deleted) {
              allStimuli.push(stimulusData);
            }
          } catch (error) {
            console.warn(`[listStimuli] Failed to load stimulus file ${file.name}:`, error);
          }
        }
      }
    }

    // Apply status filter if provided
    if (status) {
      allStimuli = allStimuli.filter((s: any) => s.review_status === status);
    }
    
    console.log(`[listStimuli] ✅ Found ${allStimuli.length} stimuli for user ${userId}${programId ? ` (program: ${programId})` : ''}${status ? ` (status: ${status})` : ''}`);
    
    res.json({ 
      ok: true,
      stimuli: allStimuli,
      count: allStimuli.length,
    });
  } catch (err: any) {
    console.error("[listStimuli] error:", err);
    res.status(500).json({ error: err?.message || "Failed to list stimuli" });
  }
}

// Get single stimulus by ID
export async function getStimulus(req: Request, res: Response) {
  try {
    const { userId, programId, stimulusId } = req.params;
    
    if (!userId || !programId || !stimulusId) {
      return res.status(400).json({ error: "userId, programId, and stimulusId are required" });
    }
    
    const stimulusPath = `stimuli/${userId}/${programId}/${stimulusId}.json`;
    
    try {
      const stimulus = await downloadJson(stimulusPath);
      
      if (stimulus.deleted) {
        return res.status(404).json({ error: "Stimulus not found" });
      }
      
      console.log(`[getStimulus] ✅ Retrieved stimulus: ${stimulusId}`);
      
      res.json({
        ok: true,
        stimulus,
      });
    } catch (error) {
      console.log(`[getStimulus] ❌ Stimulus not found: ${stimulusPath}`);
      res.status(404).json({ error: "Stimulus not found" });
    }
  } catch (err: any) {
    console.error("[getStimulus] error:", err);
    res.status(500).json({ error: err?.message || "Failed to get stimulus" });
  }
}

// Submit review decision for a stimulus
export async function submitReview(req: Request, res: Response) {
  try {
    const { userId, stimulusId, programId, status, feedback } = SubmitReviewBody.parse(req.body);
    
    const stimulusPath = `stimuli/${userId}/${programId}/${stimulusId}.json`;
    
    // Load existing stimulus
    let stimulus;
    try {
      stimulus = await downloadJson(stimulusPath);
    } catch (error) {
      return res.status(404).json({ error: "Stimulus not found" });
    }
    
    // Update review fields
    const updatedStimulus = {
      ...stimulus,
      review_status: status,
      reviewed_by: userId,
      reviewed_date: new Date().toISOString(),
      review_feedback: feedback,
    };
    
    // Save updated stimulus
    await uploadJson(stimulusPath, updatedStimulus);
    
    console.log(`[submitReview] ✅ Review submitted for stimulus ${stimulusId}: ${status}`);
    
    res.json({ 
      ok: true,
      stimulus: updatedStimulus,
      message: "Review submitted successfully",
    });
  } catch (err: any) {
    console.error("[submitReview] error:", err);
    res.status(400).json({ error: err?.message || "Failed to submit review" });
  }
}

// Save generated stimulus to storage
export async function saveStimulus(req: Request, res: Response) {
  try {
    const { userId, programId, stimulus } = req.body;
    
    if (!userId || !programId || !stimulus) {
      return res.status(400).json({ error: "userId, programId, and stimulus are required" });
    }
    
    const stimulusId = stimulus.stimulus_id || crypto.randomUUID();
    const stimulusPath = `stimuli/${userId}/${programId}/${stimulusId}.json`;
    
    const stimulusData = {
      ...stimulus,
      stimulus_id: stimulusId,
      created_date: stimulus.created_date || new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };
    
    await uploadJson(stimulusPath, stimulusData);
    
    console.log(`[saveStimulus] ✅ Stimulus saved: ${stimulusId} for program ${programId}`);
    
    res.json({ 
      ok: true, 
      stimulusPath,
      stimulusId,
      stimulus: stimulusData,
    });
  } catch (err: any) {
    console.error("[saveStimulus] error:", err);
    res.status(400).json({ error: err?.message || "Failed to save stimulus" });
  }
}

// Delete stimulus (soft delete)
export async function deleteStimulus(req: Request, res: Response) {
  try {
    const { userId, stimulusId, programId } = req.body;
    
    if (!userId || !stimulusId || !programId) {
      return res.status(400).json({ error: "userId, stimulusId, and programId are required" });
    }
    
    const stimulusPath = `stimuli/${userId}/${programId}/${stimulusId}.json`;
    
    // Mark as deleted by uploading a tombstone record
    await uploadJson(stimulusPath, {
      stimulus_id: stimulusId,
      program_id: programId,
      deleted: true,
      deletedAt: new Date().toISOString(),
    });
    
    console.log(`[deleteStimulus] ✅ Stimulus marked as deleted: ${stimulusId}`);
    
    res.json({ 
      ok: true,
      stimulusId,
      message: "Stimulus deleted successfully",
    });
  } catch (err: any) {
    console.error("[deleteStimulus] error:", err);
    res.status(400).json({ error: err?.message || "Failed to delete stimulus" });
  }
}

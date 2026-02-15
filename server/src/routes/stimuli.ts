import type { Request, Response } from "express";
import { z } from "zod";
import { createStimuli, type ProgramType } from "../lib/replicate";

const Body = z.object({
  programType: z.enum(["tacting", "intraverbal", "lr", "vpmts", "seriation", "sorting"]),
  fields: z.record(z.any()).default({})
});

export async function generateStimuli(req: Request, res: Response) {
  try {
    const { programType, fields } = Body.parse(req.body);
    const data = await createStimuli(programType as ProgramType, fields);
    res.json(data);
  } catch (err: any) {
    console.error("stimuli.generateStimuli error:", err);
    res.status(500).json({ error: err?.message || "stimuli generation failed" });
  }
}

// Debug endpoint to view exclusion history
export async function getStimuliHistory(req: Request, res: Response) {
  try {
    // Import the history function (we'll need to export it from replicate.ts)
    const { getRecentStimuliForDebug } = await import("../lib/replicate");
    const history = getRecentStimuliForDebug();
    res.json({ history, message: "Current stimuli exclusion history" });
  } catch (err: any) {
    console.error("stimuli.getStimuliHistory error:", err);
    res.status(500).json({ error: err?.message || "failed to get history" });
  }
}

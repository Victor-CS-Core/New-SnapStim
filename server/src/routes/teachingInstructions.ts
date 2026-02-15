import type { Request, Response } from "express";
import { z } from "zod";
import { createTeachingInstructions, ProgramType } from "../lib/replicate";

const Body = z.object({
  programType: z.enum(["tacting", "intraverbal", "lr", "vpmts", "seriation", "sorting"]),
  fields: z.record(z.any()).default({})
});

export async function generateTeachingInstructions(req: Request, res: Response) {
  try {
    const { programType, fields } = Body.parse(req.body);
    const instructions = await createTeachingInstructions(programType as ProgramType, fields);
    res.json({ teachingInstructions: instructions });
  } catch (err: any) {
    console.error("teachingInstructions.generate error:", err);
    res.status(500).json({ error: err?.message || "teaching instructions generation failed" });
  }
}

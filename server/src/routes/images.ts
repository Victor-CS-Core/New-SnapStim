// server/src/routes/images.ts
import type { Request, Response } from "express";
import pLimit from "p-limit";
import { z } from "zod";
import { generateImageURL, type GetimgModel, type ImageStyle } from "../lib/getimg";

const Body = z.object({
  style: z.enum(["Real", "Cartoon", "Natural Environment", "Abstract"]),
  model: z.enum(["flux-schnell", "stable-diffusion-xl", "essential-v2"]).optional(),
  programTitle: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string().optional(),
      programType: z.string().optional(),
      category: z.string().optional(),
      key: z.string().optional()
    })
  )
});

export async function batchGenerate(req: Request, res: Response) {
  try {
    const { items, style, model, programTitle } = Body.parse(req.body);
    if (!items.length) return res.json({ results: [] });

    const limiter = pLimit(4); // batch 4 at a time (your requirement)
    const results = await Promise.all(
      items.map((it) =>
        limiter(async () => {
          try {
            const label = it.label || it.category || "object";
            const url = await generateImageURL({
              label,
              style: style as ImageStyle,
              width: 512,
              height: 512,
              model: model as GetimgModel | undefined,
              programTitle
            });
            return { id: it.id, label, url };
          } catch (err: any) {
            return { id: it.id, label: it.label || it.category || "object", error: err?.message || "failed" };
          }
        })
      )
    );

    res.json({ results });
  } catch (err: any) {
    console.error("images.batchGenerate error:", err);
    res.status(400).json({ error: err?.message || "Bad request" });
  }
}

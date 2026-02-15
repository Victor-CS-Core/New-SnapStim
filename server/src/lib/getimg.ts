export type ImageStyle = "Real" | "Cartoon" | "Natural Environment";
export type GetimgModel = "flux-schnell" | "stable-diffusion-xl" | "essential-v2";

function buildPrompt(label: string, style: ImageStyle, programTitle?: string): { prompt: string; negative_prompt: string } {
  const base = label.trim();
  
  // Add context from program title if available
  let contextualLabel = base;
  if (programTitle && programTitle.trim()) {
    const titleWords = programTitle.trim().toLowerCase();
    
    // Only add context if the label doesn't already contain the main subject
    if (!base.toLowerCase().includes(titleWords)) {
      contextualLabel = `${titleWords} ${base}`;
    }
  }
  
  const negatives = [
    "nsfw",
    "nudity",
    "gore",
    "blood",
    "watermark",
    "logo",
    "brand text",
    "text overlay",
    "low quality",
    "blurry",
    "out of frame",
    "cropped"
  ].join(", ");

  switch (style) {
    case "Cartoon":
      return {
        prompt: `flat cartoon vector of a single ${contextualLabel}, one item only, simple clean lines, plain white background, high contrast`,
        negative_prompt: negatives + ", multiple items, group, collection, many objects"
      };
    case "Natural Environment":
      return {
        prompt: `realistic photo of a single ${contextualLabel} in its natural environment, one item only, realistic lighting, depth of field`,
        negative_prompt: negatives + ", multiple items, group, collection, many objects"
      };
    case "Real":
    default:
      return {
        prompt: `high-resolution studio photo of a single ${contextualLabel}, one item only, plain white background, soft studio lighting`,
        negative_prompt: negatives + ", multiple items, group, collection, many objects"
      };
  }
}

export async function generateImageURL(opts: {
  label: string;
  style: ImageStyle;
  width?: number;
  height?: number;
  model?: GetimgModel;
  programTitle?: string;
}): Promise<string> {
  const key = (process.env.GETIMG_API_KEY || "").trim();
  if (!key) throw new Error("Missing GETIMG_API_KEY");

  const { prompt, negative_prompt } = buildPrompt(opts.label, opts.style, opts.programTitle);
  const width = opts.width ?? 512;
  const height = opts.height ?? 512;
  const model = opts.model ?? "flux-schnell";

  const endpoint = {
    "flux-schnell": "https://api.getimg.ai/v1/flux-schnell/text-to-image",
    "stable-diffusion-xl": "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image",
    "essential-v2": "https://api.getimg.ai/v1/essential-v2/text-to-image"
  }[model];

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      negative_prompt,
      width,
      height,
      response_format: "url" // return a (temporary) URL
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`getimg.ai error: ${res.status} ${res.statusText} ${text}`);
  }

  const data: any = await res.json();
  // Normalize possible shapes: { url }, { image }, { images:[{url}]} etc.
  const url =
    data?.url ??
    data?.image ??
    (Array.isArray(data?.images) ? data.images[0]?.url : null);

  if (!url || typeof url !== "string") {
    throw new Error("No image URL returned from getimg.ai");
  }
  // Replace all '\u0026' (escaped and unescaped) with '&' for easier use in browsers/clients
  return url.replace(/\\u0026|\u0026/g, "&");
}

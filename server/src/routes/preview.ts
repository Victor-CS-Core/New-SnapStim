import type { Request, Response } from "express";

// Simple HTML gallery of generated image URLs
export function previewImages(req: Request, res: Response) {
  const raw = req.query.urls;
  if (!raw || typeof raw !== "string") {
    return res.send("<h1>No images</h1><p>Pass ?urls=url1,url2,url3</p>");
  }

  const urls = raw.split(",").map(u => u.replace(/\\u0026/g, "&"));

  const html = `
    <html>
      <head>
        <title>Image Preview</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .grid { display: flex; flex-wrap: wrap; gap: 12px; }
          .grid img { max-width: 200px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
        </style>
      </head>
      <body>
        <h1>Preview (${urls.length} images)</h1>
        <div class="grid">
          ${urls.map(u => `<a href="${u}" target="_blank"><img src="${u}"/></a>`).join("")}
        </div>
      </body>
    </html>
  `;

  res.send(html);
}

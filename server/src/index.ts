import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { deleteClient, getClient, listClients, saveClient } from "./routes/clientRoutes";
import * as images from './routes/images';
import { previewImages } from "./routes/preview";
import previewGeneralizationRoute from './routes/preview-generalization';
import registerProgramHistoryRoutes from "./routes/programHistory";
import { deleteProgram, getProgram, listPrograms, saveProgram, updateProgram } from "./routes/programRoutes";
import { exportSession, fetchSessionImages, fetchSessionMeta, fetchSessionStimuli, listSavedSessions } from "./routes/session";
import * as stimuli from './routes/stimuli';
import { deleteStimulus, getStimulus, listStimuli, saveStimulus, submitReview } from "./routes/stimuliRoutes";
import * as teachingInstructions from './routes/teachingInstructions';
import registerSaveSessionRoute from "./saveSession";


console.log("[env] GETIMG_API_KEY length:", (process.env.GETIMG_API_KEY || "").trim().length);

const app = express();
app.use(express.json({ limit: '10mb' }));

const allowed = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, cb) =>
    cb(null, allowed.includes('*') || !origin || allowed.includes(origin)),
}));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/images/batch', images.batchGenerate);
app.post('/api/stimuli', stimuli.generateStimuli);
app.get('/api/stimuli/history', stimuli.getStimuliHistory);
app.get('/api/stimuli/list', listStimuli);
app.get('/api/stimuli/:userId/:programId/:stimulusId', getStimulus);
app.post('/api/stimuli/save', saveStimulus);
app.delete('/api/stimuli/delete', deleteStimulus);
app.post('/api/review/submit', submitReview);
app.post('/api/teaching-instructions', teachingInstructions.generateTeachingInstructions);
app.use('/api/generalization', previewGeneralizationRoute);
app.post("/api/session/export", exportSession);
app.get("/api/sessions", listSavedSessions);
// Old format (backward compatibility)
app.get("/api/session/:userId/:sessionId/meta", fetchSessionMeta);
app.get("/api/session/:userId/:sessionId/images", fetchSessionImages);
app.get("/api/session/:userId/:sessionId/stimuli", fetchSessionStimuli);

// New client-based format (with programId folder)
app.get("/api/session/:userId/:clientId/:programId/:sessionId/meta", fetchSessionMeta);
app.get("/api/session/:userId/:clientId/:programId/:sessionId/images", fetchSessionImages);
app.get("/api/session/:userId/:clientId/:programId/:sessionId/stimuli", fetchSessionStimuli);

// Simplified client-based format (no programId folder)
app.get("/api/session/:userId/:clientId/:sessionId/meta", fetchSessionMeta);
app.get("/api/session/:userId/:clientId/:sessionId/images", fetchSessionImages);  
app.get("/api/session/:userId/:clientId/:sessionId/stimuli", fetchSessionStimuli);

// Client management routes
app.post("/api/client/save", saveClient);
app.get("/api/client/list", listClients);
app.get("/api/client/:userId/:clientId", getClient);
app.delete("/api/client/delete", deleteClient);

// Program management routes
app.post("/api/program/save", saveProgram);
app.put("/api/program/update", updateProgram);
app.get("/api/program/list", listPrograms);
app.get("/api/program/:userId/:clientId/:programId", getProgram);
app.delete("/api/program/delete", deleteProgram);


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err?.status || 500).json({ error: err?.message || "Internal Server Error" });
});

registerSaveSessionRoute(app);
registerProgramHistoryRoutes(app);

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));

app.get("/api/images/preview", previewImages);


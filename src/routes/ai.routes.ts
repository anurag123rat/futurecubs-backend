import { Router, Request, Response } from "express";
import { getAI, SYSTEM_INSTRUCTION } from "../config/gemini";
import { protect } from "../middleware/auth";
import { aiRateLimiter } from "../middleware/aiRateLimiter";

const router = Router();

router.post("/chat", protect, aiRateLimiter, async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    const ai = await getAI();

    let stream;
    let lastError;
    const maxRetries = 2;

    // Retry only the stream-creation step, before anything is sent to client
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        stream = await ai.models.generateContentStream({
          model: "gemini-flash-latest",
          contents: message,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        break;
      } catch (err: any) {
        lastError = err;
        const isOverloaded = err?.status === 503 || err?.message?.includes("UNAVAILABLE");
        if (isOverloaded && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw err;
      }
    }

    if (!stream) {
      throw lastError || new Error("AI generation failed");
    }

    // Now start streaming to client — after this point, no more retries possible
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error(`[AI Chat Error] User: ${req.user?.id || "unknown"} | Error:`, err?.message || err);

    // If headers already sent (failed mid-stream), send error as SSE event
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`);
      return res.end();
    }

    // Otherwise, headers not sent yet — normal JSON error response works
    if (err?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "AI service is busy right now. Please try again in a moment.",
      });
    }

    if (err?.status === 404) {
      return res.status(500).json({
        success: false,
        error: "AI service is temporarily unavailable.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
});

export default router;
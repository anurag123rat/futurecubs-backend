import { Router, Request, Response } from "express";
import { getAI, SYSTEM_INSTRUCTION } from "../config/gemini";
import { protect } from "../middleware/auth";
import { aiRateLimiter } from "../middleware/aiRateLimiter";

const router = Router();

router.post("/chat", protect, aiRateLimiter, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const ai = await getAI();

    let lastError;
    let result;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        result = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: message,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        break; // success, exit retry loop
      } catch (err: any) {
        lastError = err;
        const isOverloaded = err?.status === 503 || err?.message?.includes("UNAVAILABLE");
        if (isOverloaded && attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // backoff: 1s, 2s
          continue;
        }
        throw err;
      }
    }
     if (!result) {
  throw lastError || new Error("AI generation failed");
}

    return res.status(200).json({ success: true, reply: result.text });
  } catch (err: any) {
    console.error(`[AI Chat Error] User: ${req.user?.id || "unknown"} | Error:`, err?.message || err);

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
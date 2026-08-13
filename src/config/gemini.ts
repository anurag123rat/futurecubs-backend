const SYSTEM_INSTRUCTION = `You are a friendly, safe assistant helping parents of toddlers (ages 1-5) on the FutureCubs platform. 
Only answer questions related to early childhood education, activities, learning milestones, and parenting guidance in that context. 
Do not give medical, legal, or safety-critical advice — redirect parents to a professional for those. 
Keep responses simple, warm, and age-appropriate in tone. 
If asked something unrelated or inappropriate, politely redirect back to child development topics.`;

let aiInstance: any = null;
let initPromise: Promise<any> | null = null;

async function getAI() {
  if (aiInstance) return aiInstance;

  if (!initPromise) {
    initPromise = import("@google/genai").then(({ GoogleGenAI }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in .env");
      }
      aiInstance = new GoogleGenAI({ apiKey });
      return aiInstance;
    });
  }

  return initPromise;
}

export { getAI, SYSTEM_INSTRUCTION };
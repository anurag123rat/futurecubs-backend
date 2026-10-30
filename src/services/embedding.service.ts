const EMBED_MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;

type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

let aiPromise: Promise<any> | null = null;

export const getAi = () => {
  if (!aiPromise) {
    aiPromise = import("@google/genai").then(
      ({ GoogleGenAI }) => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    );
  }
  return aiPromise;
};

export const embedTexts = async (
  texts: string[],
  taskType: TaskType
): Promise<number[][]> => {
  const ai = await getAi();
  const res = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: texts,
    config: { taskType, outputDimensionality: DIMENSIONS },
  });
  return res.embeddings.map((e: any) => e.values as number[]);
};
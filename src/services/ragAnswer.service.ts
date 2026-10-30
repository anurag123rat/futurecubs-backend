import { embedTexts, getAi } from "./embedding.service";
import { getCollection } from "../config/chroma";

const TOP_K = 5;
const GEN_MODEL = "gemini-flash-lite-latest";

const SYSTEM_INSTRUCTION = `Tum FutureCubs ke assistant ho. Tumhe sirf neeche diye gaye "Context" (bachchon ki stories) ke basis par jawab dena hai.
Rules:
- Jawab Hinglish mein, chhota aur saaf do.
- Jawab mein bachche ka naam aur age zaroor batao.
- Agar context mein sawaal ka jawab nahi hai, to seedha bolo ki stories mein ye info nahi mili. Apni taraf se kuch mat banao.
- Context se bahar ki baat mat banao.`;

export const answerQuestion = async (question: string) => {
  const [queryEmbedding] = await embedTexts([question], "RETRIEVAL_QUERY");

  const collection = await getCollection();
  const result = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: TOP_K,
  });

  const docs = result.documents[0] ?? [];
  const metas = result.metadatas[0] ?? [];
  const distances = result.distances?.[0] ?? [];

  const context = docs
    .map((d, i) => `[Story ${i + 1}]\n${d}`)
    .join("\n\n");

  const ai = await getAi();
  const response = await ai.models.generateContent({
    model: GEN_MODEL,
    contents: `Context:\n${context}\n\nSawaal: ${question}`,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  });

  return {
    answer: response.text as string,
    sources: metas.map((m: any, i: number) => ({
      name: m?.name,
      age: m?.age,
      distance: distances[i],
    })),
  };
};
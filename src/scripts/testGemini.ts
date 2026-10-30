import "dotenv/config";
import { getAi } from "../services/embedding.service";

async function main() {
  const ai = await getAi();
  for (const model of ["gemini-flash-lite-latest"]) {
    const t = Date.now();
    try {
      const r = await ai.models.generateContent({
        model,
        contents: "Say hi in one word",
      });
      console.log(model, "OK", Date.now() - t, "ms ->", r.text);
    } catch (e: any) {
      console.log(model, "FAIL", Date.now() - t, "ms ->", String(e.message).slice(0, 200));
    }
  }
}

main();
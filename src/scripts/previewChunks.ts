import path from "path";
import fs from "fs";
import { extractPdfText } from "../services/pdfText.service";
import { splitIntoChunks } from "../services/textSplitter.service";

async function main() {
  const dir = path.join(process.cwd(), "uploads", "rag");
  const file = fs.readdirSync(dir).find((f) => f.endsWith(".pdf"));
  if (!file) throw new Error("uploads/rag mein PDF nahi mili");

  const text = await extractPdfText(path.join(dir, file));
  console.log("Total characters:", text.length);

  const chunks = splitIntoChunks(text);
  console.log("Total chunks:", chunks.length);
  console.log("\n--- Chunk 0 ---\n", chunks[0]?.text);
  console.log("\n--- Chunk 1 ---\n", chunks[1]?.text);

  fs.writeFileSync(
    path.join(process.cwd(), "uploads", "chunks-preview.json"),
    JSON.stringify(chunks, null, 2),
    "utf-8"
  );
  console.log("\nSaved: uploads/chunks-preview.json");
}

main().catch(console.error);
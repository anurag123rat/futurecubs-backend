import { RagDocument } from "../models/RagDocument.model";
import { extractPdfText } from "./pdfText.service";
import { splitIntoChunks } from "./textSplitter.service";
import { embedTexts } from "./embedding.service";
import { getCollection } from "../config/chroma";

export const ingestDocument = async (docId: string) => {
  const doc = await RagDocument.findById(docId);
  if (!doc) throw new Error("Document nahi mila");

  try {
    doc.status = "processing";
    doc.error = undefined;
    await doc.save();

    const text = await extractPdfText(doc.filePath);
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) throw new Error("Koi chunk nahi bana");

    const embeddings = await embedTexts(
      chunks.map((c) => c.text),
      "RETRIEVAL_DOCUMENT"
    );

    const collection = await getCollection();
    const documentId = String(doc._id);

    // dobara ingest karo to purane chunks hat jayein
    await collection.delete({ where: { documentId } });

    await collection.add({
      ids: chunks.map((c) => `${documentId}-${c.index}`),
      documents: chunks.map((c) => c.text),
      embeddings,
      metadatas: chunks.map((c) => ({
        documentId,
        chunkIndex: c.index,
        name: c.name ?? "",
        age: c.age ?? "",
      })),
    });

    doc.status = "completed";
    doc.chunkCount = chunks.length;
    await doc.save();
  } catch (err: any) {
    doc.status = "failed";
    doc.error = err?.message ?? "Unknown error";
    await doc.save();
    throw err;
  }
};
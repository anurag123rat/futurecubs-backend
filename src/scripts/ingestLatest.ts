import "dotenv/config";
import mongoose from "mongoose";
import { RagDocument } from "../models/RagDocument.model";
import { ingestDocument } from "../services/ingest.service";
import { getCollection } from "../config/chroma";

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const doc = await RagDocument.findOne().sort({ createdAt: -1 });
  if (!doc) throw new Error("Koi uploaded document nahi mila");

  console.log("Ingesting:", doc.originalName);
  await ingestDocument(String(doc._id));

  const updated = await RagDocument.findById(doc._id);
  console.log("Status:", updated?.status, "| chunkCount:", updated?.chunkCount);

  const collection = await getCollection();
  console.log("Chroma count:", await collection.count());

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
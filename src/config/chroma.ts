import { ChromaClient } from "chromadb";

export const COLLECTION_NAME = "futurecubs_testimonials";

export const chroma = new ChromaClient({ host: "localhost", port: 8000 });

export const getCollection = () =>
  chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction: null, // generate embedding from here
    configuration: { hnsw: { space: "cosine" } },
  });
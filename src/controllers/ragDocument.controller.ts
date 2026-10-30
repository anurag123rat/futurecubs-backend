import { Request, Response } from "express";
import { RagDocument } from "../models/RagDocument.model";
import { ingestDocument } from "../services/ingest.service";

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "PDF bhejo (field name: file)" });
    return;
  }

  const doc = await RagDocument.create({
    originalName: req.file.originalname,
    filePath: req.file.path,
    size: req.file.size,
  });

  res.status(201).json({ success: true, data: doc });

  ingestDocument(String(doc._id)).catch((err) =>
    console.error("Ingest failed:", err.message)
  );
};

export const listDocuments = async (_req: Request, res: Response) => {
  const docs = await RagDocument.find().sort({ createdAt: -1 });
  res.json({ success: true, data: docs });
};

export const getDocument = async (req: Request, res: Response) => {
  const doc = await RagDocument.findById(req.params.id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document nahi mila" });
    return;
  }
  res.json({ success: true, data: doc });
};

export const reingestDocument = async (req: Request, res: Response) => {
  const doc = await RagDocument.findById(req.params.id);
  if (!doc) {
    res.status(404).json({ success: false, message: "Document nahi mila" });
    return;
  }
  if (doc.status === "processing") {
    res.status(409).json({ success: false, message: "Ingest already chal raha hai" });
    return;
  }

  res.json({ success: true, message: "Ingest shuru ho gaya" });

  ingestDocument(String(doc._id)).catch((err) =>
    console.error("Re-ingest failed:", err.message)
  );
};
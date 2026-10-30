import { Schema, model, Document } from "mongoose";

export type RagDocStatus = "uploaded" | "processing" | "completed" | "failed";

export interface IRagDocument extends Document {
  originalName: string;
  filePath: string;
  size: number;
  status: RagDocStatus;
  chunkCount: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ragDocumentSchema = new Schema<IRagDocument>(
  {
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    size: { type: Number, required: true },
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },
    chunkCount: { type: Number, default: 0 },
    error: { type: String },
  },
  { timestamps: true }
);

export const RagDocument = model<IRagDocument>("RagDocument", ragDocumentSchema);
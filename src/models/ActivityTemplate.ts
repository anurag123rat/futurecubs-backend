// models/ActivityTemplate.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IActivityItem {
  id: string;
  label: string;
  emoji?: string;
  imageUrl?: string;
  matchId?: string; 
  role?: "source" | "target";
}

export interface IActivityTemplate extends Document {
  title: string;
  description?: string;
  activityType: "drag-drop-match" | "shape-sort" | "color-match"; // jitne types banao utne yaha add karo
  ageGroupMin: number;
  ageGroupMax: number;
  config: {
    items: IActivityItem[];
    instructions?: string;
  };
  status: "active" | "draft";
  createdBy: mongoose.Types.ObjectId; // admin/superadmin jisne banaya
  createdAt: Date;
  updatedAt: Date;
}

const ActivityItemSchema = new Schema<IActivityItem>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    emoji: { type: String },
    imageUrl: { type: String },
    matchId: { type: String },
    role: { type: String, enum: ["source", "target"] },
  },
  { _id: false }
);

const ActivityTemplateSchema = new Schema<IActivityTemplate>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    activityType: {
      type: String,
      enum: ["drag-drop-match", "shape-sort", "color-match"],
      required: true,
    },
    ageGroupMin: { type: Number, required: true, min: 2 },
    ageGroupMax: { type: Number, required: true, max: 8 },
    config: {
      items: { type: [ActivityItemSchema], required: true },
      instructions: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Age-group query ke liye index — teacher jab age se filter karega tab fast lookup hoga
ActivityTemplateSchema.index({ ageGroupMin: 1, ageGroupMax: 1, status: 1 });

const ActivityTemplate: Model<IActivityTemplate> =
  mongoose.models.ActivityTemplate ||
  mongoose.model<IActivityTemplate>("ActivityTemplate", ActivityTemplateSchema);

export default ActivityTemplate;
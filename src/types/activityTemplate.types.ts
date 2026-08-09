import { Types } from "mongoose";

export type ActivityTemplateStatus = "active" | "draft";

export interface IActivityItem {
  id: string;
  label: string;
  emoji?: string;
  imageUrl?: string;
  matchId?: string; // kis dusre item ki id se match karta hai
}

export interface IActivityTemplate {
  title: string;
  description?: string;
  activityType: string; // "drag-drop-match", "shape-sort" waghera
  ageGroupMin: number;
  ageGroupMax: number;
  config: {
    items: IActivityItem[];
    instructions?: string;
  };
  status: ActivityTemplateStatus;
  createdBy: Types.ObjectId;
}
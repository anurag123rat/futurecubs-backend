import { Types } from "mongoose";

export type LessonStatus = "active" | "draft";

export interface ILesson {
  title: string;
  description?: string;
  ageGroupMin: number;
  ageGroupMax: number;
  slidesUrl?: string; // Google Drive link jaha PPT/slides hain
  activityTemplateIds: Types.ObjectId[]; // is lesson ke 8 activities
  status: LessonStatus;
  createdBy: Types.ObjectId;
}
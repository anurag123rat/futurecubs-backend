import { Types } from "mongoose";

export type ActivityStatus = "pending" | "submitted";

export interface IActivity {
  studentId: Types.ObjectId;
  parentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  templateId: Types.ObjectId;
  status: ActivityStatus;
  result?: {
    score: number;
    total: number;
    details?: any;
  };
  startedAt: Date;
  submittedAt?: Date;
}
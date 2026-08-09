import mongoose, { Schema } from "mongoose";
import { IActivity } from "../types/activity.types";

const activitySchema = new Schema<IActivity>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    templateId: {
      type: Schema.Types.ObjectId,
      ref: "ActivityTemplate",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "submitted"],
      default: "pending",
    },

    result: {
      score: { type: Number },
      total: { type: Number },
      details: { type: Schema.Types.Mixed },
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ studentId: 1, status: 1 });
activitySchema.index({ teacherId: 1, status: 1 });

const Activity = mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;
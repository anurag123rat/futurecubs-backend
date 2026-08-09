import mongoose, { Schema } from "mongoose";
import { ILesson } from "../types/lesson.types";

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    ageGroupMin: {
      type: Number,
      required: true,
      min: 2,
    },

    ageGroupMax: {
      type: Number,
      required: true,
      max: 8,
    },

    slidesUrl: {
      type: String,
      trim: true,
    },

    activityTemplateIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "ActivityTemplate",
      },
    ],

    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ ageGroupMin: 1, ageGroupMax: 1, status: 1 });

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;
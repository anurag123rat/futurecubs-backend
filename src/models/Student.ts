import mongoose, { Schema } from "mongoose";
import { IStudent } from "../types/student.type";

const studentSchema = new Schema<IStudent>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    age: {
      type: Number,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
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

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
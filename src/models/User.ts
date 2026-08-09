import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user.types";
import { ROLES } from "../constants/role";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // Exclude password from query results by default
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    lastLogin: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

/**
 * Hash password before saving
 */
userSchema.pre("save", async function () {
  // Password change nahi hua to dobara hash mat karo
  if (!this.isModified("password")) {
    return 
  }

  // Password Hash
  this.password = await bcrypt.hash(this.password, 10);

  
});

/**
 * Compare entered password with hashed password
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
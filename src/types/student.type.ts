import { Types } from "mongoose";

export interface IStudent {
  firstName: string;
  lastName?: string;
  age: number;
  avatar?: string;
  parentId: Types.ObjectId;
  teacherId: Types.ObjectId;
  status: boolean;
}
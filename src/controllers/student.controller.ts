import { Request, Response } from "express";
import Student from "../models/Student";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const getTeacherStudents = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;

    const students = await Student.find({ teacherId, status: true })
      .populate("parentId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
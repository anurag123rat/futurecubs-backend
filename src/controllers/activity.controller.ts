import { Request, Response } from "express";
import Activity from "../models/Activity";
import Student from "../models/Student";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Teacher: activity start karo kisi student ke liye
export const startActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, templateId } = req.body;
    const teacherId = req.user?.id;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    if (!templateId) {
      return res.status(400).json({ message: "templateId is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Same student ke liye already pending activity hai to dobara mat banao
    const existing = await Activity.findOne({
      studentId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "An activity is already pending for this student" });
    }

    const activity = await Activity.create({
      studentId,
      parentId: student.parentId,
      teacherId,
      templateId,
      status: "pending",
      startedAt: new Date(),
    });

    res.status(201).json({ message: "Activity started", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Parent: apne bachhon ke pending activities dekhna
export const getParentActivities = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?.id;

    const activities = await Activity.find({
      parentId,
      status: "pending",
    }).populate("studentId", "firstName lastName age avatar").populate("templateId");

    res.status(200).json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Parent: single activity dekhna, template config ke saath (play page ke liye)

export const getActivityById = async (req: AuthRequest, res: Response) => {
  try {
    const { activityId } = req.params;
    const parentId = req.user?.id;

    const activity = await Activity.findOne({ _id: activityId, parentId })
      .populate("studentId", "firstName lastName age")
      .populate("templateId");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Parent: activity submit karna
export const submitActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { activityId } = req.params;
    const { score, total, details } = req.body;
    const parentId = req.user?.id;

    const activity = await Activity.findOne({ _id: activityId, parentId });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.status === "submitted") {
      return res.status(400).json({ message: "Activity already submitted" });
    }

    activity.status = "submitted";
    activity.result = { score, total, details };
    console.log("Received body:", req.body);
    activity.submittedAt = new Date();

    await activity.save();

    res.status(200).json({ message: "Activity submitted", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Teacher: apne diye hue activities dekhna (pending + submitted, filter se)
export const getTeacherActivities = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { status } = req.query;

    const filter: any = { teacherId };
    if (status) filter.status = status;

    const activities = await Activity.find(filter)
      .populate("studentId", "firstName lastName age avatar")
      .populate("parentId", "firstName lastName email")
      .populate("templateId")
      .sort({ createdAt: -1 });

    res.status(200).json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
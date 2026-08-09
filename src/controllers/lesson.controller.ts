import { Request, Response } from "express";
import Lesson from "../models/Lesson";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Teacher/Admin: naya lesson banana
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, ageGroupMin, ageGroupMax, slidesUrl, status } = req.body;
    const createdBy = req.user?.id;

    if (!title || ageGroupMin === undefined || ageGroupMax === undefined) {
      return res.status(400).json({ message: "title, ageGroupMin, ageGroupMax required" });
    }

    const lesson = await Lesson.create({
      title,
      description,
      ageGroupMin,
      ageGroupMax,
      slidesUrl,
      status: status || "draft",
      createdBy,
      activityTemplateIds: [],
    });

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sab lessons list karna (teacher dashboard ke liye)
export const getLessons = async (req: AuthRequest, res: Response) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.status(200).json({ lessons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Single lesson dekhna, uske activities populate ke saath
export const getLessonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate("activityTemplateIds");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lesson mein activity attach/remove karna
export const updateLessonActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { activityTemplateIds } = req.body; // poora naya array bhejna hoga

    if (!Array.isArray(activityTemplateIds)) {
      return res.status(400).json({ message: "activityTemplateIds must be an array" });
    }

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { activityTemplateIds },
      { new: true }
    ).populate("activityTemplateIds");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Activities updated", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lesson ki basic details edit karna
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, ageGroupMin, ageGroupMax, slidesUrl, status } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { title, description, ageGroupMin, ageGroupMax, slidesUrl, status },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson updated", lesson });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
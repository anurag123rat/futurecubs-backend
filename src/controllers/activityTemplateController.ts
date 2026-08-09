import { Request, Response } from "express";
import ActivityTemplate from "../models/ActivityTemplate";

// Teacher: available templates dekhna, student ki age ke hisaab se filter ho ke
export const getActivityTemplates = async (req: Request, res: Response) => {
  try {
    const { age } = req.query;

    const filter: any = { status: "active" };

    if (age) {
      const ageNum = Number(age);
      filter.ageGroupMin = { $lte: ageNum };
      filter.ageGroupMax = { $gte: ageNum };
    }

    const templates = await ActivityTemplate.find(filter).select(
      "title description activityType ageGroupMin ageGroupMax"
    );

    res.status(200).json({ templates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
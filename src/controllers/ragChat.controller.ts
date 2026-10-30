import { Request, Response } from "express";
import { answerQuestion } from "../services/ragAnswer.service";

export const askQuestion = async (req: Request, res: Response) => {
  const question = String(req.body?.question ?? "").trim();
  if (!question) {
    res.status(400).json({ success: false, message: "question bhejo" });
    return;
  }

  const data = await answerQuestion(question);
  res.json({ success: true, data });
};
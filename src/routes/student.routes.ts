import { Router } from "express";
import { protect, authorize } from "../middleware/auth";
import { getTeacherStudents } from "../controllers/student.controller";

const router = Router();

router.get("/teacher", protect, authorize("teacher"), getTeacherStudents);

export default router;
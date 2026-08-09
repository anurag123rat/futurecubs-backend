import { Router } from "express";
import { protect, authorize } from "../middleware/auth";
import {
  createLesson,
  getLessons,
  getLessonById,
  updateLessonActivities,
  updateLesson,
} from "../controllers/lesson.controller";

const router = Router();

router.post("/", protect, authorize("teacher", "admin"), createLesson);
router.get("/", protect, authorize("teacher", "admin"), getLessons);
router.get("/:id", protect, authorize("teacher", "admin"), getLessonById);
router.patch("/:id", protect, authorize("teacher", "admin"), updateLesson);
router.patch("/:id/activities", protect, authorize("teacher", "admin"), updateLessonActivities);

export default router;
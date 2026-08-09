import { Router } from "express";
import { protect, authorize } from "../middleware/auth";
import {
  startActivity,
  getParentActivities,
  submitActivity,
  getTeacherActivities,
  getActivityById,
} from "../controllers/activity.controller";

const router = Router();

// Teacher routes
router.post("/start", protect, authorize("teacher"), startActivity);
router.get("/teacher", protect, authorize("teacher"), getTeacherActivities);

// Parent routes
router.get("/parent", protect, authorize("parent"), getParentActivities);
router.get("/:activityId", protect, authorize("parent"), getActivityById); 
router.patch("/:activityId/submit", protect, authorize("parent"), submitActivity);

export default router;
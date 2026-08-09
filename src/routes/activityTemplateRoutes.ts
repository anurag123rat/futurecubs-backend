import express from "express";
import { getActivityTemplates } from "../controllers/activityTemplateController";
import { protect, authorize } from "../middleware/auth"; // apne actual middleware path/naam se match kar lena

const router = express.Router();

router.get("/", protect, authorize("teacher", "admin"), getActivityTemplates);

export default router;


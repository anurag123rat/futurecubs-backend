// import { Router } from "express";
// import { uploadPdf } from "../middleware/ragUpload.middleware";
// import { askQuestion } from "../controllers/ragChat.controller";
// import { protect } from "../middleware/auth";
// import {
//   uploadDocument,
//   listDocuments,
//   getDocument,
// } from "../controllers/ragDocument.controller";

// const router = Router();

// // TODO: after this add admin auth middleware to protect these routes
// router.post("/documents", uploadPdf.single("file"), uploadDocument);
// router.get("/documents", listDocuments);
// router.get("/documents/:id", getDocument);
// router.post("/ask", protect, askQuestion);

// export default router;
import { Router } from "express";
import { protect, authorize } from "../middleware/auth"; // path apni ai route file se match karo
import { uploadPdf } from "../middleware/ragUpload.middleware";
import {
  uploadDocument,
  listDocuments,
  getDocument,
  reingestDocument,
} from "../controllers/ragDocument.controller";
import { askQuestion } from "../controllers/ragChat.controller";

const router = Router();

// Admin-only: PDF upload, list, status, re-ingest
router.post("/documents", protect, authorize("admin", "superadmin"), uploadPdf.single("file"), uploadDocument);
router.get("/documents", protect, authorize("admin", "superadmin"), listDocuments);
router.get("/documents/:id", protect, authorize("admin", "superadmin"), getDocument);
router.post("/documents/:id/ingest", protect, authorize("admin", "superadmin"), reingestDocument);

// Logged-in users: sawaal pooch sakte hain
router.post("/ask", protect, askQuestion);

export default router;
import { Router } from "express";
import { login, refresh, logout } from "../controllers/auth.controller";
import { loginValidator } from "../validators/auth.validator";
import { protect, authorize } from "../middleware/auth";


const router = Router();

router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Test route — sirf superadmin access kar sake
router.get("/me", protect, (req: any, res) => {
  res.status(200).json({ message: "You are authenticated!", user: req.user });
});

export default router;
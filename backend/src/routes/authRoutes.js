import express from "express";
import { registerUser, loginUser, getMe, logoutUser, updateProfile, changePassword } from "../controllers/authController.js";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../utils/validationSchemas.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const noCache = (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
};

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", noCache, protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put("/change-password", protect, validate(changePasswordSchema), changePassword);
router.post("/logout",logoutUser);

export default router
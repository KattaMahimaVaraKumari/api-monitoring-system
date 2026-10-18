import express from "express";
import { registerUser, loginUser, getMe, logoutUser, updateProfile } from "../controllers/authController.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../utils/validationSchemas.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.post("/logout",logoutUser);

export default router
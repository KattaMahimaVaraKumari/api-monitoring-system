import express from "express";
import { registerUser } from "../controllers/authController.js";
import { validate } from "../middleware/validationMiddleware.js";
import { registerSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);

export default router
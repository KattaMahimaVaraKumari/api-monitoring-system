import express from "express";

import { createMonitor } from "../controllers/monitorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createMonitorSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", protect, validate(createMonitorSchema), createMonitor);

export default router;
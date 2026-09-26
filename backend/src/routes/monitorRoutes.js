import express from "express";

import { createMonitor, getMonitors, getMonitor, updateMonitor, deleteMonitor } from "../controllers/monitorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createMonitorSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", protect, validate(createMonitorSchema), createMonitor);
router.get("/", protect, getMonitors);
router.get("/:id", protect, getMonitor);
router.put("/:id", protect, validate(createMonitorSchema),updateMonitor);
router.delete("/:id", protect, deleteMonitor);

export default router;
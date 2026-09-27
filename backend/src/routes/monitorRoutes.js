import express from "express";

import { createMonitor, getMonitors, getMonitor, updateMonitor, deleteMonitor } from "../controllers/monitorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createMonitorSchema, updateMonitorSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", protect, validate(createMonitorSchema), createMonitor);
router.get("/", protect, getMonitors);
router.get("/:id", protect, getMonitor);
router.put("/:id", protect, validate(updateMonitorSchema),updateMonitor);
router.delete("/:id", protect, deleteMonitor);

export default router;
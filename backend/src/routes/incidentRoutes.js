import express from "express";

import { getIncidents, getIncident } from "../controllers/incidentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getIncidents);
router.get("/:id", protect, getIncident);

export default router;
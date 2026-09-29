import express from "express";
import { getMonitorAnalytics } from "../controllers/analyticsController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/monitors/:id", protect, getMonitorAnalytics);

export default router;
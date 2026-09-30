import express from "express";
import { getMonitorAnalytics, getDashboardAnalytics, getMonitorTimeSeriesData, } from "../controllers/analyticsController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.get("/monitors/:id/timeseries", protect, getMonitorTimeSeriesData);
router.get("/monitors/:id", protect, getMonitorAnalytics);

export default router;
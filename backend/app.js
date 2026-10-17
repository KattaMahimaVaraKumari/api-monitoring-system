import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes.js";
import monitorRoutes from "./src/routes/monitorRoutes.js";
import incidentRoutes from "./src/routes/incidentRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import apiKeyRoutes from "./src/routes/apiKeyRoutes.js";
import {
  notFound,
  errorHandler,
} from "./src/middleware/errorMiddleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "API Monitoring System Backend is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Monitoring System backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/monitors", monitorRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/keys", apiKeyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

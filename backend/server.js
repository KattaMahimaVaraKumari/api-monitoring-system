import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import monitorRoutes from "./src/routes/monitorRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "API Monitoring System Backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth",authRoutes);
app.use("/api/monitors",monitorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
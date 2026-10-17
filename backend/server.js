import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import startMonitorJob from "./src/jobs/monitorJob.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  startMonitorJob();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
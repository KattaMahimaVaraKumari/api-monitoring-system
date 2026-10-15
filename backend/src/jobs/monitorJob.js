import cron from "node-cron";
import Monitor from "../models/Monitor.js";
import checkMonitor from "../services/monitoringService.js";

const startMonitorJob = () => {
    let isJobRunning = false;

    cron.schedule("* * * * *", async () => {
        if (isJobRunning) {
            console.log("Previous monitor job is still running. Skipping this run.");
            return;
        }

        isJobRunning = true;
        
        console.log("Running monitor job...");

        try {
            const monitors = await Monitor.find({
                active: true,
            });

            for (const monitor of monitors) {
                try {
                    const now = Date.now();
                    const intervalMs = monitor.interval * 60 * 1000;

                    const lastChecked = monitor.lastCheckedAt
                        ? monitor.lastCheckedAt.getTime()
                        : 0;

                    const timeSinceLastCheck = now - lastChecked;

                    if (timeSinceLastCheck >= intervalMs) {
                        await checkMonitor(monitor);

                        console.log(`Checked: ${monitor.name}`);
                    }
                } catch (error) {
                    console.error(
                        `Failed to process monitor ${monitor.name}:`,
                        error.message
                    );
                }
            }
        } catch (error) {
            console.error("Monitor job failed:", error.message);
        } finally {
            isJobRunning = false;
        }
    });
    console.log("Monitor job started");
};

export default startMonitorJob;
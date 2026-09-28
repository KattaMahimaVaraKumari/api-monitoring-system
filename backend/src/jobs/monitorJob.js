import cron from "node-cron";
import Monitor from "../models/Monitor.js";
import checkMonitor from "../services/monitoringService.js"

const startMonitorJob = () => {
    cron.schedule("* * * * *", async ()=>{
        console.log("Running monitor job...");

        try{
            const monitors = await Monitor.find({
                active: true,
            });

            for(const monitor of monitors){
                await checkMonitor(monitor);
                console.log(`Checked: ${monitor.name}`);
            }

        } catch(error){
            console.error("Monitor job failed:" , error.message);
        }
    });
    console.log("Monitor job started");
}

export default startMonitorJob;
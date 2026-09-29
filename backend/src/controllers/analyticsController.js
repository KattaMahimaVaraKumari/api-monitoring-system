import Monitor from "../models/Monitor.js";
import getMonitorMetrics from "../services/analyticsService.js";

export const getMonitorAnalytics = async (req,res) =>{
    try{
        const monitor = await Monitor.findOne({
            _id : req.params.id,
            userId: req.user._id,
        });

        if(!monitor){
            return res.status(404).json({
                message: "Monitor not found",
            });
        }

        const metrics = await getMonitorMetrics(monitor._id);

        res.json({
            monitor:{
                id: monitor._id,
                name: monitor.name,
                url: monitor.url,
                status: monitor.status,
            },
            metrics,
        });
    } catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
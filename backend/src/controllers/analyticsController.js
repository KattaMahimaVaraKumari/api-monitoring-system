import Monitor from "../models/Monitor.js";
import getMonitorMetrics,{getDashboardMetrics, getMonitorTimeSeries,} from "../services/analyticsService.js";

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


export const getDashboardAnalytics = async (req, res) => {
    try {
        const monitors = await Monitor.find({ userId: req.user._id, });

        const monitorIds = monitors.map((monitor) => monitor._id);

        const metrics = await getDashboardMetrics(monitorIds);

        const totalApis = monitors.length;

        res.json({
            totalApis,
            ...metrics,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}


export const getMonitorTimeSeriesData = async (req, res) => {
    try {
        const monitor = await Monitor.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!monitor) {
            return res.status(404).json({
                message: "Monitor not found",
            });
        }

        const hours = Number(req.query.hours) || 24;

        const events = await getMonitorTimeSeries(monitor._id, hours);

        res.json({
            monitor: {
                id: monitor._id,
                name: monitor.name,
            },
            hours,
            events,
        });
    } catch (error) {
        res.status(500).json({
            messgae: "Server error",
            error: error.message,
        });
    }
};
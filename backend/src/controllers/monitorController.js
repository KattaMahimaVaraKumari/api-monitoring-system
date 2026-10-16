import Monitor from "../models/Monitor.js";
import checkMonitor from "../services/monitoringService.js";

export const createMonitor = async (req, res)=>{
    try{
        const {name, url, method, expectedStatus, interval, timeout,} = req.body;
        
        const existingMonitor = await Monitor.findOne({
            userId: req.user._id,
            url: req.body.url,
            method: req.body.method || "GET",
        });

        if (existingMonitor) {
            return res.status(409).json({
                message: "You already have a monitor for this URL and method",
            });
        }

        const monitor = await Monitor.create({userId: req.user._id, name, url, method, expectedStatus, interval, timeout});

        res.status(201).json({
            message: "Monitor created successfully", monitor,
        });
    } catch(error){
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const getMonitors = async (req,res) =>{
    try{
        const monitors = await Monitor.find({
            userId: req.user._id,
        }).sort({ createdAt: -1});

        res.json({
            monitors,
        });

    } catch (error) {
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
});
    }
}


export const getMonitor = async (req, res) => {
    try {
        const monitor = await Monitor.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!monitor.active) {
            return res.status(400).json({
                message: "Cannot test an inactive monitor. Activate it first.",
            });
        }

        res.json({
            monitor,
        });

    } catch (error) {
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const updateMonitor = async (req, res) => {
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

        const { name, url, method, expectedStatus, interval, timeout, active, } = req.body;

        monitor.name = name ?? monitor.name;
        monitor.url = url ?? monitor.url;
        monitor.method = method ?? monitor.method;
        monitor.expectedStatus = expectedStatus ?? monitor.expectedStatus;
        monitor.interval = interval ?? monitor.interval;
        monitor.timeout = timeout ?? monitor.timeout;
        monitor.active = active ?? monitor.active;

        await monitor.save();

        res.json({
            message: "Monitor updated successfully",
            monitor,
        });

    } catch (error) {
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const deleteMonitor = async(req,res) =>{
    try{
        const monitor = await Monitor.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!monitor){
            return res.status(404).json({
                message: "Monitor not found",
            });
        }

        res.json({
            message: "Monitor deleted successfully",
        });

    } catch (error){
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const testMonitor = async (req, res) => {
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

        if (!monitor.active) {
            return res.status(400).json({
                message: "Cannot test an inactive monitor. Activate it first.",
            });
        }

        const result = await checkMonitor(monitor);

        res.json({
            monitor: monitor.name,
            result,
        });
    } catch (error) {
        console.error("Monitor controller error:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};
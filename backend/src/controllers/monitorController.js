import Monitor from "../models/Monitor.js";
import checkMonitor from "../services/monitoringService.js";

export const createMonitor = async (req, res)=>{
    try{
        const {name, url, method, expectedStatus, interval, timeout,} = req.body;

        const monitor = await Monitor.create({userId: req.user._id, name, url, method, expectedStatus, interval, timeout});

        res.status(201).json({
            message: "Monitor created successfully", monitor,
        });
    } catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
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
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}


export const getMonitor = async (req, res) => {
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

        res.json({
            monitor,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
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
        res.status(500).json({
            message: "Server error",
            error: error.message,
        })
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
        res.status(500).json({
            message: "Server error",
            error: error.message,
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

        const result = await checkMonitor(monitor);

        res.json({
            monitor: monitor.name,
            result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
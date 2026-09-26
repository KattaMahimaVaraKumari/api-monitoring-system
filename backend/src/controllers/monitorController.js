import Monitor from "../models/Monitor.js";

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
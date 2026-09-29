import Incident from "../models/Incident.js";
import Monitor from "../models/Monitor.js";

export const getIncidents = async (req, res) => {
    try {
        const monitors = await Monitor.find({
            userId: req.user._id,
        }).select("_id");

        const monitorIds = monitors.map((monitor) => monitor._id);

        const incidents = await Incident.find({
            monitorId: { $in: monitorIds },
        })
            .populate("monitorId", "name url")
            .sort({ startedAt: -1 });

        res.json({
            incidents,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


export const getIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id).populate(
            "monitorId",
            "name url userId"
        );

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found",
            });
        }

        if (incident.monitorId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        res.json({ incident, });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
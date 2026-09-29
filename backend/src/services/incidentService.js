import Incident from "../models/Incident.js";
import Monitor from "../models/Monitor.js";

export const createIncidentIfNeeded = async (monitorId, reason) => {
    const existingIncident = await Incident.findOne({
        monitorId,
        status: "open",
    });

    if (existingIncident) {
        return existingIncident;
    }

    return await Incident.create({
        monitorId,
        reason,
    });
};


export const resolveIncident = async (monitorId) => {
    const incident = await Incident.findOne({
        monitorId,
        status: "open",
    });

    if (!incident) {
        return null;
    }

    const resolvedAt = new Date();

    const duration = Math.floor(
        (resolvedAt.getTime() - incident.startedAt.getTime()) / 1000
    );

    incident.resolvedAt = resolvedAt;
    incident.duration = duration;
    incident.status = "resolved";

    await incident.save();

    return incident;
};

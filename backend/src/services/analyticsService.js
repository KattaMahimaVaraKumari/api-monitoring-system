import ApiEvent from "../models/ApiEvent.js";

const getMonitorMetrics = async (monitorId) => {
    const events = await ApiEvent.find({ monitorId, });

    const totalChecks = events.length;

    if (totalChecks === 0) {
        return {
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            uptime: 0,
            errorRate: 0,
            averageLatency: 0,
        };
    }

    const successfulChecks = events.filter((event) => event.success).length;

    const failedChecks = totalChecks - successfulChecks;

    const totalResponseTime = events.reduce(
        (sum, event) => sum + event.responseTime
        , 0
    );

    const averageLatency = Math.round(
        totalResponseTime / totalChecks
    );

    const uptime = Number(
        ((successfulChecks / totalChecks) * 100).toFixed(2)
    );

    const errorRate = Number(
        ((failedChecks / totalChecks) * 100).toFixed(2)
    );

    return {
        totalChecks,
        successfulChecks,
        failedChecks,
        uptime,
        errorRate,
        averageLatency
    };
};

export default getMonitorMetrics;

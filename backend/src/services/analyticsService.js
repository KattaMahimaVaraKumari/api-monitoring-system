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


export const getDashboardMetrics = async (monitorIds) => {
    const events = await ApiEvent.find({ monitorId: { $in: monitorIds }, });
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

    const totalResponseTime = events.reduce((sum, event) => sum + event.responseTime, 0);
    
    const averageLatency = Math.round(totalResponseTime/totalChecks);

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
        averageLatency,
    };
}


export const getMonitorTimeSeries = async(monitorId,hours=24)=>{
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const events = await ApiEvent.find({
        monitorId,
        timestamp: {
            $gte:startTime,
        },
    })
      .sort({timestamp:1})
      .select("timestamp responseTime success statusCode");
    
    return events;
};


export default getMonitorMetrics;
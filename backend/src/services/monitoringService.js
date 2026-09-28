import ApiEvent from "../models/ApiEvent.js"
import Monitor from "../models/Monitor.js"

const checkMonitor = async (monitor) => {
    await Monitor.findByIdAndUpdate(monitor._id,{
        lastCheckedAt: new Date(),
    });
    
    const startTime = Date.now();

    try {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, monitor.timeout * 1000);

        const response = await fetch(monitor.url, {
            method: monitor.method,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseTime = Date.now() - startTime;

        const success = response.status === monitor.expectedStatus;

        const result = {
            success,
            statusCode: response.status,
            responseTime,
            errorMessage: success
                ? null
                : `Unexpected status code: ${response.status}`,
        };

        await ApiEvent.create({
            monitorId: monitor._id,
            ...result,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            status: success ? "healthy" : "down",
        });

        return result;

    } catch (error) {
        const responseTime = Date.now() - startTime;

        const result = {
            success: false,
            statusCode: null,
            responseTime,
            errorMessage:
                error.name === "AbortError"
                    ? "Request timed out"
                    : error.message,
        };

        await ApiEvent.create({
            monitorId: monitor._id,
            ...result,
        });

        await Monitor.findByIdAndUpdate(monitor._id, {
            status: "down",
        })

        return result;
    }
}

export default checkMonitor;
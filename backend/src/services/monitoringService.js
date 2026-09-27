const checkMonitor = async (monitor) => {
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

        return {
            success,
            statusCode: response.status,
            responseTime,
            errorMessage: success ? null : `Unexpected status code: ${response.status}`,
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;

        return {
            success: false,
            statusCode: null,
            responseTime,
            errorMessage:
                error.name === "AbortError"
                    ? "Request timed out"
                    : error.message,
        }
    }
}

export default checkMonitor;
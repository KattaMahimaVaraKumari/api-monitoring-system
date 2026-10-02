export const notFound = (req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack || err.message);

    res.status(err.statusCode || 500).json({
        message: err.statusCode
            ? err.message
            : "Internal server error",
    });
};

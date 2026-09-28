import mongoose from "mongoose";

const apiEventSchema = new mongoose.Schema({
    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monitor",
        required: true,
    },

    statusCode: {
        type: Number,
        default: null,
    },

    responseTime: {
        type: Number,
        required: true,
    },

    success: {
        type: Boolean,
        required: true,
    },

    errorMessage: {
        type: String,
        default: null,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
},
    {
        timestamps: true,
    }
);

const ApiEvent = mongoose.model("ApiEvent",apiEventSchema);

export default ApiEvent;
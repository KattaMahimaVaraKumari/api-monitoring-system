import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    url: {
        type: String,
        required: true,
        trim: true,
    },

    method: {
        type: String,
        enum: ["GET"],
        default: "GET",
    },

    expectedStatus: {
        type: Number,
        default: 200,
    },

    interval: {
        type: Number,
        default: 5,
    },

    timeout: {
        type: Number,
        default: 10,
    },

    lastCheckedAt:{
        type: Date,
        default: null,
    },

    status: {
        type: String,
        enum: ["healthy", "down", "unknown"],
        default: "unknown",
    },

    active: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    }
);

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;
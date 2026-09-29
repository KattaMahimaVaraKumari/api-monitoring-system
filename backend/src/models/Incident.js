import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monitor",
        required: true,
    },

    reason: {
        type: String,
        required: true,
    },

    startedAt: {
        type: Date,
        default: Date.now,
    },

    resolvedAt: {
        type: Date,
        default: null,
    },

    duration: {
        type: Number,
        default: null,
    },

    status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open",
    },
},
    {
        timestamps: true,
    }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
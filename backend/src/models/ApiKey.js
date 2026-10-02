import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            requred: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        keyHash: {
            type: String,
            required: true,
        },

        lastUsed: {
            type: Date,
            default: null,
        },

        revoked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
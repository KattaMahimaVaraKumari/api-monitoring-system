import ApiKey from "../models/ApiKey.js";
import generateApiKey, { hashApiKey } from "../utils/generateApiKey.js";

export const createApiKey = async (userId, name) => {
    const apiKey = generateApiKey();

    const keyHash = hashApiKey(apiKey);

    const savedKey = await ApiKey.create({ userId, name, keyHash, });

    return {
        id: savedKey._id,
        name: savedKey.name,
        apiKey,
        createdAt: savedKey.createdAt,
    };
};

export const getUserApiKeys = async (userId) => {
    return await ApiKey.find({
        userId,
    }).select("-keyHash");
};

export const revokeApiKey = async (userId, keyId) => {
    const apiKey = await ApiKey.findOne({
        _id: keyId,
        userId,
    });

    if(!apiKey){
        return null;
    }

    apiKey.revoked=true;

    await apiKey.save();

    return apiKey;
}

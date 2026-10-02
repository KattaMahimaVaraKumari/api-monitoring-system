import crypto from "crypto";

const generateApiKey = () => {
    return `amk_${crypto.randomBytes(32).toString("hex")}`;
};

export const hashApiKey = (apiKey) => {
    return crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");
};

export default generateApiKey;
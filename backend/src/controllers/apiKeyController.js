import { createApiKey, getUserApiKeys, revokeApiKey } from "../services/apiKeyService.js";

export const createApiKeyController = async(req,res)=>{
    try{
        const {name} = req.body;

        if(!name || name.trim().length<2){
            return res.status(400).json({message: "API key name must be at least 2 characters long,"});
        }

        const result = await createApiKey(
            req.user._id,
            name.trim()
        );

        res.status(201).json({
            message: "API key created successfully",
            apiKey: result,
        });
    } catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        })
    }
}


export const getApiKeys = async(req,res)=>{
    try{
        const apiKeys = await getUserApiKeys(req.user._id);

        res.json({
            apiKeys,
        });
    } catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


export const revokeApiKeyController = async (req,res)=>{
    try{
        const apiKey = await revokeApiKey(
            req.user._id,
            req.params.id
        );

        if(!apiKey){
            return res.status(404).json({
                message: "API key not found",
            });
        }

        res.json({
            message: "API key revoked successfully",
        });
    } catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


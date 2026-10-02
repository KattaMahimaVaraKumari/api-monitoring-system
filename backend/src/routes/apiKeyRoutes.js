import express from "express";

import { createApiKeyController, getApiKeys, revokeApiKeyController } from "../controllers/apiKeyController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createApiKeyController);
router.get("/", protect, getApiKeys);
router.delete("/:id", protect, revokeApiKeyController);

export default router;
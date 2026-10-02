import express from "express";

import { createApiKeyController, getApiKeys, revokeApiKeyController } from "../controllers/apiKeyController.js";

import {protect} from "../middleware/authMiddleware.js";

import { validate } from "../middleware/validationMiddleware.js";
import { createApiKeySchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/", protect, validate(createApiKeySchema),createApiKeyController);
router.get("/", protect, getApiKeys);
router.delete("/:id", protect, revokeApiKeyController);

export default router;
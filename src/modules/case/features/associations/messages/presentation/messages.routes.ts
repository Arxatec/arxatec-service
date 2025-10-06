// src/modules/case/features/messages/presentation/messages.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { getHistory, send } from "./messages.controller";

export const router = Router();

router.post("/:id", authenticateToken, send);
router.get("/:id/history", authenticateToken, getHistory);

// src/modules/calendar/features/events/update_all/presentation/update_all.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { updateAll } from "./update_all.controller";

export const router = Router();
router.put("/:id", authenticateToken, updateAll);

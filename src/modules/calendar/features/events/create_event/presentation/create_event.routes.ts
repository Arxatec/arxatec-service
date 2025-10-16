// src/modules/calendar/features/events/create_event/presentation/create_event.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { create } from "./create_event.controller";

export const router = Router();
router.post("/", authenticateToken, create);

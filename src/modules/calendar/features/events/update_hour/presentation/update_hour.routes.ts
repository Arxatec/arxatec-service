//src/modules/calendar/features/events/update_hour/presentation/update_hour.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { updateTime } from "./update_hour.controller";

export const router = Router();

router.patch("/:id/time", authenticateToken, updateTime);

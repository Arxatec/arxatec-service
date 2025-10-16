//src/modules/calendar/features/events/delete/presentation/delete_event.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { remove } from "./delete_event.controller";

export const router = Router();

router.delete("/:id", authenticateToken, remove);

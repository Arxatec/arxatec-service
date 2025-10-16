//src/modules/calendar/features/events/get_list/presentation/get_list.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { list } from "./get_list.controller";

export const router = Router();
router.get("/", authenticateToken, list);

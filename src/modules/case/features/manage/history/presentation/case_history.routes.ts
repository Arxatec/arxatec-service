// src/modules/cases/features/manage/history/presentation/case_history.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { getHistory } from "./case_history.controller";

export const router = Router();
router.get("/:id", authenticateToken, getHistory);

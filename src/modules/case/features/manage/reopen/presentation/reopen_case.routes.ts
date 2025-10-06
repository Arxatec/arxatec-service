// src/modules/cases/features/manage/reopen_case/presentation/reopen_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { reopen } from "./reopen_case.controller";

export const router = Router();
router.patch("/:id", authenticateToken, reopen);

// src/modules/cases/features/manage/update_case/presentation/update_case.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { patch } from "./update_case.controller";

export const router = Router();
router.patch("/:id", authenticateToken, patch);

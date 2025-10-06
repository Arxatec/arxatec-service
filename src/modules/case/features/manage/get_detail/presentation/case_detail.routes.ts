// src/modules/cases/features/manage/case_detail/presentation/case_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { getCaseDetail } from "./case_detail.controller";

export const router = Router();
router.get("/:id", authenticateToken, getCaseDetail);

// src/modules/cases/features/manage/case_detail/presentation/case_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CaseDetailController } from "./case_detail.controller";

const router = Router();
const controller = new CaseDetailController();

router.get("/:id", authenticateToken, asyncHandler(controller.get));

export { router as caseDetailRoutes };

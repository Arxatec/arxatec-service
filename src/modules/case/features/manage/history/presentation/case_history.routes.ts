// src/modules/cases/features/manage/history/presentation/case_history.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { GetCaseHistoryController } from "./case_history.controller";

const router = Router();
const controller = new GetCaseHistoryController();

router.get(
  "/:id",
  authenticateToken,
  asyncHandler(controller.getHistory)
);

export { router as caseHistoryRoutes };

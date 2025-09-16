// src/modules/cases/features/manage/reopen/presentation/reopen_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ReopenCaseController } from "./reopen_case.controller";

const router = Router();
const controller = new ReopenCaseController();

router.patch("/:id", authenticateToken, asyncHandler(controller.reopen));

export { router as reopenCaseRoutes };

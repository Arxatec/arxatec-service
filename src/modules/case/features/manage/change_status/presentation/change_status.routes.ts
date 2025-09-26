// src/modules/cases/features/manage/change_status/presentation/change_status.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ChangeStatusController } from "./change_status.controller";

const router = Router();
const ctrl = new ChangeStatusController();

router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as changeStatusRoutes };

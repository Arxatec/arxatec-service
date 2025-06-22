import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { GetCaseHistoryController } from "../controllers/case_history.controller";

const router = Router();
const controller = new GetCaseHistoryController();

router.get("/:id/history", authenticateToken, asyncHandler(controller.getHistory));

export { router as CaseHistoryRoutes };

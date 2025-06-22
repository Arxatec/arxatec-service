import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ReopenCaseController } from "../controllers/reopen_case.controller";

const controller = new ReopenCaseController();
const router = Router();

router.patch("/cases/:id/reopen", authenticateToken, asyncHandler(controller.reopen));

export { router as reopenCaseRoutes };
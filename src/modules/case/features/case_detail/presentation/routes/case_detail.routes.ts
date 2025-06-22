import { Router } from "express";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CaseDetailController } from "../controllers/case_detail.controller";

const router = Router();
const controller = new CaseDetailController();

router.get("/:id/detail", authenticateToken, asyncHandler(controller.get));

export { router as caseDetailRoutes };

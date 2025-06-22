import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { UpdateCaseController } from "../controllers/update_case.controller";

const router = Router();
const ctrl = new UpdateCaseController();

router.patch("/:id", authenticateToken, asyncHandler(ctrl.patch));

export { router as updateCaseRoutes };

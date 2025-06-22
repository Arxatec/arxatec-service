import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ArchiveCaseController } from "../controllers/archive_case.controller";

const controller = new ArchiveCaseController();
const router = Router();

router.patch("/:id/archive", authenticateToken, asyncHandler(controller.archive));

export { router as archiveCaseRoutes };
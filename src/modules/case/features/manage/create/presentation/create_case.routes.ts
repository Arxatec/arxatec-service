// src/modules/cases/features/create_case/presentation/routes/create_case.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { CreateCaseController } from "./create_case.controller";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";

const router = Router();
const controller = new CreateCaseController();

router.post("/", authenticateToken, asyncHandler(controller.handle.bind(controller)));

export { router as createCaseRoutes };

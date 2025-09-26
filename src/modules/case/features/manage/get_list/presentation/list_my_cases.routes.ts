// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { ListMyCasesController } from "./list_my_cases.controller";

const router = Router();
const ctrl = new ListMyCasesController();

router.get("/", authenticateToken, asyncHandler(ctrl.handle.bind(ctrl)));

export { router as listMyCasesRoutes };

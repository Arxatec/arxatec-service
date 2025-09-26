// src/modules/case/features/explore_cases/presentation/explore_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { ExploreCasesController } from "./explore_cases.controller";

const router = Router();
const ctrl = new ExploreCasesController();

router.get("/", asyncHandler(ctrl.explore));
router.get("/", asyncHandler(ctrl.categories));
router.get("/", asyncHandler(ctrl.statuses));

export { router as exploreCasesRoutes };

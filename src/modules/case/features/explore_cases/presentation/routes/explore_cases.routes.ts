// src/modules/case/features/explore_cases/presentation/routes/explore_cases.routes.ts
import { Router } from "express";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ExploreCasesController } from "../controller/explore_cases.controller";

const router = Router();
const ctrl = new ExploreCasesController();

/* ---------- PUBLIC ENDPOINTS ---------- */
router.get("/explore",   asyncHandler(ctrl.explore.bind(ctrl)));
router.get("/categories",asyncHandler(ctrl.categories));
router.get("/statuses",  asyncHandler(ctrl.statuses));

export { router as exploreCasesRoutes };



// src/modules/case/features/explore/index.ts
import { Router } from "express";
import { ExploreCasesController } from "./presentation/explore_cases.controller";

const router = Router();
const ctrl = new ExploreCasesController();

router.get("/explore", ctrl.explore);
router.get("/categories", ctrl.categories);
router.get("/statuses", ctrl.statuses);

export { router as exploreCasesRoutes };

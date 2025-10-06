// src/modules/case/features/explore/index.ts
import { Router } from "express";
import { router as exploreCasesRouter } from "./presentation/explore_cases.routes";

const router = Router();

router.use("/explore", exploreCasesRouter);

export { router as exploreCasesRoutes };

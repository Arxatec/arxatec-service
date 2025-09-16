// src/modules/case/index.ts
import { Router } from "express";
import { exploreCasesRoutes } from "./features/explore";
import { manageRouter } from "./features/manage";
import { associationsRouter } from "./features/associations";

const router = Router();

router.use("/", exploreCasesRoutes);
router.use("/", manageRouter);
router.use("/", associationsRouter);

export { router as caseRouter };

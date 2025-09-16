// src/modules/case/features/manage/index.ts
import { Router } from "express";

import { archiveCaseRoutes } from "./archive";
import { changeStatusRoutes } from "./change_status";
import { createCaseRoutes } from "./create";
import { caseDetailRoutes } from "./get_detail";
import { listMyCasesRoutes } from "./get_list";
import { caseHistoryRoutes } from "./history";
import { reopenCaseRoutes } from "./reopen";
import { updateCaseRoutes } from "./update";

export const router = Router();

router.use("/archive", archiveCaseRoutes);
router.use("/status", changeStatusRoutes);
router.use("/create", createCaseRoutes);
router.use("/detail", caseDetailRoutes);
router.use("/me", listMyCasesRoutes);
router.use("/history", caseHistoryRoutes);
router.use("/reopen", reopenCaseRoutes);
router.use("/update", updateCaseRoutes);

export { router as manageRouter };

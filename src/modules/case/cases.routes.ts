import { Router } from "express";

import { archiveCaseRoutes } from "./features/archive_case";
import { attachmentRoutes } from "./features/attachments";
import { caseDetailRoutes } from "./features/case_detail";
import { changeStatusRoutes } from "./features/change_status";
import { createCaseRoutes } from "./features/create_case";
import { exploreCasesRoutes } from "./features/explore_cases";
import { externalClientsRoutes } from "./features/external_clients";
import { listMyCasesRoutes } from "./features/list_my_cases";
import { messageRoutes } from "./features/messages";
import { reopenCaseRoutes } from "./features/reopen_case";
import { updateCaseRoutes } from "./features/update_case";
import { CaseHistoryRoutes } from "./features/case_history";

export const casesRouter = Router();

casesRouter.use("/", exploreCasesRoutes);
casesRouter.use("/external_clients", externalClientsRoutes);
casesRouter.use("/", listMyCasesRoutes);
casesRouter.use("/", createCaseRoutes);
casesRouter.use("/", caseDetailRoutes);
casesRouter.use("/", updateCaseRoutes);
casesRouter.use("/", changeStatusRoutes);
casesRouter.use("/", archiveCaseRoutes);
casesRouter.use("/", reopenCaseRoutes);
casesRouter.use("/", attachmentRoutes);
casesRouter.use("/", messageRoutes);
casesRouter.use("/", CaseHistoryRoutes);

export default casesRouter;

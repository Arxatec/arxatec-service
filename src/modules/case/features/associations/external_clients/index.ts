// src/modules/case/features/associations/external_clients/index.ts
import { Router } from "express";

import { router as createRoute } from "./create/presentation/create.routes";
import { router as updateRoute } from "./update/presentation/update.routes";
import { router as archiveRoute } from "./archive/presentation/archive.routes";
import { router as restoreRoute } from "./restore/presentation/restore.routes";
import { router as getListRoute } from "./get_list/presentation/get_list.routes";
import { router as getArchivedRoute } from "./get_archived/presentation/get_archived.routes";
import { router as getDetailRoute } from "./get_detail/presentation/get_detail.routes";

const router = Router();

router.use("/create", createRoute);
router.use("/update", updateRoute);
router.use("/archive", archiveRoute);
router.use("/restore", restoreRoute);
router.use("/list", getListRoute);
router.use("/archived", getArchivedRoute);
router.use("/detail", getDetailRoute);

export { router as externalClientsRoutes };

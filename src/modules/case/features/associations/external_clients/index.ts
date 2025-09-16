// src/modules/case/features/associations/external_clients/index.ts
import { Router } from "express";
import createRoute from "./create/presentation/create.routes";
import updateRoute from "./update/presentation/update.routes";
import archiveRoute from "./archive/presentation/archive.routes";
import restoreRoute from "./restore/presentation/restore.routes";
import getListRoute from "./get_list/presentation/get_list.routes";
import getArchivedRoute from "./get_archived/presentation/get_archived.routes";
import getDetailRoute from "./get_detail/presentation/get_detail.routes";

const router = Router();
router.use("/create", createRoute);
router.use("/update", updateRoute);
router.use("/archive", archiveRoute);
router.use("/restore", restoreRoute);
router.use("/list", getListRoute);
router.use("/archive", getArchivedRoute);
router.use("/detail", getDetailRoute);

export { router as externalClientsRoutes };

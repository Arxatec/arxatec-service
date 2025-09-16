// src/modules/cases/features/associations/attachments/index.ts
import { Router } from "express";
import { createAttachmentRoutes } from "./create/presentation/create.routes";
import { listAttachmentRoutes } from "./list/presentation/list.routes";
import { archiveAttachmentRoutes } from "./archive/presentation/archive.routes";

const router = Router();

router.use("/create", createAttachmentRoutes);
router.use("/list", listAttachmentRoutes);
router.use("/archive", archiveAttachmentRoutes);

export { router as attachmentsRoutes };

// src/modules/cases/features/associations/attachments/index.ts
import { Router } from "express";
import { router as createAttachmentRoutes } from "./create/presentation/create.routes";
import { router as listAttachmentRoutes } from "./list/presentation/list.routes";
import { router as archiveAttachmentRoutes } from "./archive/presentation/archive.routes";

const router = Router();

router.use("/create", createAttachmentRoutes);
router.use("/list", listAttachmentRoutes);
router.use("/archive", archiveAttachmentRoutes);

export { router as attachmentsRoutes };

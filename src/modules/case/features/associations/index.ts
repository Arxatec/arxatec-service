// src/modules/case/feature/associations/index.ts
import { Router } from "express";
import { externalClientsRoutes } from "./external_clients";
import { attachmentsRoutes } from "./attachments";
import { messagesRoutes } from "./messages"; 

const router = Router();

router.use("/attachments", attachmentsRoutes);
router.use("/external-clients", externalClientsRoutes);
router.use("/messages", messagesRoutes);

export { router as associationsRouter };

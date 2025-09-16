//src/modules/case/feature/associations
import { Router } from "express";
import { externalClientsRoutes } from "./external_clients";
import { attachmentsRoutes } from "./attachments";

const router = Router();

router.use("/attachments", attachmentsRoutes);

router.use("/external-clients", externalClientsRoutes);

export { router as associationsRouter };

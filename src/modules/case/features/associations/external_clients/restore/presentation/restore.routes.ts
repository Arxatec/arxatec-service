// src/modules/case/features/associations/external_clients/restore/presentation/restore.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { RestoreExternalClientController } from "./restore.controller";

const router = Router();
const ctrl = new RestoreExternalClientController();

router.patch(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => ctrl.restoreExternalClient(req, res))
);

export default router;

// src/modules/case/features/associations/external_clients/archive/presentation/archive.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { ArchiveExternalClientController } from "./archive.controller";

const router = Router();
const ctrl = new ArchiveExternalClientController();

router.patch(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => ctrl.archive(req, res))
);

export default router;

// src/modules/case/features/associations/external_clients/get_archived/presentation/get_archived.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { GetArchivedExternalClientsController } from "./get_archived.controller";

const router = Router();
const ctrl = new GetArchivedExternalClientsController();

router.get(
  "/",
  authenticateToken,
  asyncHandler((req, res) => ctrl.getArchived(req, res))
);

export default router;

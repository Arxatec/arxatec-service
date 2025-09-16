// src/modules/case/features/associations/external_clients/get_list/presentation/get_list.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { GetExternalClientsController } from "./get_list.controller";

const router = Router();
const ctrl = new GetExternalClientsController();

router.get(
  "/",
  authenticateToken,
  asyncHandler((req, res) => ctrl.getList(req, res))
);

export default router;

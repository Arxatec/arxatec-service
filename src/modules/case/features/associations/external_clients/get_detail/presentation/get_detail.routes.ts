// src/modules/case/features/associations/external_clients/get_detail/presentation/get_detail.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../../middlewares/async_handler";
import { GetExternalClientDetailController } from "./get_detail.controller";

const router = Router();
const ctrl = new GetExternalClientDetailController();

router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => ctrl.getDetail(req, res))
);

export default router;

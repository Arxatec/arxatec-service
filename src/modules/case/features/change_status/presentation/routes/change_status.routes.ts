import { Router } from "express";

import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ChangeStatusController } from "../controller/change_status.controller";

const router = Router();
const ctrl   = new ChangeStatusController();

router.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler(ctrl.patch),
);

export { router as changeStatusRoutes };

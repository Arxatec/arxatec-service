// src/modules/dashboard/client/presentation/routes/dashboardClient.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { DashboardClientController } from "../controllers/dashboardClient.controller";

const router = Router();
const ctrl = new DashboardClientController();

/* ───────────── DASHBOARD SUMMARY ───────────── */
router.get(
  "/client/summary",
  authenticateToken,
  asyncHandler(ctrl.getSummary),
);

export default router;

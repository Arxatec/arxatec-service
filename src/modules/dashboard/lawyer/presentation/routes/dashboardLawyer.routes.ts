import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { DashboardLawyerController } from "../controllers/dashboardLawyer.controller";

const router = Router();
const ctrl = new DashboardLawyerController();

/* ───────────── DASHBOARD SUMMARY ───────────── */
router.get(
  "/lawyer/summary",
  authenticateToken,
  asyncHandler(ctrl.getSummary),
);

export default router;

// src/modules/dashboard/lawyer/presentation/routes/dashboardLawyer.routes.ts

import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { DashboardLawyerController } from "../controllers/dashboardLawyer.controller";

const dashboardLawyerController = new DashboardLawyerController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: DashboardLawyer
 *   description: Dashboard operations for lawyers
 *
 * /dashboard/lawyer/summary:
 *   get:
 *     summary: Get KPIs, recent cases and external client count
 *     tags: [DashboardLawyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_cases:
 *                   type: integer
 *                 taken_cases:
 *                   type: integer
 *                 closed_cases:
 *                   type: integer
 *                 archived_cases:
 *                   type: integer
 *                 active_cases:
 *                   type: integer
 *                 recent_cases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 *                 external_clients:
 *                   type: integer
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 *
 * /dashboard/lawyer/recent:
 *   get:
 *     summary: Get paginated list of recent cases
 *     tags: [DashboardLawyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Recent cases fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /dashboard/lawyer/activity:
 *   get:
 *     summary: Get paginated activity (case histories and messages)
 *     tags: [DashboardLawyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Activity fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 histories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CaseHistory'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /dashboard/lawyer/cases-per-month:
 *   get:
 *     summary: Get case count per month for the last N months
 *     tags: [DashboardLawyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of months to include
 *     responses:
 *       200:
 *         description: Cases per month fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-05"
 *                   count:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/* ──────────────── DASHBOARD SUMMARY ──────────────── */
router.get(
  "/lawyer/summary",
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardLawyerController.getSummary(req, res)
  )
);

/* ──────────────── RECENT CASES ──────────────── */
router.get(
  "/lawyer/recent",
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardLawyerController.getRecent(req, res)
  )
);

/* ──────────────── ACTIVITY (HISTORIES & MESSAGES) ──────────────── */
router.get(
  "/lawyer/activity",
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardLawyerController.getActivity(req, res)
  )
);

/* ──────────────── CASES PER MONTH ──────────────── */
router.get(
  "/lawyer/cases-per-month",
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardLawyerController.getCasesPerMonth(req, res)
  )
);

export default router;

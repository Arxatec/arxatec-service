// src/modules/dashboard/client/presentation/routes/dashboardClient.routes.ts

import { Router } from 'express'
import { authenticateToken } from '../../../../../middlewares/authenticate_token'
import { asyncHandler } from '../../../../../middlewares/async_handler'
import { DashboardClientController } from '../controllers/dashboardClient.controller'

const dashboardClientController = new DashboardClientController()
const router = Router()

/**
 * @swagger
 * tags:
 *   name: DashboardClient
 *   description: Dashboard operations for clients
 *
 * /dashboard/client/summary:
 *   get:
 *     summary: Get KPIs and recent cases
 *     tags: [DashboardClient]
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
 *                 active_cases:
 *                   type: integer
 *                 closed_cases:
 *                   type: integer
 *                 archived_cases:
 *                   type: integer
 *                 recent_cases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 *
 * /dashboard/client/recent:
 *   get:
 *     summary: Get paginated list of recent cases
 *     tags: [DashboardClient]
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
 * /dashboard/client/activity:
 *   get:
 *     summary: Get paginated activity (case histories and messages)
 *     tags: [DashboardClient]
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
 * /dashboard/client/cases-per-month:
 *   get:
 *     summary: Get case count per month for the last N months
 *     tags: [DashboardClient]
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

/* ───────────── SUMMARY ───────────── */
router.get(
  '/client/summary',
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardClientController.getSummary(req, res)
  )
)

/* ───────────── RECENT CASES ───────────── */
router.get(
  '/client/recent',
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardClientController.getRecent(req, res)
  )
)

/* ───────────── ACTIVITY ───────────── */
router.get(
  '/client/activity',
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardClientController.getActivity(req, res)
  )
)

/* ───────────── CASES PER MONTH ───────────── */
router.get(
  '/client/cases-per-month',
  authenticateToken,
  asyncHandler((req, res) =>
    dashboardClientController.getCasesPerMonth(req, res)
  )
)

export default router

import { Router } from "express";
import { LawyerController } from "../controllers/lawyer.controller";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const lawyerController = new LawyerController();

/**
 * @openapi
 * /api/v1/lawyers:
 *   get:
 *     tags:
 *       - Lawyer
 *     summary: "Get all lawyers"
 *     description: "Returns basic information for all registered lawyers."
 *     responses:
 *       '200':
 *         description: "List of lawyers."
 *
 * /api/v1/lawyers/{id}:
 *   get:
 *     tags:
 *       - Lawyer
 *     summary: "Get lawyer by ID"
 *     description: "Returns lawyer information by the provided ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: "Lawyer ID"
 *     responses:
 *       '200':
 *         description: "Lawyer information."
 *       '404':
 *         description: "Lawyer not found."
 *
 * /api/v1/lawyers/profile:
 *   get:
 *     tags:
 *       - Lawyer
 *     summary: "Get logged-in lawyer profile"
 *     description: "Returns lawyer information from the authentication token."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Lawyer profile."
 *       '401':
 *         description: "Not authenticated."
 *   patch:
 *     tags:
 *       - Lawyer
 *     summary: "Update logged-in lawyer profile"
 *     description: "Allows updating lawyer information using the authentication token."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               license_number:
 *                 type: string
 *                 example: "XYZ-1234"
 *               specialty:
 *                 type: string
 *                 example: "Criminal Law"
 *               experience:
 *                 type: number
 *                 example: 8
 *               biography:
 *                 type: string
 *                 example: "Experienced criminal lawyer."
 *               linkedin:
 *                 type: string
 *                 example: "https://linkedin.com/in/lawyer"
 *     responses:
 *       '200':
 *         description: "Lawyer profile updated successfully."
 *       '400':
 *         description: "Invalid data or request error."
 *       '401':
 *         description: "Not authenticated."
 *       '403':
 *         description: "Access denied: not a lawyer."
 *
 * /api/v1/lawyers/register:
 *   post:
 *     tags:
 *       - Lawyer
 *     summary: "Register a user as lawyer"
 *     description: "Converts the user to a lawyer and creates lawyer details, service, fees, and work schedules."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 123
 *               license_number:
 *                 type: string
 *                 example: "XYZ-1234"
 *               gender:
 *                 type: string
 *                 example: "female"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               specialty:
 *                 type: string
 *                 example: "Criminal Law"
 *               experience:
 *                 type: number
 *                 example: 8
 *               biography:
 *                 type: string
 *                 example: "Experienced criminal lawyer."
 *               linkedin:
 *                 type: string
 *                 example: "https://linkedin.com/in/lawyer"
 *               preferred_client:
 *                 type: string
 *                 example: "High profile clients"
 *               payment_methods:
 *                 type: string
 *                 example: "Credit Card, PayPal"
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               attorneyFees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service_category_id:
 *                       type: number
 *                       example: 2
 *                     fee:
 *                       type: number
 *                       example: 150.0
 *               workSchedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       example: "lunes"
 *                     open_time:
 *                       type: string
 *                       example: "09:00"
 *                     close_time:
 *                       type: string
 *                       example: "17:00"
 *     responses:
 *       '201':
 *         description: "User successfully registered as lawyer."
 *       '400':
 *         description: "Invalid data or request error."
 */

router.get("/profile", authenticateToken, asyncHandler((req, res) => lawyerController.getLawyerProfile(req, res)));
router.patch("/profile", authenticateToken, asyncHandler((req, res) => lawyerController.updateLawyerProfile(req, res)));
router.get("/", asyncHandler((req, res) => lawyerController.getAllLawyers(req, res)));
router.get("/:id", asyncHandler((req, res) => lawyerController.getLawyerById(req, res)));
router.post("/register", asyncHandler((req, res) => lawyerController.registerLawyer(req, res)));

export default router;

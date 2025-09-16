// src/modules/user/features/edit_profile/presentation/edit_profile.routes.ts
import { Router } from "express";
import { authenticateToken } from "../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../middlewares/async_handler";
import { EditProfileController } from "./edit_profile.controller";

const router = Router();
const ctrl = new EditProfileController();

/**
 * Edit user profile
 * @openapi
 * /user/get-profile:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     summary: "Edit user profile"
 *     description: "Permite al usuario autenticado actualizar su perfil (nombre, apellido, teléfono, fecha de nacimiento, género, contraseña)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Pérez"
 *               phone:
 *                 type: string
 *                 minLength: 9
 *                 maxLength: 20
 *                 example: "+51 987654321"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *               gender:
 *                 type: string
 *                 enum: [male, female, unspecified]
 *                 example: "male"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "nuevaPassword123"
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "nuevaPassword123"
 *     responses:
 *       '200':
 *         description: "Perfil actualizado correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OK"
 *                 description:
 *                   type: string
 *                   example: "Perfil actualizado"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-09-15T19:30:00.000Z"
 *                 path:
 *                   type: string
 *                   example: "/api/v1/user/profile"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "84ea6d2a-d171-48d0-af0f-74c8a5b2eb29"
 *                     firstName:
 *                       type: string
 *                       example: "Juan"
 *                     lastName:
 *                       type: string
 *                       example: "Pérez"
 *                     phone:
 *                       type: string
 *                       example: "+51 987654321"
 *                     birthDate:
 *                       type: string
 *                       example: "1995-06-15"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *       '400':
 *         description: "Errores de validación"
 *       '401':
 *         description: "Unauthorized (token inválido o no enviado)"
 *       '500':
 *         description: "Error interno del servidor"
 */

router.put("/", authenticateToken, asyncHandler(ctrl.handle.bind(ctrl)));

export { router as editProfileRoutes };

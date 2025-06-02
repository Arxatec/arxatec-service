import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/authenticate_token";

const router = Router();
const userController = new UserController();

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: "Obtener perfil del usuario"
 *     description: >
 *       Obtiene el perfil del usuario autenticado.
 *       El ID del usuario se obtiene del token de autenticación (Authorization: Bearer <token>).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Perfil obtenido exitosamente"
 *       '401':
 *         description: "No autorizado"
 *       '404':
 *         description: "Usuario no encontrado"
 */
router.get(
  "/profile",
  authenticateToken,
  asyncHandler((req, res) => userController.getProfile(req, res))
);

export default router;

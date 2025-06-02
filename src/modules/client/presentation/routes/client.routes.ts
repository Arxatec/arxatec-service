import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";
import multer from "multer";

const router = Router();
const clientController = new ClientController();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /api/v1/clients:
 *   get:
 *     tags:
 *       - Client
 *     summary: "Obtener todos los clientes"
 *     description: "Retorna la información básica de todos los clientes registrados."
 *     responses:
 *       '200':
 *         description: "Lista de clientes."
 *
 * /api/v1/clients/{id}:
 *   get:
 *     tags:
 *       - Client
 *     summary: "Obtener la información de un cliente por ID"
 *     description: "Retorna la información de un cliente según el ID proporcionado."
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: "ID del cliente"
 *     responses:
 *       '200':
 *         description: "Información del cliente."
 *       '404':
 *         description: "Cliente no encontrado."
 *
 * /api/v1/clients/profile:
 *   get:
 *     tags:
 *       - Client
 *     summary: "Obtener la información del cliente logueado"
 *     description: "Retorna la información del cliente, obtenida mediante el token."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Perfil del cliente."
 *       '401':
 *         description: "No autenticado."
 *   patch:
 *     tags:
 *       - Client
 *     summary: "Actualizar la información del cliente logueado"
 *     description: "Permite actualizar la información del cliente a través del token."
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 example: "/src/assets/images/avatar_default.png"
 *               location:
 *                 type: string
 *                 example: "Cda. Miguel Negrete 24, Zona Centro, Venustiano Carranza, 15100 Ciudad de México, CDMX, México"
 *               occupation:
 *                 type: string
 *                 example: "Abogado"
 *               age_range:
 *                 type: string
 *                 example: "18-25 años"
 *               gender:
 *                 type: string
 *                 enum: ["male", "female"]
 *                 example: "male"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-06"
 *               budget:
 *                 type: number
 *                 example: 1012.00
 *               urgency_level:
 *                 type: string
 *                 example: "No urgente"
 *               communication_preference:
 *                 type: string
 *                 example: "Videollamada"
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 214
 *                   longitude:
 *                     type: number
 *                     example: 23
 *     responses:
 *       '200':
 *         description: "Perfil de cliente actualizado correctamente."
 *       '400':
 *         description: "Datos inválidos o error en la solicitud."
 *       '401':
 *         description: "No autenticado."
 *       '403':
 *         description: "Acceso denegado: no es cliente."
 *
 * /api/v1/clients/register:
 *   post:
 *     tags:
 *       - Client
 *     summary: "Registrar un usuario como cliente"
 *     description: "Actualiza el rol del usuario a 'client' y agrega sus datos de cliente."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 456
 *               profile_picture:
 *                 type: string
 *                 example: "/src/assets/images/avatar_default.png"
 *               location:
 *                 type: string
 *                 example: "Cda. Miguel Negrete 24, Zona Centro, Venustiano Carranza, 15100 Ciudad de México, CDMX, México"
 *               occupation:
 *                 type: string
 *                 example: "Abogado"
 *               age_range:
 *                 type: string
 *                 example: "18-25 años"
 *               gender:
 *                 type: string
 *                 enum: ["male", "female"]
 *                 example: "male"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-06"
 *               budget:
 *                 type: number
 *                 example: 1012.00
 *               urgency_level:
 *                 type: string
 *                 example: "No urgente"
 *               communication_preference:
 *                 type: string
 *                 example: "Videollamada"
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 214
 *                   longitude:
 *                     type: number
 *                     example: 23
 *     responses:
 *       '201':
 *         description: "Usuario convertido en cliente correctamente."
 *       '400':
 *         description: "Error en la solicitud o datos inválidos."
 */

router.get(
  "/profile",
  authenticateToken,
  asyncHandler((req, res) => clientController.getClientProfile(req, res))
);
router.patch(
  "/profile",
  authenticateToken,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  asyncHandler((req, res) => clientController.updateClientProfile(req, res))
);
router.get(
  "/",
  asyncHandler((req, res) => clientController.getAllClients(req, res))
);
router.get(
  "/:id",
  asyncHandler((req, res) => clientController.getClientById(req, res))
);
router.post(
  "/register",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  asyncHandler((req, res) => clientController.registerClient(req, res))
);

export default router;

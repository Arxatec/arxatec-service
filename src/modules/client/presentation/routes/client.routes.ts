import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const clientController = new ClientController();

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
 *               first_name:
 *                 type: string
 *                 example: "Ana"
 *               last_name:
 *                 type: string
 *                 example: "Gómez"
 *               budget_range:
 *                 type: string
 *                 example: "$1000 - $5000"
 *               urgency_level:
 *                 type: string
 *                 example: "alta"
 *               requirement_type:
 *                 type: string
 *                 example: "consulta legal"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-15"
 *               gender:
 *                 type: string
 *                 example: "femenino"
 *               communication_channel:
 *                 type: string
 *                 example: "email"
 *               receive_notifications:
 *                 type: boolean
 *                 example: true
 *               notification_channels:
 *                 type: string
 *                 example: "email,sms"
 *               country:
 *                 type: string
 *                 example: "México"
 *               state:
 *                 type: string
 *                 example: "CDMX"
 *               city:
 *                 type: string
 *                 example: "Ciudad de México"
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *               full_address:
 *                 type: string
 *                 example: "Av. Reforma 100, Cuauhtémoc"
 *               postal_code:
 *                 type: string
 *                 example: "12345"
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
 *     description: "Actualiza el rol del usuario a 'client' y agrega sus datos de cliente, preferencias y localización. Recibe id, budget_range, urgency_level, requirement_type, profile_image, birth_date, gender, communication_channel, receive_notifications, notification_channels y ubicación (country, state, city, latitude, longitude, full_address, postal_code) en el body."
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
 *               budget_range:
 *                 type: string
 *                 example: "$1000 - $5000"
 *               urgency_level:
 *                 type: string
 *                 example: "alta"
 *               requirement_type:
 *                 type: string
 *                 example: "consulta legal"
 *               profile_image:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1985-05-15"
 *               gender:
 *                 type: string
 *                 example: "femenino"
 *               communication_channel:
 *                 type: string
 *                 example: "email"
 *               receive_notifications:
 *                 type: boolean
 *                 example: true
 *               notification_channels:
 *                 type: string
 *                 example: "email,sms"
 *               country:
 *                 type: string
 *                 example: "México"
 *               state:
 *                 type: string
 *                 example: "CDMX"
 *               city:
 *                 type: string
 *                 example: "Ciudad de México"
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *               full_address:
 *                 type: string
 *                 example: "Av. Reforma 100, Cuauhtémoc"
 *               postal_code:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       '201':
 *         description: "Usuario convertido en cliente correctamente."
 *       '400':
 *         description: "Error en la solicitud o datos inválidos."
 */

router.get("/profile", authenticateToken, asyncHandler((req, res) =>
  clientController.getClientProfile(req, res)
));
router.patch("/profile", authenticateToken, asyncHandler((req, res) =>
  clientController.updateClientProfile(req, res)
));
router.get("/", asyncHandler((req, res) => clientController.getAllClients(req, res)));
router.get("/:id", asyncHandler((req, res) => clientController.getClientById(req, res)));
router.post("/register", asyncHandler((req, res) =>
  clientController.registerClient(req, res)
));

export default router;

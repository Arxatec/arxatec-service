// src/modules/cases/external_clients/presentation/routes/external_clients.routes.ts
import { Router, Request } from "express";
import multer from "multer";

import { authenticateToken } from "../../../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../../../middlewares/async_handler";
import { ExternalClientsController } from "../controller/external_client.controller";

const router = Router();
const ctrl = new ExternalClientsController();

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!imageMimeTypes.includes(file.mimetype)) {
    return cb(new Error("ONLY_IMAGE_FILES_ALLOWED"));
  }
  return cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

/**
 * @swagger
 * tags:
 *   - name: ExternalClients
 *     description: Manage external clients (created by lawyers)
 */

/**
 * @swagger
 * /external_clients:
 *   post:
 *     summary: Create a new external client
 *     description: |
 *       Crea un cliente externo asociado al abogado autenticado.
 *       Permite subir un avatar opcional.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Carla Espinoza"
 *               phone:
 *                 type: string
 *                 example: "987654321"
 *               dni:
 *                 type: string
 *                 example: "44556677"
 *               email:
 *                 type: string
 *                 example: "carla.espinoza@mail.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: External client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: External client created
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 12
 *                         message:
 *                           type: string
 *                           example: Cliente externo creado correctamente
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           example: lawyer
 */

/**
 * @swagger
 * /external_clients:
 *   get:
 *     summary: List active external clients
 *     description: Devuelve los clientes externos activos del abogado autenticado.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of active external clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: External clients
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 12
 *                           full_name:
 *                             type: string
 *                             example: "Carla Espinoza"
 *                           phone:
 *                             type: string
 *                             example: "987654321"
 *                           dni:
 *                             type: string
 *                             example: "44556677"
 *                           email:
 *                             type: string
 *                             example: "carla.espinoza@mail.com"
 *                           profile_image:
 *                             type: string
 *                             example: "https://s3.amazonaws.com/bucket/public/external_clients/avatars/avatar.jpg"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 */

/**
 * @swagger
 * /external_clients/{id}:
 *   put:
 *     summary: Update an external client
 *     description: |
 *       Actualiza los datos de un cliente externo. Permite reemplazar el avatar.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: External client ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Carla Espinoza"
 *               phone:
 *                 type: string
 *                 example: "987654321"
 *               dni:
 *                 type: string
 *                 example: "44556677"
 *               email:
 *                 type: string
 *                 example: "carla.espinoza@mail.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: External client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: External client updated
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients/{id}
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 12
 *                         message:
 *                           type: string
 *                           example: Cliente externo actualizado correctamente
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           example: lawyer
 */

/**
 * @swagger
 * /external_clients/{id}/archive:
 *   patch:
 *     summary: Archive an external client
 *     description: Archiva un cliente externo.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: External client ID
 *     responses:
 *       200:
 *         description: External client archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: External client archived
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients/{id}/archive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 12
 *                         message:
 *                           type: string
 *                           example: Cliente externo archivado correctamente
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           example: lawyer
 */

/**
 * @swagger
 * /external_clients/archived:
 *   get:
 *     summary: List archived external clients
 *     description: Devuelve la lista de clientes externos archivados.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of archived external clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Archived external clients
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients/archived
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 12
 *                           full_name:
 *                             type: string
 *                             example: "Carla Espinoza"
 *                           phone:
 *                             type: string
 *                             example: "987654321"
 *                           dni:
 *                             type: string
 *                             example: "44556677"
 *                           email:
 *                             type: string
 *                             example: "carla.espinoza@mail.com"
 *                           profile_image:
 *                             type: string
 *                             example: "https://s3.amazonaws.com/bucket/public/external_clients/avatars/avatar.jpg"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 */

/**
 * @swagger
 * /external_clients/{id}/restore:
 *   patch:
 *     summary: Restore an archived external client
 *     description: Restaura un cliente externo previamente archivado.
 *     tags: [ExternalClients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: External client ID
 *     responses:
 *       200:
 *         description: External client restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: External client restored
 *                 path:
 *                   type: string
 *                   example: /api/v1/external_clients/{id}/restore
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 12
 *                         message:
 *                           type: string
 *                           example: Cliente externo restaurado correctamente
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         role:
 *                           type: string
 *                           example: lawyer
 */

router.post(
  "/",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(ctrl.create.bind(ctrl))
);

router.get("/", authenticateToken, asyncHandler(ctrl.list.bind(ctrl)));

router.put(
  "/:id",
  authenticateToken,
  upload.single("avatar"),
  asyncHandler(ctrl.update.bind(ctrl))
);

router.patch(
  "/:id/archive",
  authenticateToken,
  asyncHandler(ctrl.archive.bind(ctrl))
);

router.get(
  "/archived",
  authenticateToken,
  asyncHandler(ctrl.listArchived.bind(ctrl))
);

router.patch(
  "/:id/restore",
  authenticateToken,
  asyncHandler(ctrl.restore.bind(ctrl))
);

export { router as externalClientsRoutes };

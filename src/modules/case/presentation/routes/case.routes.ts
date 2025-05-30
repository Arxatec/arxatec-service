import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../../../../middlewares/authenticate_token";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { CaseController } from "../controllers/case.controller";

const caseController = new CaseController();
const router = Router();

// openapi: 3.0.0
// info:
//   title: ArxaTEC Case API
//   version: 1.0.0
//   description: API para gestión de casos legales (módulo **case**)
// servers:
//   - url: /api/v1/case
// security:
//   - bearerAuth: []

// components:
//   securitySchemes:
//     bearerAuth:
//       type: http
//       scheme: bearer
//       bearerFormat: JWT

//   schemas:
//     # ===== DTOs =====
//     CreateCaseDto:
//       type: object
//       required:
//         - title
//         - description
//         - category_id
//       properties:
//         title:
//           type: string
//           minLength: 5
//           maxLength: 120
//         description:
//           type: string
//           minLength: 20
//           maxLength: 2000
//         category_id:
//           type: integer
//         urgency:
//           type: string
//           enum: [alta, media, baja]
//         is_public:
//           type: boolean
//         selected_lawyer_id:
//           type: integer
//           nullable: true
//         external_client_id:
//           type: integer
//           nullable: true

//     UpdateCaseDto:
//       type: object
//       properties:
//         title:
//           type: string
//           minLength: 5
//           maxLength: 120
//         description:
//           type: string
//           minLength: 20
//           maxLength: 2000
//         category_id:
//           type: integer
//         urgency:
//           type: string
//           enum: [alta, media, baja]
//         is_public:
//           type: boolean

//     ChangeCaseStatusDto:
//       type: object
//       required: [status_id]
//       properties:
//         status_id:
//           type: integer

//     CreateCaseAttachmentDto:
//       type: object
//       required: [service_id, file_key, label, category_id]
//       properties:
//         service_id:
//           type: integer
//         file_key:
//           type: string
//         label:
//           type: string
//         description:
//           type: string
//           nullable: true
//         category_id:
//           type: integer

//     CreateExternalClientDto:
//       type: object
//       required: [full_name, phone, dni]
//       properties:
//         full_name:
//           type: string
//           minLength: 3
//           maxLength: 100
//         phone:
//           type: string
//           minLength: 6
//         dni:
//           type: string
//           minLength: 4
//         email:
//           type: string
//           format: email
//           nullable: true

//     CreateCaseMessageDto:
//       type: object
//       required: [content]
//       properties:
//         content:
//           type: string
//           minLength: 1

//     # ===== Entidades / respuestas =====
//     Case:
//       type: object
//       properties:
//         id: { type: integer }
//         service_id: { type: integer }
//         title: { type: string }
//         description: { type: string }
//         category_id: { type: integer }
//         urgency: { type: string }
//         status_id: { type: integer }
//         is_public: { type: boolean }
//         reference_code: { type: string }
//         created_at: { type: string, format: date-time }
//         archived: { type: boolean }
//         # Relaciones anidadas (simplificadas)
//         service:
//           type: object
//           properties:
//             lawyer_id: { type: integer, nullable: true }
//             client_id: { type: integer, nullable: true }
//             external_client_id: { type: integer, nullable: true }
//         category:
//           type: object
//           properties:
//             id: { type: integer }
//             name: { type: string }
//             description: { type: string }
//         status:
//           type: object
//           properties:
//             id: { type: integer }
//             name: { type: string }
//             description: { type: string }
//         histories:
//           type: array
//           items:
//             $ref: '#/components/schemas/HistoryEntry'
//         attachments:
//           type: array
//           items:
//             $ref: '#/components/schemas/AttachmentDetail'
//         messages:
//           type: array
//           items:
//             $ref: '#/components/schemas/Message'

//     CaseList:
//       type: array
//       items:
//         $ref: '#/components/schemas/Case'

//     Category:
//       type: object
//       properties:
//         id: { type: integer }
//         name: { type: string }
//         description: { type: string, nullable: true }

//     Status:
//       type: object
//       properties:
//         id: { type: integer }
//         name: { type: string }
//         description: { type: string, nullable: true }

//     AttachmentSummary:
//       type: object
//       properties:
//         id: { type: integer }
//         label: { type: string }
//         category_id: { type: integer }
//         uploaded_by: { type: string, enum: [lawyer, client] }
//         created_at: { type: string, format: date-time }
//         url:
//           type: string
//           description: URL temporal para descarga

//     AttachmentDetail:
//       allOf:
//         - $ref: '#/components/schemas/AttachmentSummary'
//       properties:
//         file_key: { type: string }
//         description: { type: string, nullable: true }

//     Message:
//       type: object
//       properties:
//         id: { type: integer }
//         service_id: { type: integer }
//         content: { type: string }
//         sent_by: { type: string, enum: [lawyer, client] }
//         is_read: { type: boolean }
//         created_at: { type: string, format: date-time }

//     HistoryEntry:
//       type: object
//       properties:
//         id: { type: integer }
//         case_id: { type: integer }
//         changed_by: { type: integer }
//         field: { type: string }
//         old_value: { type: string }
//         new_value: { type: string }
//         note: { type: string, nullable: true }
//         created_at: { type: string, format: date-time }

//     ExternalClient:
//       type: object
//       properties:
//         id: { type: integer }
//         full_name: { type: string }
//         phone: { type: string }
//         dni: { type: string }
//         email: { type: string, nullable: true }
//         created_at: { type: string, format: date-time }

//   paths:
//     /:
//       post:
//         summary: Crear caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         requestBody:
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/CreateCaseDto'
//         responses:
//           '201':
//             description: Caso creado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Case'
//           '400': { description: Bad Request }
//           '409': { description: Conflict }

//     /explore:
//       get:
//         summary: Explorar casos públicos
//         tags: [Cases]
//         parameters:
//           - in: query
//             name: category_id
//             schema:
//               type: integer
//           - in: query
//             name: status_id
//             schema:
//               type: integer
//         responses:
//           '200':
//             description: Lista de casos
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/CaseList'

//     /my:
//       get:
//         summary: Mis casos (cliente/abogado)
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         responses:
//           '200':
//             description: Lista de mis casos
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/CaseList'

//     /{id}:
//       get:
//         summary: Detalle de un caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             required: true
//             schema: { type: integer }
//         responses:
//           '200':
//             description: Detalle del caso
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Case'
//           '403': { description: Forbidden }
//           '404': { description: Not Found }

//       put:
//         summary: Actualizar caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         requestBody:
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/UpdateCaseDto'
//         responses:
//           '200':
//             description: Caso actualizado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Case'
//           '400': { description: Bad Request }
//           '403': { description: Forbidden }

//     /{id}/status:
//       patch:
//         summary: Cambiar estado de caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         requestBody:
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/ChangeCaseStatusDto'
//         responses:
//           '200':
//             description: Estado actualizado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Case'
//           '400': { description: Bad Request }
//           '403': { description: Forbidden }
//           '409': { description: Conflict }

//     /{id}/archive:
//       patch:
//         summary: Archivar caso (soft-delete)
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         responses:
//           '200':
//             description: Caso archivado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Case'

//     /{id}/attachment:
//       post:
//         summary: Subir adjunto a un caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         requestBody:
//           required: true
//           content:
//             multipart/form-data:
//               schema:
//                 type: object
//                 properties:
//                   file:
//                     type: string
//                     format: binary
//                   label:
//                     type: string
//                   description:
//                     type: string
//                   category_id:
//                     type: integer
//         responses:
//           '201':
//             description: Adjunto creado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/AttachmentDetail'
//           '400': { description: Bad Request }
//           '409': { description: Conflict }

//     /{id}/attachments:
//       get:
//         summary: Listar adjuntos de un caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         responses:
//           '200':
//             description: Lista de adjuntos
//             content:
//               application/json:
//                 schema:
//                   type: array
//                   items:
//                     $ref: '#/components/schemas/AttachmentSummary'

//     /{id}/attachment/{attId}:
//       get:
//         summary: Obtener URL firmada de un adjunto privado
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//           - in: path
//             name: attId
//             schema: { type: integer }
//         responses:
//           '200':
//             description: URL generada
//             content:
//               application/json:
//                 schema:
//                   type: object
//                   properties:
//                     url:
//                       type: string

//       patch:
//         summary: Archivar (soft-delete) un adjunto
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//           - in: path
//             name: attId
//             schema: { type: integer }
//         responses:
//           '200':
//             description: Adjunto archivado
//             content:
//               application/json:
//                 schema:
//                   type: object

//     /external_client:
//       post:
//         summary: Crear cliente externo (solo abogado)
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         requestBody:
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/CreateExternalClientDto'
//         responses:
//           '201':
//             description: Cliente externo creado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/ExternalClient'

//     /categories:
//       get:
//         summary: Listar categorías de casos
//         tags: [Cases]
//         responses:
//           '200':
//             description: Categorías obtenidas
//             content:
//               application/json:
//                 schema:
//                   type: array
//                   items:
//                     $ref: '#/components/schemas/Category'

//     /types:
//       get:
//         summary: Listar estados (status) de casos
//         tags: [Cases]
//         responses:
//           '200':
//             description: Estados obtenidos
//             content:
//               application/json:
//                 schema:
//                   type: array
//                   items:
//                     $ref: '#/components/schemas/Status'

//     /{id}/message:
//       post:
//         summary: Enviar mensaje interno en un caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         requestBody:
//           required: true
//           content:
//             application/json:
//               schema:
//                 $ref: '#/components/schemas/CreateCaseMessageDto'
//         responses:
//           '201':
//             description: Mensaje enviado
//             content:
//               application/json:
//                 schema:
//                   $ref: '#/components/schemas/Message'

//     /{id}/history:
//       get:
//         summary: Historial de cambios de un caso
//         tags: [Cases]
//         security: [{ bearerAuth: [] }]
//         parameters:
//           - in: path
//             name: id
//             schema: { type: integer }
//         responses:
//           '200':
//             description: Historial obtenido
//             content:
//               application/json:
//                 schema:
//                   type: array
//                   items:
//                     $ref: '#/components/schemas/HistoryEntry'

const upload = multer({ storage: multer.memoryStorage() });

/* -------- PUBLIC CATALOGS -------- */
router.get(
  "/categories",
  asyncHandler((req, res) => caseController.getCategories(req, res))
);
router.get(
  "/statuses",
  asyncHandler((req, res) => caseController.getStatuses(req, res))
);

/* -------- CASE CREATION -------- */
router.post(
  "/",
  authenticateToken,
  asyncHandler((req, res) => caseController.createCase(req, res))
);
router.post(
  "/external_client",
  authenticateToken,
  asyncHandler((req, res) => caseController.createExternalClient(req, res))
);

/* -------- CASE READ -------- */
router.get(
  "/explore",
  asyncHandler((req, res) => caseController.exploreCases(req, res))
);
router.get(
  "/my",
  authenticateToken,
  asyncHandler((req, res) => caseController.getMyCases(req, res))
);
router.get(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => caseController.getCaseById(req, res))
);
router.get(
  "/:id/history",
  authenticateToken,
  asyncHandler((req, res) => caseController.getHistory(req, res))
);

/* -------- CASE UPDATE -------- */
router.put(
  "/:id",
  authenticateToken,
  asyncHandler((req, res) => caseController.updateCase(req, res))
);
router.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler((req, res) => caseController.changeStatus(req, res))
);
router.patch(
  "/:id/archive",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveCase(req, res))
);

/* -------- ATTACHMENTS -------- */
router.post(
  "/:id/attachment",
  authenticateToken,
  upload.fields([{ name: "file", maxCount: 1 }]),
  asyncHandler((req, res) => caseController.addAttachment(req, res))
);
router.get(
  "/:id/attachments",
  authenticateToken,
  asyncHandler((req, res) => caseController.listAttachments(req, res))
);
// GET TEMPORARY SIGNED URL FOR PRIVATE FILE
router.get(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.getAttachmentUrl(req, res))
);

// ARCHIVE ATTACHMENT (SOFT DELETE)
router.patch(
  "/:id/attachment/:attId",
  authenticateToken,
  asyncHandler((req, res) => caseController.archiveAttachment(req, res))
);

/* -------- INTERNAL MESSAGES -------- */
router.post(
  "/:id/message",
  authenticateToken,
  asyncHandler((req, res) => caseController.sendMessage(req, res))
);

export default router;

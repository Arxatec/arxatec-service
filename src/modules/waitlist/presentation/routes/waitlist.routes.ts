import { Router } from "express";
import { WaitlistController } from "../controllers/waitlist.controller";
import { asyncHandler } from "../../../../middlewares";

const router = Router();

/**
 * Suscripción a actualizaciones de Arxatec
 * @openapi
 * /api/v1/news/sub_new_news:
 *    post:
 *      tags:
 *        - Subscribe
 *      summary: "Suscripción a novedades de Arxatec"
 *      description: "Permite a los usuarios suscribirse para recibir notificaciones sobre nuevas funcionalidades, actualizaciones y novedades de Arxatec."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - email
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Carlos Ramírez"
 *                  description: "Nombre completo del usuario que desea suscribirse a las actualizaciones."
 *                email:
 *                  type: string
 *                  format: email
 *                  example: "carlos.ramirez@example.com"
 *                  description: "Correo electrónico del usuario, utilizado para enviar las notificaciones de actualizaciones."
 *      responses:
 *        '201':
 *          description: "Suscripción exitosa. El usuario será notificado de futuras actualizaciones."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Suscripción exitosa. Revisa tu correo para más detalles."
 *        '400':
 *          description: "Error en la solicitud o el correo ya está suscrito a las actualizaciones."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Este correo ya está suscrito a las actualizaciones."
 *        '422':
 *          description: "Datos de entrada inválidos, como un correo mal formado."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "El correo proporcionado no tiene un formato válido."
 *        '500':
 *          description: "Error interno al procesar la solicitud de suscripción."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Error al procesar la solicitud de suscripción."
 *      security:
 *        - apiKey: []
 */
const waitlistController = new WaitlistController();
router.post("/waitlist", asyncHandler(waitlistController.subscribeController));

export default router;

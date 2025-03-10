import { Router } from "express";
import { updateClientProfileController } from "../controllers/profile.controller";
import { authenticateToken } from "../../../../middlewares/authenticate_token"; // Ajusta la ruta a tu estructura

const router = Router();

/**
 * Actualización del perfil del cliente
 * @openapi
 * /api/v1/client/profile:
 *    put:
 *      tags:
 *        - Client
 *      summary: "Actualiza el perfil del cliente"
 *      description: "Permite a un cliente actualizar su perfil, siempre y cuando el usuario sea de tipo 'client' y esté activo en el sistema."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                first_name:
 *                  type: string
 *                  example: "Juan"
 *                  description: "Nombre del cliente."
 *                last_name:
 *                  type: string
 *                  example: "Pérez"
 *                  description: "Apellido del cliente."
 *                profile_image:
 *                  type: string
 *                  format: uri
 *                  example: "http://example.com/image.png"
 *                  description: "URL de la imagen de perfil del cliente."
 *                address:
 *                  type: string
 *                  example: "Calle Falsa 123"
 *                  description: "Dirección física del cliente."
 *                phone:
 *                  type: string
 *                  example: "555-1234"
 *                  description: "Número de teléfono principal del cliente."
 *                additional_phone:
 *                  type: string
 *                  example: "555-5678"
 *                  description: "Número de teléfono adicional del cliente."
 *                gender:
 *                  type: string
 *                  enum: ["male", "female", "other"]
 *                  example: "male"
 *                  description: "Género del cliente."
 *                birth_date:
 *                  type: string
 *                  format: date
 *                  example: "1990-01-01"
 *                  description: "Fecha de nacimiento del cliente."
 *      responses:
 *        '200':
 *          description: "Perfil actualizado exitosamente."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Perfil actualizado correctamente."

 *        '400':
 *          description: "Error en la solicitud o datos inválidos proporcionados."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Datos inválidos o solicitud mal formada."
 *        '403':
 *          description: "Acceso denegado. Solo los clientes activos pueden editar su perfil."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Acceso denegado. Solo los clientes activos tienen permiso para modificar su perfil."
 *        '404':
 *          description: "El cliente no fue encontrado."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Cliente no encontrado."
 *        '500':
 *          description: "Error interno al procesar la solicitud de actualización."
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: "Error al procesar la solicitud de actualización del perfil."
 *      security:
 *        - apiKey: []
 */

router.put("/profile", authenticateToken, updateClientProfileController);

export default router;

import { Router } from "express";
import { updateClientProfileController } from "../controllers/profile.controller";
import { authenticateToken } from "../../../../middlewares/auth"; // Ajusta la ruta a tu estructura

const router = Router();

/*
  @openapi
  /api/v1/client/profile:
    put:
      tags:
        - Client
      summary: Actualiza el perfil del cliente
      description: Permite a un usuario (cliente) actualizar su perfil solo si es de tipo client y está activo.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                first_name:
                  type: string
                  example: "Juan"
                last_name:
                  type: string
                  example: "Pérez"
                profile_image:
                  type: string
                  format: uri
                  example: "http://example.com/image.png"
                address:
                  type: string
                  example: "Calle Falsa 123"
                phone:
                  type: string
                  example: "555-1234"
                additional_phone:
                  type: string
                  example: "555-5678"
                gender:
                  type: string
                  enum: ["male", "female", "other"]
                  example: "male"
                birth_date:
                  type: string
                  example: "1990-01-01"
      responses:
        200:
          description: Perfil actualizado exitosamente.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Perfil actualizado correctamente"
                  user:
                    $ref: '#/components/schemas/User'
        400:
          description: Error en la solicitud o datos inválidos.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Datos inválidos"
        403:
          description: Acceso denegado.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Acceso denegado. Solo clientes activos pueden editar su perfil."
*/

router.put("/profile", authenticateToken, updateClientProfileController);

export default router;

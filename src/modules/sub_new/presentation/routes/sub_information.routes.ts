import { Router } from "express";
import { subscribeController } from "../controllers/sub_information.controller";

const router = Router();

/*
  @openapi
  /api/v1/api/v1/news/sub_new_news:
    post:
      tags:
        - Updates
      summary: Suscripción a actualizaciones de Arxatec
      description: Permite a los usuarios suscribirse para recibir novedades sobre nuevas funcionalidades.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
              properties:
                name:
                  type: string
                  example: "Carlos Ramírez"
                email:
                  type: string
                  format: email
                  example: "carlos.ramirez@example.com"
      responses:
        201:
          description: Suscripción exitosa.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Suscripción exitosa. Revisa tu correo para más detalles."
        400:
          description: Error en la solicitud o correo ya suscrito.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Este correo ya está suscrito a las actualizaciones."
*/

router.post("/sub_new_news", subscribeController);

export default router;
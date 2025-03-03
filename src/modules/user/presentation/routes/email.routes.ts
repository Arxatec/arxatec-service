import { Router } from 'express';
import { sendBulkEmailController } from '../controllers/email.controller';

const router = Router();

/*
  @openapi
  /api/v1/email/bulk:
    post:
      tags:
        - Email
      summary: Envío masivo de correos
      description: Envía un correo promocional a todos los usuarios registrados.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - subject
                - text
              properties:
                subject:
                  type: string
                  example: "Promoción especial"
                text:
                  type: string
                  example: "¡Aprovecha esta oferta exclusiva por tiempo limitado!"
                html:
                  type: string
                  example: "<h1>Promoción especial</h1><p>¡Aprovecha esta oferta exclusiva por tiempo limitado!</p>"
      responses:
        200:
          description: Correos enviados correctamente.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Correos enviados correctamente"
        500:
          description: Error interno al enviar correos.
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Error al enviar correos"
*/
router.post('/bulk', sendBulkEmailController);

export default router;

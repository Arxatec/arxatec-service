import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";

const router = Router();
const articleController = new ArticleController();

/*
  @openapi
  /api/v1/articles:
    post:
      tags:
        - Article
      summary: Crear un artículo
      description: Permite a un usuario con estado "active" publicar un artículo. Solo los usuarios activos podrán publicar artículos. Si el usuario no está activo, se devuelve un error indicando "Aun no es usuario de ArxaTEC".
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - userId
                - title
                - content
              properties:
                userId:
                  type: number
                  example: 1
                title:
                  type: string
                  example: "Título del artículo"
                content:
                  type: string
                  example: "Contenido completo del artículo."
      responses:
        201:
          description: Artículo creado correctamente.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: number
                    example: 5
                  userId:
                    type: number
                    example: 1
                  title:
                    type: string
                    example: "Título del artículo"
                  content:
                    type: string
                    example: "Contenido completo del artículo."
                  publicationDate:
                    type: string
                    format: date-time
                    example: "2025-03-01T12:00:00.000Z"
                  publicationTime:
                    type: string
                    format: date-time
                    example: "2025-03-01T12:00:00.000Z"
                  status:
                    type: string
                    example: "pending"
        500:
          description: Error al crear el artículo o usuario inactivo.
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Aun no es usuario de ArxaTEC"
*/
router.post("/", asyncHandler((req, res) => articleController.create(req, res)));

export default router;

import { Router } from "express";
import { ArticleController } from "../controllers/article.controller";
import { asyncHandler } from "../../../../middlewares/async_handler";
import { authenticateToken } from "../../../../middlewares/auth";

const router = Router();
const articleController = new ArticleController();

/*
  @openapi
  /api/v1/articles:
    post:
      tags:
        - Article
      summary: Crear un artículo
      description: >
        Permite a un usuario con estado "active" publicar un artículo. 
        El id del usuario se obtiene del token de autenticación (Authorization: Bearer <token>). 
        Solo los usuarios activos podrán publicar artículos.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - content
                - categoryId
              properties:
                title:
                  type: string
                  example: "Título del artículo"
                content:
                  type: string
                  example: "Contenido completo del artículo."
                categoryId:
                  type: number
                  example: 2
                banner:
                  type: string
                  format: uri
                  example: "http://example.com/banner.jpg"
      responses:
        201:
          description: Artículo creado correctamente.
    get:
      tags:
        - Article
      summary: Obtener todos los artículos
      description: >
        Retorna todos los artículos con los datos:
        Título, Contenido, Banner, Autor (nombre y apellido),
      responses:
        200:
          description: Lista de artículos.
    /{id}:
      get:
        tags:
          - Article
        summary: Obtener un artículo específico
        parameters:
          - in: path
            name: id
            schema:
              type: number
            required: true
            description: ID del artículo
        responses:
          200:
            description: Artículo encontrado.
      patch:
        tags:
          - Article
        summary: Actualizar un artículo
        security:
          - bearerAuth: []
        parameters:
          - in: path
            name: id
            schema:
              type: number
            required: true
            description: ID del artículo
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                    example: "Título actualizado"
                  content:
                    type: string
                    example: "Contenido actualizado"
                  categoryId:
                    type: number
                    example: 3
                  banner:
                    type: string
                    format: uri
                    example: "http://example.com/banner_actualizado.jpg"
        responses:
          200:
            description: Artículo actualizado correctamente.
      delete:
        tags:
          - Article
        summary: Eliminar un artículo
        security:
          - bearerAuth: []
        parameters:
          - in: path
            name: id
            schema:
              type: number
            required: true
            description: ID del artículo
        responses:
          200:
            description: Artículo eliminado correctamente.
*/

router.post("/", authenticateToken, asyncHandler((req, res) => articleController.create(req, res)));
router.get("/", asyncHandler((req, res) => articleController.getAll(req, res)));
router.get("/:id", asyncHandler((req, res) => articleController.getById(req, res)));
router.patch("/:id", authenticateToken, asyncHandler((req, res) => articleController.update(req, res)));
router.delete("/:id", authenticateToken, asyncHandler((req, res) => articleController.delete(req, res)));

export default router;

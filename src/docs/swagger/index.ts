import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import basicAuth from "express-basic-auth";
import helmet from "helmet";
import type { Express } from "express";

const isProd = "production";

const servers: OAS3Definition["servers"] = [
  { url: "http://localhost:3001", description: "Local" },
  { url: "https://api.arxatec/api/v1", description: "Production" },
];
const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "Arxatec API",
    version: "1.0.0",
    description: "Public documentation without sensitive data.",
    contact: { name: "Dev Team" },
    license: { name: "Proprietary" },
  },
  servers,
  tags: [],
  externalDocs: undefined,
  components: {
    securitySchemes: {
      BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "Success" },
          path: { type: "string", example: "/api/v1/example" },
          timestamp: { type: "string", format: "date-time" },
          data: { type: "object" },
        },
        required: ["status", "message", "path", "timestamp"],
        additionalProperties: false,
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "integer", example: 400 },
          error: { type: "string", example: "Bad Request" },
          message: { type: "string", example: "Validation error" },
          path: { type: "string", example: "/api/v1/example" },
          timestamp: { type: "string", format: "date-time" },
          details: { type: "object", nullable: true },
        },
        required: ["status", "error", "message", "path", "timestamp"],
        additionalProperties: false,
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid access token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      BadRequest: {
        description: "Invalid request or bad input data",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Requested resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const swaggerOptions: OAS3Options = {
  definition: swaggerDefinition,
  apis: ["./src/modules/**/*.route.ts"],
  failOnErrors: true,
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export function mountSwagger(app: Express) {
  app.use(
    "/api-docs",
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
    (req, res, next) => {
      res.setHeader("X-Robots-Tag", "noindex");
      next();
    },
    ...(isProd
      ? [
          basicAuth({
            users: {
              [process.env.SWAGGER_USER!]: process.env.SWAGGER_PASS!,
            },
            challenge: true,
          }),
        ]
      : []),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        supportedSubmitMethods: isProd
          ? []
          : ["get", "post", "put", "patch", "delete"],
        docExpansion: "list",
        defaultModelExpandDepth: 1,
        defaultModelsExpandDepth: 1,
      },
    })
  );
}

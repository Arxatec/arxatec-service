import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "Arxatec API",
    version: "1.0.0",
    description:
      "API de servicios para la plataforma Arxatec. Esta documentación proporciona información detallada sobre todos los endpoints disponibles, sus parámetros y respuestas.",
    contact: {
      name: "Equipo de Desarrollo de Arxatec",
      email: "developers@arxatec.net",
      url: "https://arxatec.net/contact",
    },
    license: {
      name: "Propietario - Arxatec",
      url: "https://arxatec.net/terms",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo local",
    },
    {
      url: "https://api-staging.arxatec.net",
      description: "Servidor de pruebas",
    },
    {
      url: "https://api.arxatec.net",
      description: "Servidor de producción",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Ingresa tu JWT token de autenticación con el prefijo 'Bearer '",
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Token de acceso no proporcionado o inválido",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "number",
                  example: 401,
                },
                message: {
                  type: "string",
                  example: "Unauthorized",
                },
                description: {
                  type: "string",
                  example: "Access token is missing or invalid",
                },
                timestamp: {
                  type: "string",
                  example: "2023-10-15T14:30:00.000Z",
                },
              },
            },
          },
        },
      },
      BadRequestError: {
        description: "Solicitud incorrecta o datos inválidos",
      },
      NotFoundError: {
        description: "Recurso no encontrado",
      },
      ServerError: {
        description: "Error interno del servidor",
      },
    },
  },

  externalDocs: {
    description: "Documentación adicional",
    url: "https://arxatec.net/docs",
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/**/*.ts"],
  failOnErrors: true,
};

export default swaggerJSDoc(swaggerOptions);

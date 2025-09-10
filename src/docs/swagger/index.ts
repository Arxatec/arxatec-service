import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "Arxatec API",
    version: "1.0.0",
    description:
      "API services for the Arxatec platform. This documentation provides detailed information about all available endpoints, their parameters, and expected responses.",
    contact: {
      name: "Arxatec Development Team",
      email: "developers@arxatec.io",
      url: "https://arxatec.io/contact",
    },
    license: {
      name: "Proprietary - Arxatec",
      url: "https://arxatec.io/terms",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
    {
      url: "https://api-staging.arxatec.io",
      description: "Staging server",
    },
    {
      url: "https://api.arxatec.io",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Provide your authentication JWT token prefixed with 'Bearer '",
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Access token missing or invalid",
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
                  example: "2025-07-01T12:00:00.000Z",
                },
              },
            },
          },
        },
      },
      BadRequestError: {
        description: "Invalid request or bad input data",
      },
      NotFoundError: {
        description: "Requested resource not found",
      },
      ServerError: {
        description: "Internal server error",
      },
    },
  },
  externalDocs: {
    description: "Additional documentation",
    url: "https://arxatec.io/docs",
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/**/*.ts"],
  failOnErrors: true,
};

export default swaggerJSDoc(swaggerOptions);

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
import http from "http";
import { initSocket } from "./config/socket/index.js";
import { redisClient } from "./config/redis/index.js";
import { APP_URL, PORT } from "./config/env/index.js";
import { displayWelcomeMessage, handleServerError } from "./utils/index.js";
import { customMorganFormat } from "./utils/cli/index.js";
import { multerErrorHandler } from "./middlewares/multer_error_handler/multer_error_handler.js";
import { buildHttpResponse } from "./utils/build_http_response/index.js";
import { HttpStatusCodes } from "./constants/http_status_codes/index.js";
import { mountSwagger } from "./docs";
import passport from "./config/passport";

const app = express();
const server = http.createServer(app);
const appUrl: string = APP_URL ?? `http://localhost:${PORT}`;

initSocket(server);

// Middlewares
app.use(morgan(customMorganFormat));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());

// Swagger

mountSwagger(app);

// Test route
app.get("/ping", (_, res) => res.send("pong"));

// API Routes
app.use(routes);

// Multer (errores de subida)
app.use(multerErrorHandler as express.ErrorRequestHandler);

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  return handleServerError(res, req, err);
});

// 404 al final
app.use((req, res) => {
  return res
    .status(HttpStatusCodes.NOT_FOUND.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.NOT_FOUND.code,
        "Ups, el servicio que buscas no existe, contacta al administrador para mas detalles.",
        req.path
      )
    );
});

const main = async () => {
  try {
    await redisClient.connect();
  } catch (e) {
    console.error("[Redis] No conectó:", e);
  }
  server.listen(PORT, () => {
    displayWelcomeMessage(appUrl);
  });
};
main();

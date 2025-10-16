import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import http from "http";
import { initSocket } from "./config/socket";
import { redisClient } from "./config/redis";
import { APP_URL, PORT } from "./config/env";
import { displayWelcomeMessage, handleServerError } from "./utils";
import { customMorganFormat } from "./utils/cli";
import { multerErrorHandler } from "./middlewares/multer_error_handler/multer_error_handler";
import { buildHttpResponse } from "./utils/build_http_response";
import { HttpStatusCodes } from "./constants/http_status_codes";
import { mountSwagger } from "./docs";
import passport from "./config/passport";

const app = express();
const server = http.createServer(app);
const appUrl = APP_URL ?? `http://localhost:${PORT}`;

initSocket(server);

// Middlewares
app.use(morgan(customMorganFormat));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Passport
app.use(passport.initialize());

// Swagger
mountSwagger(app);

// Health
app.get("/ping", (_, res) => res.send("pong"));

// API Routes
app.use(routes);

// Multer errors
app.use(multerErrorHandler as express.ErrorRequestHandler);

// Global error handler
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  return handleServerError(res, req, err);
});

// 404
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

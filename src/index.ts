import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes.js";
import http from "http";
import { initSocket } from "./config/socket/index.js";
import { redisClient } from "./config/redis/index.js";
import { APP_URL, PORT } from "./config/env/index.js";
import { displayWelcomeMessage } from "./utils/index.js";
import { customMorganFormat } from "./utils/cli/index.js";
import { multerErrorHandler } from "./middlewares/multer_error_handler/multer_error_handler.js";
import { globalErrorHandler } from "./middlewares/global_error_handler/index.js";
import { buildHttpResponse } from "./utils/build_http_response/index.js";
import { HttpStatusCodes } from "./constants/http_status_codes/index.js";
import { mountSwagger } from "./docs";
import passport from "./config/passport";

const app = express();
const server = http.createServer(app);

// App URL fallback
const appUrl: string = APP_URL ?? `http://localhost:${PORT}`;

// Initialize sockets
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

// API Routes
app.use(routes);

// Multer error handler
app.use(multerErrorHandler as express.ErrorRequestHandler);

// 404
app.use((req, res) => {
  return res
    .status(HttpStatusCodes.NOT_FOUND.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.NOT_FOUND.code,
        "Route not found",
        req.path
      )
    );
});

// Test route
app.get("/ping", (_, res) => res.send("pong"));

// Global Error Handler
app.use(globalErrorHandler);

// Start server
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

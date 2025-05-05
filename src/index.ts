import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger";
import routes from "./routes";
import { initSocket } from "./config/socket";
import http from "http";
import { redisClient } from "./config/redis";
import { APP_URL, PORT } from "./config/env";

const app = express();
const server = http.createServer(app);

const appUrl = APP_URL || `http://localhost:${PORT}`;

// Inicializar sockets
initSocket(server);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use centralized routes
app.use(routes);

// Test route
app.get("/ping", (_, res) => {
  res.send("pong");
});

// Start server
const main = async () => {
  await redisClient.connect();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${appUrl}`);
    console.log(`Swagger Docs disponibles en ${appUrl}/api-docs`);
  });
};

main();

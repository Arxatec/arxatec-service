import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger";
import routes from "./routes";
import dotenv from "dotenv";
import { redisClient } from "./config/redis";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

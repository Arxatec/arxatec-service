import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import routes from "./routes";  // Importas el archivo centralizado
import dotenv from "dotenv";
dotenv.config();

const app = express();
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const PORT = process.env.PORT;
const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Usar rutas centralizadas
app.use(routes);

// Test route
app.get("/ping", (_, res) => {
  res.send("pong");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${appUrl}`);
  console.log(`Swagger Docs disponibles en ${appUrl}/api-docs`);
});

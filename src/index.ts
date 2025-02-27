import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import userRoutes from "./modules/user/presentation/routes/user.routes"; 

const app = express();
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/auth", userRoutes);

// Test route
app.get("/ping", (_, res) => {
  res.send("pong");
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger Docs disponibles en http://localhost:${PORT}/api-docs`);
});

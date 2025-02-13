import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import swaggerSetup from "./docs/swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

// All routes
app.use(router);

// Test route
app.get("/ping", (_, res) => {
  res.send("pong");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
});

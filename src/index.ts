import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./docs/swagger";
import morgan from "morgan";
import cors from "cors";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

// Test route
app.get("/ping", (_, res) => {
  res.send("pong");
});

// All routes
app.use(router);

// Listen server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
});

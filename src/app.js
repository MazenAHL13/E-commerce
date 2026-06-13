import express from "express";
import clientesRouter from "./routes/clientes.routes.js";
import ordenesRouter from "./routes/ordenes.routes.js";
import productosRouter from "./routes/productos.routes.js";
import reportesRouter from "./routes/reportes.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ecommerce-api" });
});

app.use("/", clientesRouter);
app.use("/", ordenesRouter);
app.use("/", productosRouter);
app.use("/", reportesRouter);

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({
      error: "email ya registrado"
    });
  }

  if (error.code === "23503") {
    return res.status(409).json({
      error: "registro relacionado, operacion no permitida"
    });
  }

  return res.status(500).json({
    error: "internal_server_error"
  });
});

export default app;

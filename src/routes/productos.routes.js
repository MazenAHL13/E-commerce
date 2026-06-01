import { Router } from "express";
import { getProductos, postProducto } from "../controllers/productos.controller.js";

const router = Router();

router.post("/productos", postProducto);
router.get("/productos/buscar", getProductos);

export default router;

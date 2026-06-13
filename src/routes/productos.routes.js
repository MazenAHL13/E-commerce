import { Router } from "express";
import {
  deleteProducto,
  getProductos,
  postProducto,
  putProducto
} from "../controllers/productos.controller.js";

const router = Router();

router.post("/productos", postProducto);
router.get("/productos/buscar", getProductos);
router.put("/productos/:id", putProducto);
router.delete("/productos/:id", deleteProducto);

export default router;

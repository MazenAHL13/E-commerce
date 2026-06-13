import { Router } from "express";
import {
  deleteOrden,
  getOrdenById,
  getOrdenes,
  postOrden,
  putEstadoOrden
} from "../controllers/ordenes.controller.js";

const router = Router();

router.get("/ordenes", getOrdenes);
router.get("/ordenes/:id", getOrdenById);
router.post("/ordenes", postOrden);
router.put("/ordenes/:id/estado", putEstadoOrden);
router.delete("/ordenes/:id", deleteOrden);

export default router;

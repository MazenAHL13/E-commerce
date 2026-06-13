import { Router } from "express";
import {
  getClientesSobrePromedio,
  getOrdenesValidadas,
  getResumenOrdenes
} from "../controllers/reportes.controller.js";

const router = Router();

router.get("/reportes/resumen-ordenes", getResumenOrdenes);
router.get("/reportes/clientes-sobre-promedio", getClientesSobrePromedio);
router.get("/reportes/ordenes-validadas", getOrdenesValidadas);

export default router;

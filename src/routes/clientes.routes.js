import { Router } from "express";
import {
  deleteCliente,
  getClienteById,
  getClientes,
  postCliente,
  putCliente
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/clientes", getClientes);
router.get("/clientes/:id", getClienteById);
router.post("/clientes", postCliente);
router.put("/clientes/:id", putCliente);
router.delete("/clientes/:id", deleteCliente);

export default router;

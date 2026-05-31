import { Router } from "express";
import { postOrden } from "../controllers/ordenes.controller.js";

const router = Router();

router.post("/ordenes", postOrden);

export default router;

import { crearCliente } from "../services/clientes.service.js";

export async function postCliente(req, res, next) {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        error: "nombre y email son obligatorios"
      });
    }

    const cliente = await crearCliente({ nombre, email, telefono });
    return res.status(201).json(cliente);
  } catch (error) {
    return next(error);
  }
}

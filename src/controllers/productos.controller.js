import { buscarProductos } from "../services/productos.service.js";

export async function getProductos(req, res, next) {
  try {
    const productos = await buscarProductos(req.query);
    return res.json(productos);
  } catch (error) {
    return next(error);
  }
}

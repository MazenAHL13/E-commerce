import { buscarProductos, crearProducto } from "../services/productos.service.js";

export async function postProducto(req, res, next) {
  try {
    const {
      nombre,
      categoria,
      precio,
      stock,
      marca,
      atributos,
      variantes,
      etiquetas,
      industria
    } = req.body;

    if (!nombre || !categoria || precio == null || stock == null || !marca) {
      return res.status(400).json({
        error: "nombre, categoria, precio, stock y marca son obligatorios"
      });
    }

    const producto = await crearProducto({
      nombre,
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      marca,
      atributos: atributos || {},
      variantes: variantes || [],
      etiquetas: etiquetas || [],
      industria: industria || []
    });

    return res.status(201).json(producto);
  } catch (error) {
    return next(error);
  }
}

export async function getProductos(req, res, next) {
  try {
    const productos = await buscarProductos(req.query);
    return res.json(productos);
  } catch (error) {
    return next(error);
  }
}

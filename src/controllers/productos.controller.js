import {
  actualizarProducto,
  buscarProductos,
  crearProducto,
  eliminarProducto
} from "../services/productos.service.js";

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

export async function putProducto(req, res, next) {
  try {
    const { id } = req.params;
    const datos = { ...req.body };

    if (datos.precio !== undefined) {
      datos.precio = Number(datos.precio);
    }

    if (datos.stock !== undefined) {
      datos.stock = Number(datos.stock);
    }

    const producto = await actualizarProducto(id, datos);
    return res.json(producto);
  } catch (error) {
    if (error.message === "ID_INVALIDO" || error.message === "DATOS_INVALIDOS") {
      return res.status(400).json({
        error: error.message.toLowerCase()
      });
    }

    if (error.message === "PRODUCTO_NO_EXISTE") {
      return res.status(404).json({
        error: "producto no encontrado"
      });
    }

    return next(error);
  }
}

export async function deleteProducto(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await eliminarProducto(id);

    return res.json({
      mensaje: "producto eliminado",
      producto
    });
  } catch (error) {
    if (error.message === "ID_INVALIDO") {
      return res.status(400).json({
        error: "id_invalido"
      });
    }

    if (error.message === "PRODUCTO_NO_EXISTE") {
      return res.status(404).json({
        error: "producto no encontrado"
      });
    }

    return next(error);
  }
}

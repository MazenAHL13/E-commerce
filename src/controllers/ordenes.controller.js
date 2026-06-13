import {
  actualizarEstadoOrden,
  crearOrden,
  eliminarOrden,
  listarOrdenes,
  obtenerOrdenPorId
} from "../services/ordenes.service.js";

export async function getOrdenes(_req, res, next) {
  try {
    const ordenes = await listarOrdenes();
    return res.json(ordenes);
  } catch (error) {
    return next(error);
  }
}

export async function getOrdenById(req, res, next) {
  try {
    const { id } = req.params;
    const orden = await obtenerOrdenPorId(id);
    return res.json(orden);
  } catch (error) {
    if (error.message === "ORDEN_NO_EXISTE") {
      return res.status(404).json({
        error: "orden no encontrada"
      });
    }

    return next(error);
  }
}

export async function postOrden(req, res, next) {
  try {
    const { cliente_id, items, total, factura, pago, metodo_pago, tarjeta_tokenizada } = req.body;

    if (!cliente_id) {
      return res.status(400).json({
        error: "cliente_id es obligatorio"
      });
    }

    const resultado = await crearOrden({
      cliente_id,
      items,
      total,
      factura,
      pago,
      metodo_pago,
      tarjeta_tokenizada
    });

    return res.status(201).json(resultado);
  } catch (error) {
    if (error.message === "CLIENTE_NO_EXISTE") {
      return res.status(404).json({
        error: "cliente no encontrado"
      });
    }

    if (
      error.message === "ITEMS_INVALIDOS" ||
      error.message === "TOTAL_INVALIDO" ||
      error.message === "PAGO_INVALIDO"
    ) {
      return res.status(400).json({
        error: error.message.toLowerCase()
      });
    }

    return next(error);
  }
}

export async function putEstadoOrden(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        error: "estado es obligatorio"
      });
    }

    const orden = await actualizarEstadoOrden(id, estado);
    return res.json(orden);
  } catch (error) {
    if (error.message === "ORDEN_NO_EXISTE") {
      return res.status(404).json({
        error: "orden no encontrada"
      });
    }

    if (error.message === "ESTADO_REQUERIDO" || error.message === "ORDEN_REQUERIDA") {
      return res.status(400).json({
        error: error.message.toLowerCase()
      });
    }

    return next(error);
  }
}

export async function deleteOrden(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await eliminarOrden(id);

    return res.json({
      mensaje: "orden eliminada",
      ...resultado
    });
  } catch (error) {
    if (error.message === "ORDEN_NO_EXISTE") {
      return res.status(404).json({
        error: "orden no encontrada"
      });
    }

    return next(error);
  }
}

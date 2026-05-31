import { crearOrden } from "../services/ordenes.service.js";

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

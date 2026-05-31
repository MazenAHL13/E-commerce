import { crearOrden } from "../services/ordenes.service.js";

export async function postOrden(req, res, next) {
  try {
    const { cliente_id, total, metodo_pago, tarjeta_tokenizada } = req.body;

    if (!cliente_id || total == null || !metodo_pago || !tarjeta_tokenizada) {
      return res.status(400).json({
        error: "cliente_id, total, metodo_pago y tarjeta_tokenizada son obligatorios"
      });
    }

    const resultado = await crearOrden({
      cliente_id,
      total,
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

    return next(error);
  }
}

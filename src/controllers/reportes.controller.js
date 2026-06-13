import {
  obtenerClientesSobrePromedio,
  obtenerOrdenesValidadas,
  obtenerResumenOrdenes
} from "../services/reportes.service.js";

export async function getResumenOrdenes(_req, res, next) {
  try {
    const reportes = await obtenerResumenOrdenes();
    return res.json(reportes);
  } catch (error) {
    return next(error);
  }
}

export async function getClientesSobrePromedio(_req, res, next) {
  try {
    const reportes = await obtenerClientesSobrePromedio();
    return res.json(reportes);
  } catch (error) {
    return next(error);
  }
}

export async function getOrdenesValidadas(_req, res, next) {
  try {
    const reportes = await obtenerOrdenesValidadas();
    return res.json(reportes);
  } catch (error) {
    return next(error);
  }
}

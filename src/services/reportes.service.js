import { env } from "../config/env.js";
import { pgPool } from "../db/postgres.js";

async function ejecutarReporte(queryText) {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config('app.encryption_key', $1, true)", [
      env.appEncryptionKey
    ]);

    const result = await client.query(queryText);

    await client.query("COMMIT");
    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function obtenerResumenOrdenes() {
  return ejecutarReporte(
    `
      SELECT *
      FROM vw_resumen_ordenes
      ORDER BY fecha_orden DESC
    `
  );
}

export function obtenerClientesSobrePromedio() {
  return ejecutarReporte(
    `
      SELECT *
      FROM vw_clientes_sobre_promedio
      ORDER BY total_comprado DESC, nombre ASC
    `
  );
}

export function obtenerOrdenesValidadas() {
  return ejecutarReporte(
    `
      SELECT *
      FROM vw_ordenes_totales_validados
      ORDER BY created_at DESC
    `
  );
}

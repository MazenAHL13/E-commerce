import { pgPool } from "../db/postgres.js";

export async function crearOrden({ cliente_id, total, metodo_pago, tarjeta_tokenizada }) {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    const clienteResult = await client.query(
      "SELECT id FROM clientes WHERE id = $1",
      [cliente_id]
    );

    if (clienteResult.rowCount === 0) {
      throw new Error("CLIENTE_NO_EXISTE");
    }

    const ordenResult = await client.query(
      `
        INSERT INTO ordenes (cliente_id, estado, total)
        VALUES ($1, $2, $3)
        RETURNING id, cliente_id, estado, total, created_at
      `,
      [cliente_id, "confirmada", total]
    );

    const orden = ordenResult.rows[0];

    const facturaResult = await client.query(
      `
        INSERT INTO facturas (orden_id, monto_total, metodo_pago, tarjeta_tokenizada)
        VALUES ($1, $2, $3, $4)
        RETURNING id, orden_id, monto_total, metodo_pago, created_at
      `,
      [orden.id, total, metodo_pago, tarjeta_tokenizada]
    );

    const factura = facturaResult.rows[0];

    await client.query("COMMIT");

    return {
      orden,
      factura
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

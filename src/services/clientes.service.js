import { pgPool } from "../db/postgres.js";

export async function crearCliente({ nombre, email, telefono }) {
  const result = await pgPool.query(
    `
      INSERT INTO clientes (nombre, email, telefono)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, email, telefono, created_at
    `,
    [nombre, email, telefono || null]
  );

  return result.rows[0];
}

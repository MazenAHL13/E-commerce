import { pgPool } from "../db/postgres.js";

export async function crearCliente({ nombre, email, telefono }) {
  await pgPool.query("CALL sp_crear_cliente($1, $2, $3)", [
    nombre,
    email,
    telefono || null
  ]);

  const result = await pgPool.query(
    `
      SELECT id, nombre, email, telefono, created_at
      FROM clientes
      WHERE email = lower($1)
    `,
    [email]
  );

  return result.rows[0];
}

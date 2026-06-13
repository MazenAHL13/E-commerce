import { pgPool } from "../db/postgres.js";

export async function listarClientes() {
  const result = await pgPool.query(
    `
      SELECT id, nombre, email, telefono, created_at
      FROM clientes
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function obtenerClientePorId(id) {
  const result = await pgPool.query(
    `
      SELECT id, nombre, email, telefono, created_at
      FROM clientes
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error("CLIENTE_NO_EXISTE");
  }

  return result.rows[0];
}

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

export async function actualizarCliente(id, { nombre, email, telefono }) {
  const result = await pgPool.query(
    `
      UPDATE clientes
      SET
        nombre = COALESCE($2, nombre),
        email = COALESCE(lower($3), email),
        telefono = COALESCE($4, telefono)
      WHERE id = $1
      RETURNING id, nombre, email, telefono, created_at
    `,
    [id, nombre || null, email || null, telefono || null]
  );

  if (result.rowCount === 0) {
    throw new Error("CLIENTE_NO_EXISTE");
  }

  return result.rows[0];
}

export async function eliminarCliente(id) {
  const result = await pgPool.query(
    `
      DELETE FROM clientes
      WHERE id = $1
      RETURNING id, nombre, email, telefono, created_at
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new Error("CLIENTE_NO_EXISTE");
  }

  return result.rows[0];
}

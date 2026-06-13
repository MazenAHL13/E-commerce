import { pgPool } from "../db/postgres.js";
import { env } from "../config/env.js";

function generarNumeroFactura() {
  return `FAC-${Date.now()}`;
}

function calcularItems(items = []) {
  return items.map((item) => {
    const cantidad = Number(item.cantidad);
    const precioUnitario = Number(item.precio_unitario);
    const subtotal = Number((cantidad * precioUnitario).toFixed(2));

    return {
      producto_mongo_id: item.producto_mongo_id,
      nombre_producto: item.nombre_producto,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal
    };
  });
}

async function obtenerOrdenDetalle(client, ordenId) {
  await client.query("SELECT set_config('app.encryption_key', $1, true)", [
    env.appEncryptionKey
  ]);

  const ordenResult = await client.query(
    `
      SELECT
        o.id,
        o.cliente_id,
        o.estado,
        o.total,
        o.created_at,
        f.id AS factura_id,
        f.numero_factura,
        app_decrypt_text(f.nit_cliente) AS nit_cliente,
        app_decrypt_text(f.razon_social) AS razon_social,
        f.monto_total,
        f.metodo_pago,
        p.id AS pago_id,
        p.estado_pago,
        p.monto
      FROM ordenes o
      LEFT JOIN facturas f ON f.orden_id = o.id
      LEFT JOIN pagos p ON p.factura_id = f.id
      WHERE o.id = $1
    `,
    [ordenId]
  );

  if (ordenResult.rowCount === 0) {
    throw new Error("ORDEN_NO_EXISTE");
  }

  const itemsResult = await client.query(
    `
      SELECT
        id,
        producto_mongo_id,
        nombre_producto,
        cantidad,
        precio_unitario,
        subtotal
      FROM orden_items
      WHERE orden_id = $1
      ORDER BY nombre_producto ASC
    `,
    [ordenId]
  );

  const row = ordenResult.rows[0];

  return {
    orden: {
      id: row.id,
      cliente_id: row.cliente_id,
      estado: row.estado,
      total: row.total,
      created_at: row.created_at
    },
    items: itemsResult.rows,
    factura: row.factura_id
      ? {
          id: row.factura_id,
          numero_factura: row.numero_factura,
          nit_cliente: row.nit_cliente,
          razon_social: row.razon_social,
          monto_total: row.monto_total,
          metodo_pago: row.metodo_pago
        }
      : null,
    pago: row.pago_id
      ? {
          id: row.pago_id,
          estado_pago: row.estado_pago,
          monto: row.monto
        }
      : null
  };
}

export async function listarOrdenes() {
  const client = await pgPool.connect();

  try {
    const idsResult = await client.query(
      `
        SELECT id
        FROM ordenes
        ORDER BY created_at DESC
      `
    );

    const ordenes = [];

    for (const row of idsResult.rows) {
      ordenes.push(await obtenerOrdenDetalle(client, row.id));
    }

    return ordenes;
  } finally {
    client.release();
  }
}

export async function obtenerOrdenPorId(ordenId) {
  const client = await pgPool.connect();

  try {
    return await obtenerOrdenDetalle(client, ordenId);
  } finally {
    client.release();
  }
}

export async function crearOrden({
  cliente_id,
  items = [],
  total,
  factura = {},
  pago = {},
  metodo_pago,
  tarjeta_tokenizada
}) {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config('app.encryption_key', $1, true)", [
      env.appEncryptionKey
    ]);

    const clienteResult = await client.query(
      "SELECT id FROM clientes WHERE id = $1",
      [cliente_id]
    );

    if (clienteResult.rowCount === 0) {
      throw new Error("CLIENTE_NO_EXISTE");
    }

    const itemsCalculados = calcularItems(items);

    if (items.length > 0) {
      for (const item of itemsCalculados) {
        if (
          !item.producto_mongo_id ||
          !item.nombre_producto ||
          !Number.isFinite(item.cantidad) ||
          item.cantidad <= 0 ||
          !Number.isFinite(item.precio_unitario) ||
          item.precio_unitario < 0
        ) {
          throw new Error("ITEMS_INVALIDOS");
        }
      }
    }

    const totalOrden =
      itemsCalculados.length > 0
        ? Number(itemsCalculados.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2))
        : Number(total);

    if (!Number.isFinite(totalOrden) || totalOrden < 0) {
      throw new Error("TOTAL_INVALIDO");
    }

    const metodoPago = pago.metodo_pago || metodo_pago;
    const tarjetaTokenizada = pago.tarjeta_tokenizada || tarjeta_tokenizada;

    if (!metodoPago || !tarjetaTokenizada) {
      throw new Error("PAGO_INVALIDO");
    }

    const ordenResult = await client.query(
      `
        INSERT INTO ordenes (cliente_id, estado, total)
        VALUES ($1, $2, $3)
        RETURNING id, cliente_id, estado, total, created_at
      `,
      [cliente_id, "confirmada", totalOrden]
    );

    const orden = ordenResult.rows[0];

    for (const item of itemsCalculados) {
      await client.query(
        `
          INSERT INTO orden_items (
            orden_id,
            producto_mongo_id,
            nombre_producto,
            cantidad,
            precio_unitario,
            subtotal
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          orden.id,
          item.producto_mongo_id,
          item.nombre_producto,
          item.cantidad,
          item.precio_unitario,
          item.subtotal
        ]
      );
    }

    const numeroFactura = generarNumeroFactura();

    const facturaResult = await client.query(
      `
        INSERT INTO facturas (
          orden_id,
          monto_total,
          metodo_pago,
          tarjeta_tokenizada,
          numero_factura,
          nit_cliente,
          razon_social
        )
        VALUES (
          $1,
          $2,
          $3,
          app_encrypt_text($4),
          $5,
          app_encrypt_text($6),
          app_encrypt_text($7)
        )
        RETURNING
          id,
          orden_id,
          numero_factura,
          app_decrypt_text(nit_cliente) AS nit_cliente,
          app_decrypt_text(razon_social) AS razon_social,
          monto_total,
          metodo_pago,
          created_at
      `,
      [
        orden.id,
        totalOrden,
        metodoPago,
        tarjetaTokenizada,
        numeroFactura,
        factura.nit_cliente || null,
        factura.razon_social || null
      ]
    );

    const facturaCreada = facturaResult.rows[0];

    const pagoResult = await client.query(
      `
        INSERT INTO pagos (factura_id, metodo_pago, estado_pago, monto, tarjeta_tokenizada)
        VALUES ($1, $2, $3, $4, app_encrypt_text($5))
        RETURNING id, factura_id, metodo_pago, estado_pago, monto, created_at
      `,
      [
        facturaCreada.id,
        metodoPago,
        pago.estado_pago || "procesado",
        totalOrden,
        tarjetaTokenizada
      ]
    );

    const pagoCreado = pagoResult.rows[0];

    await client.query("COMMIT");

    return {
      orden,
      items: itemsCalculados,
      factura: facturaCreada,
      pago: pagoCreado
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function actualizarEstadoOrden(ordenId, estado) {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    await client.query("CALL sp_actualizar_estado_orden($1, $2)", [ordenId, estado]);

    const result = await client.query(
      `
        SELECT id, cliente_id, estado, total, created_at
        FROM ordenes
        WHERE id = $1
      `,
      [ordenId]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function eliminarOrden(ordenId) {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    const pagoResult = await client.query(
      `
        DELETE FROM pagos
        WHERE factura_id IN (
          SELECT id
          FROM facturas
          WHERE orden_id = $1
        )
      `,
      [ordenId]
    );

    const facturaResult = await client.query(
      `
        DELETE FROM facturas
        WHERE orden_id = $1
      `,
      [ordenId]
    );

    const ordenResult = await client.query(
      `
        DELETE FROM ordenes
        WHERE id = $1
        RETURNING id, cliente_id, estado, total, created_at
      `,
      [ordenId]
    );

    if (ordenResult.rowCount === 0) {
      throw new Error("ORDEN_NO_EXISTE");
    }

    await client.query("COMMIT");

    return {
      orden: ordenResult.rows[0],
      facturas_eliminadas: facturaResult.rowCount,
      pagos_eliminados: pagoResult.rowCount
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

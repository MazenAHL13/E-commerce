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

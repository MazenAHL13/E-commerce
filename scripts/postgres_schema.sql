CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ordenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL UNIQUE REFERENCES ordenes(id),
  monto_total NUMERIC(10, 2) NOT NULL CHECK (monto_total >= 0),
  metodo_pago VARCHAR(40) NOT NULL,
  tarjeta_tokenizada TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE facturas
ADD COLUMN IF NOT EXISTS numero_factura VARCHAR(50);

ALTER TABLE facturas
ADD COLUMN IF NOT EXISTS nit_cliente VARCHAR(30);

ALTER TABLE facturas
ADD COLUMN IF NOT EXISTS razon_social VARCHAR(150);

CREATE UNIQUE INDEX IF NOT EXISTS idx_facturas_numero_factura
ON facturas(numero_factura)
WHERE numero_factura IS NOT NULL;

CREATE TABLE IF NOT EXISTS orden_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_id UUID NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_mongo_id VARCHAR(50) NOT NULL,
  nombre_producto VARCHAR(150) NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID NOT NULL UNIQUE REFERENCES facturas(id) ON DELETE CASCADE,
  metodo_pago VARCHAR(40) NOT NULL,
  estado_pago VARCHAR(30) NOT NULL DEFAULT 'procesado',
  monto NUMERIC(10, 2) NOT NULL CHECK (monto >= 0),
  tarjeta_tokenizada TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_orden_id ON facturas(orden_id);
CREATE INDEX IF NOT EXISTS idx_orden_items_orden_id ON orden_items(orden_id);
CREATE INDEX IF NOT EXISTS idx_pagos_factura_id ON pagos(factura_id);

CREATE OR REPLACE PROCEDURE sp_crear_cliente(
  IN p_nombre VARCHAR(120),
  IN p_email VARCHAR(150),
  IN p_telefono VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_nombre IS NULL OR btrim(p_nombre) = '' THEN
    RAISE EXCEPTION 'NOMBRE_REQUERIDO';
  END IF;

  IF p_email IS NULL OR btrim(p_email) = '' THEN
    RAISE EXCEPTION 'EMAIL_REQUERIDO';
  END IF;

  INSERT INTO clientes (nombre, email, telefono)
  VALUES (btrim(p_nombre), lower(btrim(p_email)), NULLIF(btrim(p_telefono), ''));
END;
$$;

CREATE OR REPLACE PROCEDURE sp_actualizar_estado_orden(
  IN p_orden_id UUID,
  IN p_estado VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_orden_id IS NULL THEN
    RAISE EXCEPTION 'ORDEN_REQUERIDA';
  END IF;

  IF p_estado IS NULL OR btrim(p_estado) = '' THEN
    RAISE EXCEPTION 'ESTADO_REQUERIDO';
  END IF;

  UPDATE ordenes
  SET estado = lower(btrim(p_estado))
  WHERE id = p_orden_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDEN_NO_EXISTE';
  END IF;
END;
$$;

CREATE OR REPLACE VIEW vw_resumen_ordenes AS
SELECT
  o.id AS orden_id,
  o.created_at AS fecha_orden,
  o.estado,
  o.total,
  c.id AS cliente_id,
  c.nombre AS cliente_nombre,
  c.email AS cliente_email,
  f.id AS factura_id,
  f.numero_factura,
  f.nit_cliente,
  f.razon_social,
  p.id AS pago_id,
  p.metodo_pago,
  p.estado_pago,
  p.monto AS monto_pagado
FROM ordenes o
JOIN clientes c ON c.id = o.cliente_id
LEFT JOIN facturas f ON f.orden_id = o.id
LEFT JOIN pagos p ON p.factura_id = f.id;

CREATE OR REPLACE VIEW vw_clientes_sobre_promedio AS
SELECT
  c.id AS cliente_id,
  c.nombre,
  c.email,
  (
    SELECT COALESCE(SUM(o.total), 0)
    FROM ordenes o
    WHERE o.cliente_id = c.id
  ) AS total_comprado
FROM clientes c
WHERE (
  SELECT COALESCE(SUM(o.total), 0)
  FROM ordenes o
  WHERE o.cliente_id = c.id
) > (
  SELECT COALESCE(AVG(t.total_cliente), 0)
  FROM (
    SELECT COALESCE(SUM(o2.total), 0) AS total_cliente
    FROM clientes c2
    LEFT JOIN ordenes o2 ON o2.cliente_id = c2.id
    GROUP BY c2.id
  ) t
);

CREATE OR REPLACE VIEW vw_ordenes_totales_validados AS
SELECT
  o.id AS orden_id,
  o.total AS total_registrado,
  (
    SELECT COALESCE(SUM(oi.subtotal), 0)
    FROM orden_items oi
    WHERE oi.orden_id = o.id
  ) AS total_calculado_items,
  o.estado,
  o.created_at
FROM ordenes o
WHERE o.total = (
  SELECT COALESCE(SUM(oi.subtotal), 0)
  FROM orden_items oi
  WHERE oi.orden_id = o.id
);

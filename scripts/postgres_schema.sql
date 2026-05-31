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

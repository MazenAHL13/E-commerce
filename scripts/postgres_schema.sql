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

CREATE INDEX IF NOT EXISTS idx_ordenes_cliente_id ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_orden_id ON facturas(orden_id);

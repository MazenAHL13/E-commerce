SET app.encryption_key = 'dev_demo_key_2026';

INSERT INTO clientes (id, nombre, email, telefono)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ana Perez', 'ana@example.com', '77777777'),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Mendoza', 'carlos.mendoza@example.com', '72110001'),
  ('33333333-3333-3333-3333-333333333333', 'Lucia Fernandez', 'lucia.fernandez@example.com', '72110002'),
  ('44444444-4444-4444-4444-444444444444', 'Diego Rojas', 'diego.rojas@example.com', '72110003'),
  ('55555555-5555-5555-5555-555555555555', 'Valeria Quiroga', 'valeria.quiroga@example.com', '72110004')
ON CONFLICT (email) DO NOTHING;

INSERT INTO ordenes (id, cliente_id, estado, total, created_at)
VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222222', 'confirmada', 1225.00, CURRENT_TIMESTAMP - INTERVAL '4 day'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '33333333-3333-3333-3333-333333333333', 'confirmada', 275.00, CURRENT_TIMESTAMP - INTERVAL '3 day'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '44444444-4444-4444-4444-444444444444', 'enviado', 120.00, CURRENT_TIMESTAMP - INTERVAL '2 day'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '55555555-5555-5555-5555-555555555555', 'confirmada', 113.00, CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO orden_items (
  id,
  orden_id,
  producto_mongo_id,
  nombre_producto,
  cantidad,
  precio_unitario,
  subtotal
)
VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'mongo-producto-1', 'Laptop gamer', 1, 1200.00, 1200.00),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'mongo-producto-2', 'Polera oversize', 1, 25.00, 25.00),
  ('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'mongo-producto-3', 'Silla ergonomica', 1, 180.00, 180.00),
  ('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'mongo-producto-4', 'Set de velas decorativas', 5, 19.00, 95.00),
  ('bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'mongo-producto-5', 'Bateria de cocina', 1, 95.00, 95.00),
  ('bbbbbbb6-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'mongo-producto-6', 'Set de velas decorativas', 1, 25.00, 25.00),
  ('bbbbbbb7-bbbb-bbbb-bbbb-bbbbbbbbbbb7', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'mongo-producto-7', 'Polera oversize', 2, 25.00, 50.00),
  ('bbbbbbb8-bbbb-bbbb-bbbb-bbbbbbbbbbb8', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'mongo-producto-8', 'Set de velas decorativas', 3, 21.00, 63.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO facturas (
  id,
  orden_id,
  monto_total,
  metodo_pago,
  tarjeta_tokenizada,
  numero_factura,
  nit_cliente,
  razon_social,
  created_at
)
VALUES
  ('ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 1225.00, 'tarjeta', app_encrypt_text('tok_demo_carlos_001'), 'FAC-DEMO-001', app_encrypt_text('900001'), app_encrypt_text('Carlos Mendoza'), CURRENT_TIMESTAMP - INTERVAL '4 day'),
  ('ccccccc2-cccc-cccc-cccc-ccccccccccc2', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 275.00, 'transferencia', app_encrypt_text('tok_demo_lucia_001'), 'FAC-DEMO-002', app_encrypt_text('900002'), app_encrypt_text('Lucia Fernandez'), CURRENT_TIMESTAMP - INTERVAL '3 day'),
  ('ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 120.00, 'qr', app_encrypt_text('tok_demo_diego_001'), 'FAC-DEMO-003', app_encrypt_text('900003'), app_encrypt_text('Diego Rojas'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
  ('ccccccc4-cccc-cccc-cccc-ccccccccccc4', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 113.00, 'tarjeta', app_encrypt_text('tok_demo_valeria_001'), 'FAC-DEMO-004', app_encrypt_text('900004'), app_encrypt_text('Valeria Quiroga'), CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (orden_id) DO NOTHING;

INSERT INTO pagos (
  id,
  factura_id,
  metodo_pago,
  estado_pago,
  monto,
  tarjeta_tokenizada,
  created_at
)
VALUES
  ('ddddddd1-dddd-dddd-dddd-ddddddddddd1', 'ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'tarjeta', 'procesado', 1225.00, app_encrypt_text('tok_demo_carlos_001'), CURRENT_TIMESTAMP - INTERVAL '4 day'),
  ('ddddddd2-dddd-dddd-dddd-ddddddddddd2', 'ccccccc2-cccc-cccc-cccc-ccccccccccc2', 'transferencia', 'procesado', 275.00, app_encrypt_text('tok_demo_lucia_001'), CURRENT_TIMESTAMP - INTERVAL '3 day'),
  ('ddddddd3-dddd-dddd-dddd-ddddddddddd3', 'ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'qr', 'procesado', 120.00, app_encrypt_text('tok_demo_diego_001'), CURRENT_TIMESTAMP - INTERVAL '2 day'),
  ('ddddddd4-dddd-dddd-dddd-ddddddddddd4', 'ccccccc4-cccc-cccc-cccc-ccccccccccc4', 'tarjeta', 'procesado', 113.00, app_encrypt_text('tok_demo_valeria_001'), CURRENT_TIMESTAMP - INTERVAL '1 day')
ON CONFLICT (factura_id) DO NOTHING;

INSERT INTO pagos (
  id,
  factura_id,
  metodo_pago,
  estado_pago,
  monto,
  tarjeta_tokenizada
)
SELECT
  gen_random_uuid(),
  f.id,
  COALESCE(NULLIF(f.metodo_pago, ''), 'pendiente_regularizacion'),
  'procesado',
  f.monto_total,
  app_encrypt_text(COALESCE(NULLIF(app_decrypt_text(f.tarjeta_tokenizada), ''), 'tok_demo_regularizado'))
FROM facturas f
LEFT JOIN pagos p ON p.factura_id = f.id
WHERE p.id IS NULL;

UPDATE facturas
SET
  tarjeta_tokenizada = app_encrypt_text(app_decrypt_text(tarjeta_tokenizada)),
  nit_cliente = app_encrypt_text(app_decrypt_text(nit_cliente)),
  razon_social = app_encrypt_text(app_decrypt_text(razon_social))
WHERE
  tarjeta_tokenizada IS NOT NULL
  AND tarjeta_tokenizada NOT LIKE 'enc:%';

UPDATE pagos
SET tarjeta_tokenizada = app_encrypt_text(app_decrypt_text(tarjeta_tokenizada))
WHERE
  tarjeta_tokenizada IS NOT NULL
  AND tarjeta_tokenizada NOT LIKE 'enc:%';

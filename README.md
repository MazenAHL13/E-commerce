# E-commerce

## Ejecutar infraestructura

```bash
docker compose up -d
```

## Cargar scripts SQL

```bash
docker exec -i e-commerce-postgres-1 psql -U postgres -d ecommerce < scripts/postgres_schema.sql
docker exec -i e-commerce-postgres-1 psql -U postgres -d ecommerce < scripts/postgres_roles.sql
```

## Cargar datos demo en PostgreSQL

```bash
docker exec -i e-commerce-postgres-1 psql -U postgres -d ecommerce < scripts/postgres_demo_seed.sql
```

## Procedimientos almacenados incluidos

- `sp_crear_cliente`: valida y registra clientes desde PostgreSQL.
- `sp_actualizar_estado_orden`: cambia el estado de una orden validando que exista.

Ejemplo de uso directo:

```sql
CALL sp_crear_cliente('Ana Perez', 'ana@example.com', '77777777');
```

## Vista incluida

- `vw_resumen_ordenes`: consolida clientes, ordenes, facturas y pagos en una sola consulta reutilizable.
- `vw_clientes_sobre_promedio`: usa subconsultas para identificar clientes cuyo total comprado supera el promedio general.
- `vw_ordenes_totales_validados`: usa subconsultas para comparar el total de una orden con la suma real de sus items.
- `vw_facturas_seguras`: muestra datos sensibles desencriptados de manera controlada.

Ejemplo de uso directo:

```sql
SELECT * FROM vw_resumen_ordenes;
SELECT * FROM vw_clientes_sobre_promedio;
SELECT * FROM vw_ordenes_totales_validados;
SELECT * FROM vw_facturas_seguras;
```

## Encriptacion de datos sensibles

Los campos `facturas.tarjeta_tokenizada`, `facturas.nit_cliente`, `facturas.razon_social` y `pagos.tarjeta_tokenizada`
se almacenan cifrados usando `pgcrypto`.

Para consultas desencriptadas en pgAdmin o `psql`, define primero la clave de sesion:

```sql
SET app.encryption_key = 'dev_demo_key_2026';
SELECT * FROM vw_facturas_seguras;
```

## Cargar catalogo MongoDB

```bash
docker exec -i e-commerce-mongodb-1 mongosh -u root -p example --authenticationDatabase admin < scripts/mongo_seed.js
```

## Backend

```bash
cp .env.example .env
npm install
npm start
```

## Endpoints

### Crear cliente

```bash
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mazen Abu Hamdan","email":"mazen.abuhamdan@example.com","telefono":"77777777"}'
```

### Crear orden transaccional completa

```bash
curl -X POST http://localhost:3000/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": "UUID_DEL_CLIENTE",
    "items": [
      {
        "producto_mongo_id": "mongo-producto-1",
        "nombre_producto": "Laptop gamer",
        "cantidad": 1,
        "precio_unitario": 1200
      }
    ],
    "factura": {
      "nit_cliente": "123456",
      "razon_social": "Mazen Abu Hamdan"
    },
    "pago": {
      "metodo_pago": "tarjeta",
      "tarjeta_tokenizada": "tok_demo_123",
      "estado_pago": "procesado"
    }
  }'
```

### Buscar productos

```bash
curl "http://localhost:3000/productos/buscar?categoria=electronica&precioMin=500&precioMax=1500&etiqueta=black-friday"
```

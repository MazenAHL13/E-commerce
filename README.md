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

# Especificación de Arquitectura: E-commerce Multitienda

## 1. Visión general

Desarrollar una plataforma de e-commerce multitienda utilizando una arquitectura híbrida basada en persistencia políglota.

El sistema debe integrar:

- PostgreSQL para datos transaccionales, clientes y facturación
- MongoDB para el catálogo flexible de productos

El enfoque principal del proyecto debe estar en el backend, en la integración entre ambas bases de datos y en demostrar el uso correcto de SQL + NoSQL dentro del mismo sistema.

---

## 2. Stack tecnológico

- Docker
- Docker Compose
- PostgreSQL
- pgAdmin
- MongoDB
- Mongo Express
- Node.js
- Express
- `pg` para PostgreSQL
- `mongodb` o `mongoose` para MongoDB

---

## 3. Infraestructura

En esta fase se debe levantar la infraestructura base usando un único archivo `docker-compose.yml`.

Servicios requeridos:

- `postgres`
- `pgadmin`
- `mongodb`
- `mongo-express`

Requisitos:

- red compartida entre servicios
- volúmenes para persistencia de datos
- variables de entorno para credenciales

---

## 4. Módulo relacional

El módulo relacional gestionará los datos transaccionales, clientes y facturación.

Requisitos principales:

- aplicar normalización en 3NF
- usar UUID o GUID como identificador único para clientes
- definir claves primarias y foráneas según corresponda
- implementar transacciones ACID para el procesamiento de pagos
- aplicar protección contra SQL Injection mediante consultas parametrizadas
- implementar roles básicos de acceso (RBAC)
- no almacenar datos reales de tarjeta sin protección

Tablas mínimas esperadas:

- `clientes`
- `ordenes`
- `facturas`

---

## 5. Módulo NoSQL

El módulo NoSQL gestionará el catálogo de productos.

Categorías esperadas:

- ropa
- electrónica
- muebles
- adornos
- utensilios de cocina

Requisitos principales:

- usar documentos BSON con esquema flexible
- permitir que cada categoría tenga atributos específicos
- almacenar atributos consultables como arreglos cuando corresponda
- soportar búsquedas con operadores:
  - `$gt`
  - `$lt`
  - `$and`
  - `$or`

Ejemplos de atributos variables:

- voltajes para electrónica
- tallas para ropa
- etiquetas, variantes, marcas o industria como arreglos

---

## 6. Integración entre bases de datos

El sistema debe incluir una capa de servicio o API que conecte PostgreSQL con MongoDB usando un identificador único compartido.

La integración debe demostrar:

- registro de clientes en PostgreSQL
- relación lógica entre clientes y datos usados en el sistema
- uso de UUID/GUID para vincular información entre módulos

---

## 7. API mínima esperada

La API debe ser simple y enfocada únicamente en demostrar la integración.

Endpoints mínimos:

1. `POST /clientes`
Inserta un cliente en PostgreSQL y retorna su UUID generado.

2. `POST /ordenes`
Crea una orden transaccional en PostgreSQL vinculada al UUID del cliente y demuestra manejo ACID.

3. `GET /productos/buscar`
Consulta el catálogo en MongoDB usando operadores lógicos y de comparación.

Requisitos de implementación:

- uso de `async/await`
- manejo adecuado de errores
- respuestas JSON
- documentación básica de uso

---

## 8. Entregables

El proyecto debe incluir al menos:

- script de creación de bases de datos
- documentación de arquitectura
- diagrama de flujo de datos
- API que demuestre la integración y sincronización de datos

---

## 9. Alcance controlado

Para mantenerse fiel al documento de la docente, este proyecto no debe complicarse con funcionalidades fuera del objetivo principal.

Por ahora no es necesario agregar:

- frontend complejo
- autenticación o login
- pasarela de pago real
- cifrado externo con proveedores reales
- microservicios
- despliegue en nube
- panel administrativo avanzado

Si después queda tiempo, se puede añadir un frontend simple solo como apoyo visual, sin sacar el foco del backend.

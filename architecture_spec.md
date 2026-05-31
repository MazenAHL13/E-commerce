# Especificación de Arquitectura: E-commerce Multitienda (Black Friday)

## 1. Visión General
Desarrollar una plataforma integral de e-commerce que utilice una arquitectura híbrida (SQL + NoSQL) para gestionar una multitienda utilizando una arquitectura de Persistencia Políglota[cite: 1]. El sistema simulará alto tráfico para Black Friday. El enfoque debe ser 100% en el backend, código limpio, estructurado y el uso estricto de buenas prácticas de ingeniería de software.

## 2. Stack Tecnológico
* **Infraestructura:** Docker, docker-compose.
* **Módulo Relacional:** PostgreSQL + pgAdmin.
* **Módulo NoSQL:** MongoDB + Mongo Express.
* **Backend:** Node.js con Express (Lo más simple y minimalista posible, su único fin es demostrar la integración y exponer endpoints). Utilizar el paquete `pg` para PostgreSQL y el driver nativo `mongodb` (o `mongoose`) para MongoDB.

## 3. Especificaciones por Módulo

### Fase 1: Infraestructura (Docker)
* Levantar los servicios de PostgreSQL, pgAdmin, MongoDB y Mongo Express en un solo archivo `docker-compose.yml` utilizando redes compartidas, puertos estándar y variables de entorno para credenciales.

### Fase 2: Módulo Relacional (PostgreSQL)
Este módulo gestionará datos transaccionales, clientes y facturación[cite: 1].
* **Esquema:** Crear tablas para `Clientes`, `Ordenes` y `Facturas` aplicando normalización (3NF)[cite: 1].
* **Integración:** Utilizar GUID/UUID como clave primaria en la tabla de clientes para vincularlos posteriormente con MongoDB[cite: 1].
* **Transacciones:** Implementar transacciones ACID explícitas para procesar los pagos[cite: 1].
* **Seguridad:** 
  * Implementar roles (RBAC)[cite: 1].
  * Asegurar protección contra SQL Injection[cite: 1].
  * Implementar o indicar claramente mediante comentarios el cifrado para datos de tarjetas[cite: 1].

### Fase 3: Módulo NoSQL (MongoDB)
Este módulo gestionará el catálogo de productos (ropa, electrónica, muebles, adornos, utensilios de cocina)[cite: 1].
* **Esquema Dinámico:** Implementar un diseño polimórfico en formato BSON donde cada categoría tenga atributos específicos (ej. voltajes para electrónica, tallas para ropa) en la misma colección o bajo una jerarquía clara[cite: 1].
* **Manejo de Arreglos:** Almacenar y estructurar atributos como arreglos dentro de los productos (ej. etiquetas, variantes, marcas, industria) para facilitar el filtrado[cite: 1].
* **Consultas Requeridas:** Preparar índices o estructuras que permitan reportes de búsqueda comparativa usando operadores lógicos y de comparación (`$gt`, `$lt`, `$and`, `$or`)[cite: 1].

### Fase 4: Integración (Capa de Servicio / API)
Implementar una capa de servicio (API/Middleware) que una los registros de clientes en PostgreSQL con sus preferencias, carritos y catálogos en MongoDB mediante el identificador único (GUID/UUID)[cite: 1].
* **Endpoints Requeridos:**
  1. `POST /clientes`: Inserta un cliente en PostgreSQL y retorna su UUID generado.
  2. `POST /ordenes`: Crea una orden transaccional en PostgreSQL vinculada al UUID del cliente, demostrando manejo transaccional (ACID).
  3. `GET /productos/buscar`: Consulta el catálogo en MongoDB utilizando operadores de comparación y lógicos para filtrar productos complejos (ej. buscar dentro de los arreglos de variantes o por atributos específicos).
* **Restricciones de Código:** El backend debe incluir manejo adecuado de errores, asincronía correcta (async/await) y estar debidamente documentado.

import { MOCK_PRODUCTS } from "../data/products.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "request_failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeProduct(product, index) {
  return {
    id: product._id || product.id || `product-${index}`,
    nombre: product.nombre,
    categoria: product.categoria,
    precio: product.precio,
    precioAnterior: product.precioAnterior,
    stock: product.stock,
    marca: product.marca,
    imagen: product.imagen,
    descripcion: product.descripcion,
    atributos: product.atributos || {},
    variantes: product.variantes || [],
    etiquetas: product.etiquetas || [],
    industria: product.industria || [],
    destacado: product.destacado || false
  };
}

export async function fetchHealth() {
  return request("/health");
}

export async function fetchProductos(filters = {}) {
  if (USE_MOCK) {
    return filterMockProducts(MOCK_PRODUCTS, filters);
  }

  const params = new URLSearchParams();

  if (filters.categoria && filters.categoria !== "todos") {
    params.set("categoria", filters.categoria);
  }
  if (filters.precioMin) params.set("precioMin", filters.precioMin);
  if (filters.precioMax) params.set("precioMax", filters.precioMax);
  if (filters.etiqueta) params.set("etiqueta", filters.etiqueta);
  if (filters.marca) params.set("marca", filters.marca);

  const query = params.toString();
  const url = `/productos/buscar${query ? `?${query}` : ""}`;

  const data = await request(url);
  return filterMockProducts(data.map(normalizeProduct), filters);
}

export async function fetchProductoById(id) {
  const productos = await fetchProductos();
  return productos.find((p) => p.id === id) || null;
}

export function fetchClientes() {
  return request("/clientes");
}

export function createCliente(payload) {
  return request("/clientes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateCliente(id, payload) {
  return request(`/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteCliente(id) {
  return request(`/clientes/${id}`, {
    method: "DELETE"
  });
}

export function fetchOrdenes() {
  return request("/ordenes");
}

export function updateOrdenEstado(id, estado) {
  return request(`/ordenes/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado })
  });
}

export function deleteOrden(id) {
  return request(`/ordenes/${id}`, {
    method: "DELETE"
  });
}

export function fetchResumenOrdenes() {
  return request("/reportes/resumen-ordenes");
}

export function fetchClientesSobrePromedio() {
  return request("/reportes/clientes-sobre-promedio");
}

export function fetchOrdenesValidadas() {
  return request("/reportes/ordenes-validadas");
}

function filterMockProducts(products, { categoria, search, sort }) {
  let result = [...products];

  if (categoria && categoria !== "todos") {
    result = result.filter((p) => p.categoria === categoria);
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.etiquetas.some((t) => t.toLowerCase().includes(term))
    );
  }

  if (sort === "precio-asc") {
    result.sort((a, b) => a.precio - b.precio);
  } else if (sort === "precio-desc") {
    result.sort((a, b) => b.precio - a.precio);
  } else if (sort === "nombre") {
    result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return result;
}

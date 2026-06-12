import { MOCK_PRODUCTS } from "../data/products.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

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

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error al cargar productos");
  }

  const data = await response.json();
  return data.map(normalizeProduct);
}

export async function fetchProductoById(id) {
  const productos = await fetchProductos();
  return productos.find((p) => p.id === id) || null;
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
        p.etiquetas.some((t) => t.includes(term))
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

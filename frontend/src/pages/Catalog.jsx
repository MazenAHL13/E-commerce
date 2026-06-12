import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProductos } from "../services/api.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoria = searchParams.get("categoria") || "todos";
  const search = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    setLoading(true);
    fetchProductos({ categoria, search, sort })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [categoria, search, sort]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  }

  return (
    <section className="section container">
      <div className="section__header">
        <div>
          <h1 className="section__title">
            Catálogo <span>Gaming</span>
          </h1>
          <p className="section__desc">
            {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <CategoryFilter
        active={categoria}
        onChange={(cat) => updateParam("categoria", cat === "todos" ? "" : cat)}
      />

      <div className="filters">
        <input
          type="search"
          className="filters__search"
          placeholder="Buscar por nombre, marca o etiqueta..."
          value={search}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select
          className="filters__select"
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando catálogo...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}

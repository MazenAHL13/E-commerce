import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductos } from "../services/api.js";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos()
      .then((products) => {
        const destacados = products.filter((p) => p.destacado);
        setFeatured((destacados.length > 0 ? destacados : products).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero container">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Nueva temporada gaming 2026
        </div>

        <h1 className="hero__title">
          Hardware <span>Extremo</span>
          <br />
          Para Gamers Elite
        </h1>

        <p className="hero__subtitle">
          GPUs flagship, periféricos pro y setups de alta gama.
          Rendimiento sin límites con estilo neón.
        </p>

        <div className="hero__actions">
          <Link to="/catalogo" className="btn btn--primary btn--lg">
            Explorar catálogo
          </Link>
          <Link to="/catalogo?categoria=electronica" className="btn btn--outline btn--lg">
            Ver electrónica
          </Link>
        </div>

        <div className="hero__stats">
          <div>
            <div className="hero__stat-value">500+</div>
            <div className="hero__stat-label">Productos premium</div>
          </div>
          <div>
            <div className="hero__stat-value">24h</div>
            <div className="hero__stat-label">Envío express</div>
          </div>
          <div>
            <div className="hero__stat-value">2 años</div>
            <div className="hero__stat-label">Garantía extendida</div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="featured-banner">
          <div className="featured-banner__content">
            <div className="featured-banner__label">Oferta limitada</div>
            <h2 className="featured-banner__title">Hasta 15% en Flagship</h2>
            <p className="featured-banner__text">
              RTX 4090, monitores 240Hz y PCs prebuilt con descuento exclusivo.
            </p>
          </div>
          <Link to="/catalogo" className="btn btn--primary">
            Ver ofertas
          </Link>
        </div>
      </div>

      <section className="section container">
        <div className="section__header">
          <div>
            <h2 className="section__title">
              Productos <span>Destacados</span>
            </h2>
            <p className="section__desc">Lo mejor de nuestra selección premium</p>
          </div>
          <Link to="/catalogo" className="btn btn--outline btn--sm">
            Ver todo
          </Link>
        </div>

        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : (
          <ProductGrid products={featured} />
        )}
      </section>
    </>
  );
}

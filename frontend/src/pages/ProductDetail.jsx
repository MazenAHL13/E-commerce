import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductoById } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

function formatPrice(price) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD"
  }).format(price);
}

function formatSpecKey(key) {
  return key.replace(/_/g, " ");
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProductoById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="loading container">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="not-found container">
        <h1 className="not-found__title">404</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Producto no encontrado
        </p>
        <Link to="/catalogo" className="btn btn--primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const specs = Object.entries(product.atributos || {});

  return (
    <section className="product-detail container">
      <div className="product-detail__grid">
        <div className="product-detail__image-wrap">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="product-detail__image"
          />
        </div>

        <div>
          <div className="product-detail__brand">{product.marca}</div>
          <h1 className="product-detail__title">{product.nombre}</h1>
          <div className="product-detail__price">
            {formatPrice(product.precio)}
            {product.precioAnterior && (
              <span className="product-card__price-old" style={{ fontSize: "1.2rem" }}>
                {formatPrice(product.precioAnterior)}
              </span>
            )}
          </div>

          <p className="product-detail__desc">{product.descripcion}</p>

          {product.variantes?.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Variantes:{" "}
              </span>
              {product.variantes.map((v) => (
                <span key={v} className="product-card__tag" style={{ marginRight: "0.4rem" }}>
                  {v}
                </span>
              ))}
            </div>
          )}

          {specs.length > 0 && (
            <div className="specs">
              {specs.map(([key, value]) => (
                <div key={key} className="specs__row">
                  <span className="specs__label">{formatSpecKey(key)}</span>
                  <span className="specs__value">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="qty-control">
            <button
              className="qty-control__btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="qty-control__value">{quantity}</span>
            <button
              className="qty-control__btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
            <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>
              {product.stock} en stock
            </span>
          </div>

          <div className="detail-actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => addItem(product, quantity)}
            >
              Añadir al carrito
            </button>
            <Link to="/catalogo" className="btn btn--outline btn--lg">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

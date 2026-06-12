import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function formatPrice(price) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD"
  }).format(price);
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const hasDiscount = product.precioAnterior && product.precioAnterior > product.precio;

  return (
    <article className="product-card">
      <Link to={`/producto/${product.id}`} className="product-card__image-wrap">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-card__image"
          loading="lazy"
        />
        {product.destacado && (
          <span className="product-card__badge">Flagship</span>
        )}
        {hasDiscount && (
          <span className="product-card__badge product-card__badge--sale" style={{ left: "auto", right: 12 }}>
            Oferta
          </span>
        )}
      </Link>

      <div className="product-card__body">
        <span className="product-card__brand">{product.marca}</span>
        <Link to={`/producto/${product.id}`}>
          <h3 className="product-card__name">{product.nombre}</h3>
        </Link>

        <div className="product-card__tags">
          {product.etiquetas.slice(0, 3).map((tag) => (
            <span key={tag} className="product-card__tag">{tag}</span>
          ))}
        </div>

        <div className="product-card__footer">
          <div>
            <span className="product-card__price">{formatPrice(product.precio)}</span>
            {hasDiscount && (
              <span className="product-card__price-old">
                {formatPrice(product.precioAnterior)}
              </span>
            )}
          </div>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => addItem(product)}
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}

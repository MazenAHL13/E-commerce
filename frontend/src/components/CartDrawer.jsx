import { useCart } from "../context/CartContext.jsx";

function formatPrice(price) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD"
  }).format(price);
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    totalPrice,
    clearCart
  } = useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "cart-overlay--open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Tu Carrito</h2>
          <button
            className="btn-icon"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <p>Tu carrito está vacío</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                Explora el catálogo y añade productos
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="cart-item__image"
                />
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.nombre}</div>
                  <div className="cart-item__price">
                    {formatPrice(item.precio)} × {item.quantity}
                  </div>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total">
              <span className="cart-total__label">Total</span>
              <span className="cart-total__value">{formatPrice(totalPrice)}</span>
            </div>
            <button className="btn btn--primary btn--full" style={{ marginBottom: "0.5rem" }}>
              Finalizar compra
            </button>
            <button className="btn btn--ghost btn--full btn--sm" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

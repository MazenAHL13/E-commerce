import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <svg className="logo__icon" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 4L32 12V24L18 32L4 24V12L18 4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path d="M18 10L26 14V22L18 26L10 22V14L18 10Z" fill="currentColor" opacity="0.5" />
          </svg>
          NEXUS
        </Link>

        <nav className={`nav ${menuOpen ? "nav--open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalogo"
            className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/demo-api"
            className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Demo API
          </NavLink>
        </nav>

        <div className="header__actions">
          <button
            className="btn-icon mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </>
              )}
            </svg>
          </button>

          <button
            className="btn-icon"
            onClick={() => setIsOpen(true)}
            aria-label="Carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
              <path d="M6 6L5 3H2" />
            </svg>
            {totalItems > 0 && (
              <span className="btn-icon__badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

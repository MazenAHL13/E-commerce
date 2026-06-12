import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">NEXUS</div>
            <p className="footer__text">
              Tu destino para hardware gaming y productos de alta gama.
              Rendimiento extremo, diseño impecable.
            </p>
          </div>

          <div>
            <h4 className="footer__heading">Tienda</h4>
            <ul className="footer__links">
              <li><Link to="/catalogo" className="footer__link">Catálogo</Link></li>
              <li><Link to="/catalogo?categoria=gpu" className="footer__link">GPUs</Link></li>
              <li><Link to="/catalogo?categoria=pc" className="footer__link">PC Gaming</Link></li>
              <li><Link to="/catalogo?categoria=perifericos" className="footer__link">Periféricos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__heading">Soporte</h4>
            <ul className="footer__links">
              <li><span className="footer__link">Envíos express</span></li>
              <li><span className="footer__link">Garantía extendida</span></li>
              <li><span className="footer__link">Devoluciones 30 días</span></li>
              <li><span className="footer__link">Contacto</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} NEXUS Gaming Store — Proyecto E-commerce
        </div>
      </div>
    </footer>
  );
}

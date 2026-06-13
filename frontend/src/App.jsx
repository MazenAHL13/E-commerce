import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ApiDemo from "./pages/ApiDemo.jsx";

export default function App() {
  return (
    <div className="app">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow bg-glow--left" aria-hidden="true" />
      <div className="bg-glow bg-glow--right" aria-hidden="true" />

      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/demo-api" element={<ApiDemo />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

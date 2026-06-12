import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="loading">
        No se encontraron productos con esos filtros.
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

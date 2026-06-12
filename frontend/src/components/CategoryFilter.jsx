import { CATEGORIES } from "../data/products.js";

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`chip ${active === cat.id ? "chip--active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

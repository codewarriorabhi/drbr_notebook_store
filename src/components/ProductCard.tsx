import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Eye } from "lucide-react";

interface Props {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: Props) => {
  const { addItem } = useCart();

  return (
    <article className="glass-surface rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:shadow-[var(--shadow-card)] group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="w-full h-48 sm:h-56 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
      </Link>
      <div className="p-3.5 sm:p-4 flex flex-col gap-3">
        <Link to={`/product/${product.id}`}>
          <h4 className="text-sm sm:text-base font-bold text-foreground truncate hover:text-primary transition-colors">{product.title}</h4>
        </Link>
        {product.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-lg sm:text-xl font-extrabold text-primary">${product.price.toFixed(2)}</span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2.5 rounded-lg glass-surface font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-1.5 text-foreground"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </Link>
            {showAddToCart && (
              <button
                onClick={() => addItem(product)}
                className="flex-1 sm:flex-none px-4 sm:px-4 py-2.5 rounded-lg gradient-cart-btn font-extrabold text-xs sm:text-sm transition-transform hover:-translate-y-0.5 hover:shadow-md touch-target"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

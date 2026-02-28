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
        <div className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
      </Link>
      <div className="p-3.5 flex flex-col gap-3">
        <Link to={`/product/${product.id}`}>
          <h4 className="text-sm font-bold text-foreground truncate hover:text-primary transition-colors">{product.title}</h4>
        </Link>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-primary">${product.price.toFixed(2)}</span>
          <div className="flex gap-1.5">
            <Link
              to={`/product/${product.id}`}
              className="px-2.5 py-2 rounded-lg glass-surface font-bold text-xs transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center gap-1 text-foreground"
            >
              <Eye className="w-3 h-3" />
              View
            </Link>
            {showAddToCart && (
              <button
                onClick={() => addItem(product)}
                className="px-3 py-2 rounded-lg gradient-cart-btn font-extrabold text-xs transition-transform hover:-translate-y-0.5 hover:shadow-md"
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

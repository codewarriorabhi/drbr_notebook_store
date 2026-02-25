import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: Props) => {
  const { addItem } = useCart();

  return (
    <article className="glass-surface rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:shadow-[var(--shadow-card)]">
      <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
      <div className="p-3.5 flex flex-col gap-3">
        <h4 className="text-sm font-bold text-foreground truncate">{product.title}</h4>
        <div className="flex items-center justify-between gap-2">
          <span className="font-extrabold text-primary">${product.price.toFixed(2)}</span>
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
    </article>
  );
};

export default ProductCard;

import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />
      {/* Drawer */}
      <aside className="fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col glass-surface border-l border-border animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Cart ({totalItems})</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 opacity-40" />
              <p className="text-sm font-medium">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 glass-surface rounded-lg p-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground truncate">{product.title}</h4>
                      <p className="text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 rounded-lg gradient-cta font-bold text-sm tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;

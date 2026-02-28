import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import { ArrowLeft, Minus, Plus, ShoppingCart, Package, CheckCircle, AlertTriangle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-extrabold text-foreground">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
            <Link to="/" className="inline-block mt-4 px-6 py-3 rounded-lg gradient-cta font-bold text-sm hover:-translate-y-0.5 transition-transform">
              Back to Shop
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const inStock = (product.stock ?? 0) > 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <CartDrawer />
      <main className="flex-1 section-max-width px-5 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Product Image */}
          <div className="glass-surface rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              {product.brand && (
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/70">
                  {product.brand}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">
                {product.title}
              </h1>
            </div>

            <p className="text-3xl font-black text-primary">
              ₹{(product.price * 83).toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (${product.price.toFixed(2)})
              </span>
            </p>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {product.size && (
                <div className="glass-surface rounded-lg p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Size</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{product.size}</p>
                </div>
              )}
              {product.pages && (
                <div className="glass-surface rounded-lg p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Pages</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{product.pages}</p>
                </div>
              )}
              {product.color && (
                <div className="glass-surface rounded-lg p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Color</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{product.color}</p>
                </div>
              )}
              <div className="glass-surface rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Category</span>
                <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{product.category}</p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2">
                <div className="flex items-center glass-surface rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-3 hover:bg-accent/20 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="px-5 py-3 text-sm font-bold text-foreground min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock ?? 99, q + 1))}
                    className="px-3 py-3 hover:bg-accent/20 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg gradient-cta font-extrabold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-cta)] active:translate-y-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ProductDetail;

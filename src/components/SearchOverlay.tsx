import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { products, featuredProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const allProducts = [...products, ...featuredProducts].filter(
  (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
);

const SearchOverlay = ({ open, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const { addItem } = useCart();

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-safe sm:pt-[10vh] px-3 sm:px-4 animate-fade-in">
        <div
          className="w-full max-w-lg glass-surface rounded-xl border border-border shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 sm:py-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search notebooks, journals, planners…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
            <button
              onClick={onClose}
              className="p-2 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <ul className="max-h-[60vh] sm:max-h-[50vh] overflow-y-auto p-2 scrollbar-hide">
            {results.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">
                No products found
              </li>
            ) : (
              results.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {p.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">
                    ${p.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addItem(p)}
                    className="hidden sm:flex opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg gradient-cart-btn text-xs font-bold transition-opacity touch-target"
                  >
                    Add
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;

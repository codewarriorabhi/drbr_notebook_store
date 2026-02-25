import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { featuredProducts } from "@/data/products";

const FeaturedSlider = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * trackRef.current.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="section-max-width px-5 my-6">
      <h3 className="text-primary font-extrabold text-xl mb-4">Featured Picks</h3>
      <div className="relative flex items-center">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-1 z-10 w-10 h-10 rounded-lg bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div ref={trackRef} className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 py-3 no-scrollbar">
          {featuredProducts.map(p => (
            <div key={p.id} className="flex-shrink-0 w-64 snap-start">
              <ProductCard product={p} showAddToCart={false} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-1 z-10 w-10 h-10 rounded-lg bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedSlider;

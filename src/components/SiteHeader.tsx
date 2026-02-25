import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const SiteHeader = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40" style={{ backdropFilter: "blur(6px)" }}>
      <div
        className={`section-max-width mx-3 sm:mx-5 my-2.5 px-4 sm:px-5 py-2.5 rounded-xl flex items-center gap-4 glass-surface transition-shadow duration-300 ${
          sticky ? "shadow-[0_8px_30px_hsl(220_40%_5%/0.6)]" : ""
        }`}
      >
        {/* Logo */}
        <a href="#" className="text-primary font-bold text-lg tracking-tight whitespace-nowrap">
          Dr. Br. Notebook Store
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 justify-center" aria-label="Primary">
          <ul className="flex gap-1">
            {["Home", "Shop", "About", "Contact"].map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="px-3 py-2 rounded-lg text-muted-foreground font-semibold text-sm hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button className="hidden sm:inline-flex p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Open cart"
            onClick={openCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-1 shadow-md">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden mx-3 mt-1 glass-surface rounded-xl p-3 shadow-lg animate-fade-in" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {["Home", "Shop", "About", "Contact"].map(link => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="block px-3 py-2.5 rounded-lg text-muted-foreground font-semibold text-sm hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;

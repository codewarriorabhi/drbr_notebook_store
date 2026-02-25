import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const ShopSection = () => (
  <section className="section-max-width px-5 my-7" id="shop">
    <h3 className="text-primary font-extrabold text-xl mb-4">Featured Products</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
);

export default ShopSection;

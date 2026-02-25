import SiteHeader from "@/components/SiteHeader";
import HeroBanner from "@/components/HeroBanner";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedSlider from "@/components/FeaturedSlider";
import ShopSection from "@/components/ShopSection";
import NewsletterSection from "@/components/NewsletterSection";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";

const Index = () => (
  <div className="min-h-screen">
    <SiteHeader />
    <main>
      <HeroBanner />
      <CategoriesSection />
      <FeaturedSlider />
      <ShopSection />
      <NewsletterSection />
    </main>
    <SiteFooter />
    <CartDrawer />
  </div>
);

export default Index;

import heroImg from "@/assets/hero-notebooks.jpg";

const HeroBanner = () => {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center px-5 py-10 rounded-2xl mx-3 sm:mx-5 my-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(180deg, hsl(220 40% 5% / 0.45), hsl(220 40% 5% / 0.25)), url(${heroImg})` }}
      id="hero"
    >
      <div className="relative z-10 text-center max-w-3xl animate-hero-up flex flex-col items-center gap-4 px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-lg leading-tight">
          Premium Quality Notebooks
        </h1>
        <p className="text-base sm:text-lg font-semibold text-foreground/85">
          Best notebooks for school &amp; office
        </p>
        <a
          href="#shop"
          className="mt-2 inline-flex px-6 py-3 rounded-xl font-bold text-sm gradient-cta shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default HeroBanner;

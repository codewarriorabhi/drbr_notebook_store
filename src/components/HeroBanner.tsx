import { useState, useEffect, useCallback } from "react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.png";
import heroSlide4 from "@/assets/hero-slide-4.jpg";

const slides = [heroSlide1, heroSlide4, heroSlide2, heroSlide3];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section
      className="relative mx-3 sm:mx-5 my-4 rounded-2xl overflow-hidden"
      id="hero"
      style={{ aspectRatio: "30 / 21" }}
    >
      {/* Slides */}
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform:
              i === current
                ? "scale(1) translateX(0)"
                : `scale(1.08) translateX(${direction * 6}%)`,
            zIndex: i === current ? 2 : 1,
          }}
        >
          <img
            src={src}
            alt={`7 Star Notebook slide ${i + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-10 sm:pb-16 px-6">
        <div className="text-center max-w-3xl animate-fade-in flex flex-col items-center gap-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-lg leading-tight">
            7 Star — Premium Notebooks
          </h1>
          <p className="text-sm sm:text-base font-semibold text-foreground/85">
            Smooth Writing · Whiteness &amp; Excellent Quality
          </p>
          <a
            href="#shop"
            className="mt-2 inline-flex px-6 py-3 rounded-xl font-bold text-sm gradient-cta shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary scale-125 shadow-md shadow-primary/40"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/60 transition-colors"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur flex items-center justify-center text-foreground hover:bg-background/60 transition-colors"
        aria-label="Next slide"
      >
        ›
      </button>
    </section>
  );
};

export default HeroBanner;
